import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import JudgeGuideModal from '../components/JudgeGuideModal';
import GraphicalFitModal from '../components/GraphicalFitModal';
import PitchChallengeModal from '../components/PitchChallengeModal';
import RejectionFeedbackModal from '../components/RejectionFeedbackModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CareerPilot v2 | Production AI Job-Search & Talent Agent (AA-35)',
  description:
    'Production-grade transparent AI job agent for students, job seekers, and recruiters with lockable portfolios, 60s pitch trainer, zero black-box scoring, and human-in-the-loop review.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Toast />
          <JudgeGuideModal />
          <GraphicalFitModal />
          <PitchChallengeModal />
          <RejectionFeedbackModal />
        </AppProvider>
      </body>
    </html>
  );
}
