'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Compass,
  Trophy,
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  Lock,
  Zap,
  LogOut,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function JourneyPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
      setLoading(false);
    }
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const questNodes = [
    {
      id: 1,
      title: 'Quest 1: The First Repository',
      description: 'Initialize a new repository and inspect git status.',
      command: 'git init',
      status: 'completed',
      xp: 100,
      icon: GitCommit,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      id: 2,
      title: 'Quest 2: Staging & Committing',
      description: 'Stage files with git add and craft your first commit.',
      command: 'git add . && git commit -m "feat: init"',
      status: 'active',
      xp: 150,
      icon: GitBranch,
      color: 'from-teal-500 to-cyan-600',
    },
    {
      id: 3,
      title: 'Quest 3: Branching Multiverse',
      description: 'Create parallel universe feature branches safely.',
      command: 'git checkout -b feature/magic',
      status: 'locked',
      xp: 200,
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 4,
      title: 'Quest 4: Resolving Conflicts',
      description: 'Master merge conflicts and rebase with confidence.',
      command: 'git merge feature/magic',
      status: 'locked',
      xp: 250,
      icon: GitPullRequest,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      id: 5,
      title: 'Quest 5: GitHub Remote Sync',
      description: 'Connect local repos to GitHub and send pull requests.',
      command: 'git push -u origin main',
      status: 'locked',
      xp: 300,
      icon: Trophy,
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-emerald-500 selection:text-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
              <Compass className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              GitWorld Journey
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {userEmail ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                  {userEmail}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/"
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 rounded-lg"
              >
                Back to Home
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Journey Map */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* User Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 mb-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-xs text-emerald-400 font-mono mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Level 2 Git Explorer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome to your Interactive Quest Map
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                Complete quests to unlock advanced branch manipulation & repository tools.
              </p>
            </div>

            {/* EXP Bar */}
            <div className="w-full md:w-72 bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-zinc-400 font-medium">Rank Progress</span>
                <span className="text-emerald-400 font-bold">250 / 1000 XP</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2.5 rounded-full w-[25%]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quest Nodes Path */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            <span>Campaign Quests</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {questNodes.map((quest, index) => {
              const Icon = quest.icon;
              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    quest.status === 'completed'
                      ? 'bg-zinc-900/80 border-emerald-500/40'
                      : quest.status === 'active'
                      ? 'bg-zinc-900/90 border-teal-400/80 shadow-lg shadow-teal-500/10'
                      : 'bg-zinc-950/60 border-zinc-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3.5 rounded-xl bg-gradient-to-tr ${quest.color} text-zinc-950 shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-zinc-100">{quest.title}</h3>
                        {quest.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        )}
                        {quest.status === 'active' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-800/60">
                            <Zap className="w-3 h-3 animate-pulse" /> Active Node
                          </span>
                        )}
                        {quest.status === 'locked' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{quest.description}</p>
                      <div className="mt-2 text-xs font-mono text-emerald-400 bg-zinc-950 px-2.5 py-1 rounded-md w-fit border border-zinc-900">
                        {quest.command}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-lg">
                      +{quest.xp} XP
                    </span>
                    <button
                      disabled={quest.status === 'locked'}
                      className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${
                        quest.status === 'active'
                          ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-zinc-950 hover:scale-105 shadow-md shadow-teal-500/20'
                          : quest.status === 'completed'
                          ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                          : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{quest.status === 'completed' ? 'Replay' : quest.status === 'active' ? 'Launch Quest' : 'Locked'}</span>
                      {quest.status !== 'locked' && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
