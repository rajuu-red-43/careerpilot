import crypto from 'crypto';
import { UserRole, UserSession } from './types';

// =========================================================================
// Environment & Configuration for Authentication
// =========================================================================

export const AUTH_CONFIG = {
  // Secret key used to sign session cookies with HMAC-SHA256
  get sessionSecret(): string {
    return (
      (process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || '').trim() ||
      'careerpilot-v2-production-hmac-sha256-secret-encryption-token-32chars'
    );
  },

  // Cookie configuration
  sessionCookieName: 'careerpilot_session',
  sessionMaxAge: 30 * 24 * 60 * 60, // 30 days

  // OTP Configuration
  otpExpiryMs: 5 * 60 * 1000, // 5 minutes
  otpCooldownSeconds: 60, // 60 seconds resend cooldown
  maxOtpAttempts: 5, // max failed verification attempts before invalidation
  maxOtpRequestsPerHour: 10, // rate-limiting
};

/**
 * Dynamically resolves the application's base URL across localhost,
 * Vercel Preview, and Vercel Production.
 */
export function getAppBaseUrl(req?: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim()}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.trim()}`;
  }
  if (req) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    if (host) {
      return `${proto}://${host}`;
    }
  }
  if (process.env.NODE_ENV === 'production') {
    return 'https://careerpilot-git-main-alpha-8569.vercel.app';
  }
  return 'http://localhost:3000';
}

/**
 * Normalizes phone numbers to standard E.164 format.
 * Defaults 10-digit numbers to +91 (India).
 */
export function normalizePhoneNumber(rawPhone: string): string {
  const cleaned = rawPhone.replace(/[^\d+]/g, '').trim();
  if (cleaned.startsWith('+')) {
    return cleaned;
  }
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

export function isValidPhoneNumber(phone: string): boolean {
  const normalized = normalizePhoneNumber(phone);
  // Standard E.164 international phone number: + followed by 10 to 15 digits
  return /^\+[1-9]\d{9,14}$/.test(normalized);
}

// =========================================================================
// Cryptographic In-Memory Token Manager for Secure Phone OTP
// Never stores raw OTPs - only stores HMAC-SHA256 salted hashes.
// =========================================================================

interface OtpRecord {
  phone: string;
  hash: string;
  salt: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

interface RateLimitRecord {
  count: number;
  windowStart: number;
}

class PhoneOtpManager {
  private static instance: PhoneOtpManager;
  private otps: Map<string, OtpRecord> = new Map();
  private rateLimits: Map<string, RateLimitRecord> = new Map();

  private constructor() {
    // Periodic garbage collection for expired entries
    if (typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanup(), 60000);
    }
  }

  public static getInstance(): PhoneOtpManager {
    if (!PhoneOtpManager.instance) {
      PhoneOtpManager.instance = new PhoneOtpManager();
    }
    return PhoneOtpManager.instance;
  }

  private hashOtp(phone: string, otp: string, salt: string): string {
    return crypto
      .createHmac('sha256', AUTH_CONFIG.sessionSecret)
      .update(`${phone}:${otp}:${salt}`)
      .digest('hex');
  }

  private cleanup() {
    const now = Date.now();
    for (const [phone, record] of this.otps.entries()) {
      if (now > record.expiresAt) {
        this.otps.delete(phone);
      }
    }
    for (const [key, limit] of this.rateLimits.entries()) {
      if (now - limit.windowStart > 60 * 60 * 1000) {
        this.rateLimits.delete(key);
      }
    }
  }

  public createOtp(rawPhone: string): {
    success: boolean;
    otp?: string;
    message: string;
    cooldownSeconds?: number;
  } {
    const phone = normalizePhoneNumber(rawPhone);
    const now = Date.now();

    // 1. Check Rate Limit (max 10 requests per hour)
    const limit = this.rateLimits.get(phone) || { count: 0, windowStart: now };
    if (now - limit.windowStart > 60 * 60 * 1000) {
      limit.count = 0;
      limit.windowStart = now;
    }
    if (limit.count >= AUTH_CONFIG.maxOtpRequestsPerHour) {
      return {
        success: false,
        message: 'Too many OTP requests. Please wait an hour before requesting again.',
      };
    }

    // 2. Check Cooldown (60s)
    const existing = this.otps.get(phone);
    if (existing && now - existing.lastSentAt < AUTH_CONFIG.otpCooldownSeconds * 1000) {
      const remainingSeconds = Math.ceil(
        (AUTH_CONFIG.otpCooldownSeconds * 1000 - (now - existing.lastSentAt)) / 1000
      );
      return {
        success: false,
        message: `Please wait ${remainingSeconds} seconds before requesting a new OTP.`,
        cooldownSeconds: remainingSeconds,
      };
    }

    // 3. Generate Cryptographically Secure 6-digit OTP
    const otpInt = crypto.randomInt(100000, 999999);
    const otp = otpInt.toString();
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = this.hashOtp(phone, otp, salt);

    this.otps.set(phone, {
      phone,
      hash,
      salt,
      createdAt: now,
      expiresAt: now + AUTH_CONFIG.otpExpiryMs,
      attempts: 0,
      lastSentAt: now,
    });

    limit.count += 1;
    this.rateLimits.set(phone, limit);

    return {
      success: true,
      otp, // Used by SMS sender service or demo fallback; NOT stored in plaintext
      message: 'OTP sent successfully.',
      cooldownSeconds: AUTH_CONFIG.otpCooldownSeconds,
    };
  }

  public verifyOtp(
    rawPhone: string,
    submittedOtp: string
  ): { success: boolean; message: string; remainingAttempts?: number } {
    const phone = normalizePhoneNumber(rawPhone);
    const record = this.otps.get(phone);
    const now = Date.now();

    if (!record) {
      return {
        success: false,
        message: 'No active OTP request found. Please request a new OTP.',
      };
    }

    if (now > record.expiresAt) {
      this.otps.delete(phone);
      return {
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      };
    }

    if (record.attempts >= AUTH_CONFIG.maxOtpAttempts) {
      this.otps.delete(phone);
      return {
        success: false,
        message: 'Maximum verification attempts exceeded. Please request a new OTP.',
      };
    }

    // Compute submitted OTP hash
    const submittedHash = this.hashOtp(phone, submittedOtp.trim(), record.salt);
    const recordHashBuf = Buffer.from(record.hash, 'hex');
    const submittedHashBuf = Buffer.from(submittedHash, 'hex');

    const isValid =
      recordHashBuf.length === submittedHashBuf.length &&
      crypto.timingSafeEqual(recordHashBuf, submittedHashBuf);

    if (!isValid) {
      record.attempts += 1;
      const remaining = AUTH_CONFIG.maxOtpAttempts - record.attempts;
      if (remaining <= 0) {
        this.otps.delete(phone);
        return {
          success: false,
          message: 'Incorrect OTP. Maximum attempts reached. Please request a new code.',
        };
      }
      return {
        success: false,
        message: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        remainingAttempts: remaining,
      };
    }

    // OTP verified successfully -> invalidate immediately to prevent replay
    this.otps.delete(phone);
    return {
      success: true,
      message: 'OTP verified successfully.',
    };
  }
}

export const phoneOtpManager = PhoneOtpManager.getInstance();

// =========================================================================
// Cryptographic HMAC-SHA256 Session Signing & Verification
// =========================================================================

/**
 * Cryptographically signs a session payload using HMAC-SHA256.
 * Returns format: `${base64payload}.${signature}`
 */
export function signSession(session: UserSession): string {
  const payloadStr = JSON.stringify(session);
  const encodedPayload = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_CONFIG.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 signed session token.
 * Returns the decoded UserSession or null if invalid or tampered with.
 */
export function verifySession(token: string | undefined | null): UserSession | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, receivedSignature] = parts;

  // Re-compute signature
  const expectedSignature = crypto
    .createHmac('sha256', AUTH_CONFIG.sessionSecret)
    .update(encodedPayload)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  const receivedBuf = Buffer.from(receivedSignature, 'utf8');
  const expectedBuf = Buffer.from(expectedSignature, 'utf8');

  if (receivedBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(receivedBuf, expectedBuf)) return null;

  try {
    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const parsed = JSON.parse(payloadStr) as UserSession;

    // Check expiration if present
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
