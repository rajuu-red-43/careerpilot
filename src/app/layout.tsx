import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import JudgeGuideModal from '../components/JudgeGuideModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CareerPilot | Transparent AI Job-Search & Application Agent (AA-35)',
  description:
    'Autonomous AI job agent for students, job seekers, and recruiters with zero black-box scoring, human-in-the-loop review checkpoints, and n8n workflow integration.',
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
        </AppProvider>
      </body>
    </html>
  );
}
