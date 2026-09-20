import type { Metadata } from 'next';
import { Dela_Gothic_One, Space_Grotesk } from 'next/font/google';
import './globals.css';
import ReactiveBackground from '@/components/ReactiveBackground';

const delaGothic = Dela_Gothic_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dela',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GitWorld - Interactive Git & GitHub Learning',
  description: 'Master Git commands, branching, and repository workflows through interactive gamified quests.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${delaGothic.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[#F8F4E8] relative">
        <ReactiveBackground />
        {children}
      </body>
    </html>
  );
}
