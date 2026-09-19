'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, ShieldCheck, Terminal, Zap, ArrowRight, Trophy, Code2 } from 'lucide-react';

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 relative overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/20 via-teal-500/15 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-emerald-500/30 text-xs text-emerald-400 font-medium shadow-inner"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Interactive Git Learning Reimagined</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight"
            >
              Master Git & GitHub{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Through Gamified Quests
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              Learning Git doesn't need to be boring. Dive into GitWorld to visualize commits, conquer interactive merge conflicts, and level up your developer workflow step-by-step.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={() => setIsAuthOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-zinc-950 font-extrabold text-base rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Start Free Journey</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold text-base rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Explore Features</span>
              </a>
            </motion.div>
          </div>

          {/* Interactive Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto bg-zinc-900/70 border border-zinc-800/80 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative"
          >
            <div className="flex items-center gap-2 pb-4 border-b border-zinc-800/60">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-zinc-500">gitworld-terminal ~/quest-01</span>
            </div>

            <div className="mt-4 p-4 bg-zinc-950/80 rounded-xl font-mono text-xs sm:text-sm text-emerald-400 space-y-2 border border-zinc-900">
              <div className="flex items-center gap-2 text-zinc-400">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>$ git init my-awesome-project</span>
              </div>
              <p className="text-zinc-500">Initialized empty Git repository in /quests/my-awesome-project/.git/</p>
              <div className="flex items-center gap-2 text-zinc-400 pt-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>$ git commit -m "feat: level up git skills"</span>
              </div>
              <p className="text-emerald-300">[main (root-commit) 8f3a1b] feat: level up git skills ✨</p>
              <p className="text-purple-400 text-xs pt-1">🎉 Quest 1 Completed! +100 EXP earned!</p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <section id="features" className="mt-28">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Why Learn Git with GitWorld?
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Interactive tools designed to make version control crystal clear.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-zinc-900/60 border border-zinc-800/70 rounded-2xl hover:border-emerald-500/50 transition-all group">
                <div className="p-3 bg-emerald-500/10 w-fit rounded-xl border border-emerald-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <GitCommit className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Visual Branch Tree</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Watch branches merge, rebase, and cherry-pick in real-time with smooth interactive node graphics.
                </p>
              </div>

              <div className="p-6 bg-zinc-900/60 border border-zinc-800/70 rounded-2xl hover:border-teal-500/50 transition-all group">
                <div className="p-3 bg-teal-500/10 w-fit rounded-xl border border-teal-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Gamified Quests</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Earn badges, level up your developer profile, and conquer challenge levels designed like RPG quests.
                </p>
              </div>

              <div className="p-6 bg-zinc-900/60 border border-zinc-800/70 rounded-2xl hover:border-cyan-500/50 transition-all group">
                <div className="p-3 bg-cyan-500/10 w-fit rounded-xl border border-cyan-500/20 mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-zinc-100 mb-2">Safe Sandbox Environment</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Experiment freely with destructive commands like `git reset --hard` without fear of breaking real repos.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-8 bg-zinc-950 text-center text-xs text-zinc-500">
        <p>© 2026 GitWorld. Built with Next.js 14, Tailwind CSS & Supabase.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="signup"
      />
    </div>
  );
}
