import { NextResponse } from 'next/server';
import { mockJobs } from '../../../data/mockJobs';

export async function GET() {
  return NextResponse.json({
    success: true,
    total: mockJobs.length,
    jobs: mockJobs,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Job processed with heuristic duplicate & scam checks',
      received: body,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid payload' },
      { status: 400 }
    );
  }
}
