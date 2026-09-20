'use client';

import Link from 'next/link';
import { ArrowLeft, Zap, Trophy, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface JourneyHeaderProps {
  userEmail?: string | null;
  xp?: number;
  level?: number;
}

export default function JourneyHeader({ userEmail, xp = 250, level = 2 }: JourneyHeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
      <div className="w-full h-16 sm:h-20 bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] px-4 sm:px-8 flex items-center justify-between shadow-[4px_4px_0px_0px_#09090B]">
        {/* Left: Back Link & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="p-2 sm:p-2.5 bg-white hover:bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer flex items-center justify-center"
            title="Return to Home"
          >
            <ArrowLeft className="w-4 h-4 text-[#09090B]" />
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/" className="font-heading text-lg sm:text-2xl text-[#09090B] tracking-tighter hover:opacity-80 transition-opacity">
              GITWORLD
            </Link>
            <span className="font-mono-brutal font-bold text-xs text-[#09090B]/40 hidden sm:inline">//</span>
            <span className="font-mono-brutal font-bold text-xs uppercase text-[#09090B] bg-[#D2E823] px-2 py-0.5 border border-[#09090B] rounded shadow-[2px_2px_0px_0px_#09090B] hidden sm:inline-block">
              CURRICULUM TREE
            </span>
          </div>
        </div>

        {/* Right: XP Stats & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white border-2 border-[#09090B] rounded-[8px] px-3 py-1.5 shadow-[2px_2px_0px_0px_#09090B]">
            <Trophy className="w-3.5 h-3.5 text-[#09090B]" />
            <span className="font-mono-brutal text-xs font-bold text-[#09090B]">
              LVL {level} // {xp} XP
            </span>
          </div>

          {userEmail ? (
            <div className="flex items-center gap-2">
              <span className="hidden lg:inline font-mono-brutal text-[11px] text-[#09090B]/70 bg-white border border-[#09090B] px-2.5 py-1 rounded">
                {userEmail}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#09090B] text-[#D2E823] font-heading text-xs rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">EXIT</span>
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="px-4 py-1.5 sm:py-2 bg-[#09090B] text-[#D2E823] font-heading text-xs rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
            >
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
