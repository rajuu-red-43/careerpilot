import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  phoneOtpManager,
  normalizePhoneNumber,
  signSession,
  AUTH_CONFIG,
} from '../../../../../lib/auth';
import { UserRole, UserSession } from '../../../../../lib/types';
import { CareerPilotSupabaseClient } from '../../../../../lib/supabase';

export const dynamic = 'force-dynamic';

function getDashboardHrefForRole(role: UserRole): string {
  if (role === 'college_student') return '/student';
  if (role === 'company_recruiter') return '/recruiter';
  if (role === 'admin') return '/admin';
  return '/job-seeker';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawPhone = body?.phone;
    const otp = body?.otp;
    const selectedRole: UserRole = body?.role || 'college_student';
    const preferredLanguage = body?.preferredLanguage || 'en';
    const inputName = body?.name?.trim();

    if (!rawPhone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required.' },
        { status: 400 }
      );
    }

    const phone = normalizePhoneNumber(rawPhone);
    const verification = phoneOtpManager.verifyOtp(phone, otp);

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: verification.message,
          remainingAttempts: verification.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // OTP is valid! Retrieve or create user profile
    const db = CareerPilotSupabaseClient.getInstance();
    interface StoredProfile {
      id: string;
      phone?: string;
      name: string;
      role: UserRole;
      preferred_language?: string;
    }

    const existingProfiles = db.getTable<StoredProfile[]>('profiles', []);
    let userProfile = existingProfiles.find(p => p.phone === phone);
    let isNewUser = false;

    if (!userProfile) {
      isNewUser = true;
      userProfile = {
        id: crypto.randomUUID(),
        phone,
        name: inputName || `User ${phone.slice(-4)}`,
        role: selectedRole,
        preferred_language: preferredLanguage,
      };
      db.saveTable('profiles', [...existingProfiles, userProfile]);
    } else {
      // If role or language updated on login
      if (selectedRole && userProfile.role !== selectedRole) {
        userProfile.role = selectedRole;
      }
      if (preferredLanguage && userProfile.preferred_language !== preferredLanguage) {
        userProfile.preferred_language = preferredLanguage;
      }
      db.saveTable(
        'profiles',
        existingProfiles.map(p => (p.id === userProfile!.id ? userProfile! : p))
      );
    }

    // Build CareerPilot user session
    const session: UserSession = {
      id: userProfile.id,
      name: userProfile.name,
      phone: userProfile.phone || phone,
      role: userProfile.role,
      provider: 'phone',
      preferredLanguage: userProfile.preferred_language || preferredLanguage || 'en',
      expiresAt: Date.now() + AUTH_CONFIG.sessionMaxAge * 1000,
    };

    // Sign session token with HMAC-SHA256
    const sessionToken = signSession(session);
    const destinationPath = getDashboardHrefForRole(session.role);

    const response = NextResponse.json({
      success: true,
      user: session,
      isNewUser,
      redirectUrl: destinationPath,
    });

    // Set secure HttpOnly session cookie
    response.cookies.set(AUTH_CONFIG.sessionCookieName, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_CONFIG.sessionMaxAge,
    });

    return response;
  } catch (error: unknown) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during OTP verification.' },
      { status: 500 }
    );
  }
}
