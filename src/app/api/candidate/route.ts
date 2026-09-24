import { NextResponse } from 'next/server';
import { mockCandidateProfiles, mockInitialApplications } from '../../../data/mockProfiles';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'job_seeker';

  const profile = mockCandidateProfiles[role] || mockCandidateProfiles['job_seeker'];

  return NextResponse.json({
    success: true,
    role,
    profile,
    applications: mockInitialApplications,
  });
}
