import crypto from 'crypto';
import { UserRole, UserSession } from './types';

// =========================================================================
// Environment & Configuration for Authentication Sessions
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
