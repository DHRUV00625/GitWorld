import type { Metadata } from 'next';
import { Dela_Gothic_One, Space_Grotesk } from 'next/font/google';
import './globals.css';
import DotGrid from '@/components/DotGrid';

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
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <DotGrid
            dotSize={3}
            gap={16}
            baseColor="#09090B"
            activeColor="#D2E823"
            proximity={120}
            shockRadius={200}
            shockStrength={4}
          />
        </div>
        {children}
      </body>
    </html>
  );
}
