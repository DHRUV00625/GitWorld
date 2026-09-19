'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';
import { ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="w-full h-16 sm:h-20 bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] px-6 sm:px-8 flex items-center justify-between shadow-[4px_4px_0px_0px_#09090B]">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-heading text-xl sm:text-2xl text-[#09090B] tracking-tighter">
              GITWORLD
            </span>
            <div className="w-3 h-3 bg-[#D2E823] border border-[#09090B] rotate-45 group-hover:rotate-90 transition-transform duration-200" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-body font-bold text-xs uppercase tracking-wider text-[#09090B]">
            <Link href="#philosophy" className="hover:text-[#D2E823] hover:bg-[#09090B] px-2 py-1 rounded transition-colors">
              Philosophy
            </Link>
            <Link href="#curriculum" className="hover:text-[#D2E823] hover:bg-[#09090B] px-2 py-1 rounded transition-colors">
              Curriculum
            </Link>
            <Link href="/journey" className="flex items-center gap-1 hover:text-[#D2E823] hover:bg-[#09090B] px-2 py-1 rounded transition-colors">
              <span>Journey Map</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-[#09090B] text-[#D2E823] font-heading text-xs sm:text-sm tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 cursor-pointer"
            >
              LOGIN
            </button>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
}
