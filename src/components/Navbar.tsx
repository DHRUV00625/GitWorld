'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';
import { ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full h-20 bg-[#f2f2f2]/90 backdrop-blur-md border-b border-[#1e1e1e]/10 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-clash text-2xl font-bold tracking-[-0.05em] text-[#111111] uppercase">
              GITWORLD
            </span>
            <span className="w-2 h-2 rounded-full bg-[#111111] group-hover:bg-[#838282] transition-colors" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-satoshi font-semibold text-[#838282]">
            <Link href="#philosophy" className="hover:text-[#111111] transition-colors">
              Manifesto
            </Link>
            <Link href="#showcase" className="hover:text-[#111111] transition-colors">
              Showcase
            </Link>
            <Link href="#topics" className="hover:text-[#111111] transition-colors">
              Topics
            </Link>
            <Link href="/journey" className="hover:text-[#111111] transition-colors flex items-center gap-1">
              <span>Journey Map</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openAuth('login')}
              className="px-6 py-2.5 rounded-full border border-[#1e1e1e] text-xs uppercase tracking-widest font-satoshi font-bold text-[#111111] bg-transparent hover:bg-[#111111] hover:text-[#f2f2f2] transition-all duration-300 active:scale-95"
            >
              Log In
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
