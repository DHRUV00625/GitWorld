'use client';

import { useState } from 'react';
import Link from 'link';
import { GitBranch, Compass, Sparkles, User, LogIn } from 'lucide-react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30 group-hover:border-emerald-400/60 transition-all">
              <GitBranch className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              GitWorld
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Explore</span>
            </Link>
            <Link href="#features" className="hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/journey" className="hover:text-white transition-colors">
              Journey Map
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth('login')}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => openAuth('signup')}
              className="px-4 py-1.5 text-xs font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 rounded-lg shadow-lg shadow-emerald-500/10 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
              <span>Get Started</span>
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
