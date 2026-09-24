import { NextResponse } from 'next/server';
import { phoneOtpManager, isValidPhoneNumber, normalizePhoneNumber } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawPhone = body?.phone;

    if (!rawPhone || typeof rawPhone !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(rawPhone)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid 10-digit mobile number or standard international number.',
        },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(rawPhone);
    const otpResult = phoneOtpManager.createOtp(normalizedPhone);

    if (!otpResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.message,
          cooldownSeconds: otpResult.cooldownSeconds,
        },
        { status: 429 }
      );
    }

    // Mask phone for user display: e.g. +91 98*** **210
    const visibleStart = normalizedPhone.slice(0, 5);
    const visibleEnd = normalizedPhone.slice(-3);
    const masked = `${visibleStart}*****${visibleEnd}`;

    // Development/demo aid: provide demoOtp in development mode
    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${masked}`,
      cooldownSeconds: otpResult.cooldownSeconds,
      // Demo helper in non-production environments to allow instant testing
      ...(isDev && otpResult.otp ? { demoOtp: otpResult.otp } : {}),
    });
  } catch (error: unknown) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while sending the OTP.' },
      { status: 500 }
    );
  }
}
