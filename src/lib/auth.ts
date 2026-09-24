import crypto from 'crypto';
import { UserRole, UserSession } from './types';

// =========================================================================
// Environment & Configuration
// =========================================================================

export const AUTH_CONFIG = {
  // Google OAuth Credentials (server-side only)
  get googleClientId(): string {
    return (process.env.GOOGLE_CLIENT_ID || '').trim();
  },
  get googleClientSecret(): string {
    return (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  },

  // Secret key used to sign session cookies with HMAC-SHA256
  // Defaults to a stable fallback in development if NEXTAUTH_SECRET is not provided yet
  get sessionSecret(): string {
    return (
      (process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || '').trim() ||
      'careerpilot-v2-production-hmac-sha256-secret-encryption-token-32chars'
    );
  },

  // Cookie configuration
  sessionCookieName: 'careerpilot_session',
  oauthStateCookieName: 'careerpilot_oauth_state',

  // Google OAuth Endpoints
  googleAuthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  googleTokenUrl: 'https://oauth2.googleapis.com/token',
  googleUserInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',

  // Minimum required scopes
  scopes: ['openid', 'email', 'profile'].join(' '),
};

/**
 * Dynamically resolves the application's base URL across localhost,
 * Vercel Preview, and Vercel Production.
 */
export function getAppBaseUrl(req?: Request): string {
  // 1. Explicit environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  // 2. Vercel deployment URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Request headers if available
  if (req) {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    if (host) {
      return `${proto}://${host}`;
    }
  }

  // 4. Default production or local development fallback
  if (process.env.NODE_ENV === 'production') {
    return 'https://careerpilot-git-main-alpha-8569.vercel.app';
  }
  return 'http://localhost:3000';
}

/**
 * Generates the exact Google OAuth Redirect URI for the current environment.
 */
export function getGoogleRedirectUri(req?: Request): string {
  const baseUrl = getAppBaseUrl(req);
  return `${baseUrl}/api/auth/callback/google`;
}

// =========================================================================
// Cryptographic Helpers (PKCE, CSRF State, and HMAC Signing)
// =========================================================================

/**
 * Generate a random URL-safe base64 string
 */
export function generateRandomString(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Creates a PKCE Code Challenge (SHA-256 hash of verifier, base64url encoded)
 */
export function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

/**
 * Cryptographically signs a session payload using HMAC-SHA256
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

/**
 * OAuth State cookie structure for CSRF and PKCE
 */
export interface OAuthStateCookie {
  state: string;
  codeVerifier: string;
  targetRole: UserRole;
  callbackUrl: string;
  timestamp: number;
}

export function signOAuthState(data: OAuthStateCookie): string {
  const payloadStr = JSON.stringify(data);
  const encoded = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const signature = crypto
    .createHmac('sha256', AUTH_CONFIG.sessionSecret)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyOAuthState(token: string | undefined | null): OAuthStateCookie | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expected = crypto
    .createHmac('sha256', AUTH_CONFIG.sessionSecret)
    .update(encoded)
    .digest('base64url');

  const buf1 = Buffer.from(signature, 'utf8');
  const buf2 = Buffer.from(expected, 'utf8');
  if (buf1.length !== buf2.length || !crypto.timingSafeEqual(buf1, buf2)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    // State expires in 10 minutes
    if (Date.now() - decoded.timestamp > 10 * 60 * 1000) return null;
    return decoded;
  } catch {
    return null;
  }
}
