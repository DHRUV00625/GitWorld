'use client';

import { useState, useEffect } from 'react';
import JourneyHeader from '@/components/JourneyHeader';
import QuestModal, { QuestNodeData } from '@/components/QuestModal';
import NoiseOverlay from '@/components/NoiseOverlay';
import CustomCursor from '@/components/CustomCursor';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import {
  GitCommit,
  GitBranch,
  GitPullRequest,
  Terminal,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  Flame,
  ArrowDown,
} from 'lucide-react';

export default function JourneyFlowchartPage() {
  const [selectedQuest, setSelectedQuest] = useState<QuestNodeData | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    }
    getUser();
  }, []);

  const quests: Record<string, QuestNodeData> = {
    init: {
      id: 'init',
      stage: 'MODULE 01',
      title: '01. GIT INIT',
      branch: 'main',
      description: 'Create the repository genesis block, inspect hidden .git configuration, and verify status.',
      commands: ['git init gitworld-genesis', 'cd gitworld-genesis', 'git status'],
      xp: 100,
      status: 'completed',
      badge: 'ROOT GENESIS',
    },
    commit: {
      id: 'commit',
      stage: 'MODULE 02',
      title: '02. STAGING & COMMIT',
      branch: 'main',
      description: 'Master the three Git states: Working Directory, Staging Index, and Immutable Commit Object.',
      commands: ['git add .', 'git commit -m "feat: initial commit"'],
      xp: 150,
      status: 'completed',
      badge: 'STAGING INDEX',
    },
    logs: {
      id: 'logs',
      stage: 'MODULE 03',
      title: '03. LOGS & DIFFS',
      branch: 'main',
      description: 'Traverse the Directed Acyclic Graph, inspect parent pointer hashes, and compare delta diffs.',
      commands: ['git log --oneline --graph --all', 'git diff HEAD~1'],
      xp: 175,
      status: 'active',
      badge: 'ACTIVE QUEST',
    },
    branch_create: {
      id: 'branch_create',
      stage: 'MODULE 04',
      title: '04. BRANCH ISOLATION',
      branch: 'feature/sandbox',
      description: 'Spawn a parallel universe branch without touching main. Understand HEAD pointer movement.',
      commands: ['git checkout -b feature/sandbox', 'git branch -v'],
      xp: 200,
      status: 'active',
      badge: 'PARALLEL TRACK',
    },
    feature_work: {
      id: 'feature_work',
      stage: 'MODULE 05',
      title: '05. FEATURE WORK',
      branch: 'feature/sandbox',
      description: 'Craft isolated commits in the feature branch and inspect divergence from main trunk.',
      commands: ['git commit -am "feat: add experimental sandboxes"'],
      xp: 225,
      status: 'locked',
      badge: 'BRANCH WORK',
    },
    merge_ff: {
      id: 'merge_ff',
      stage: 'MODULE 06',
      title: '06. FAST-FORWARD MERGE',
      branch: 'main',
      description: 'Bring feature progress back to main cleanly when no divergence has occurred.',
      commands: ['git checkout main', 'git merge feature/sandbox'],
      xp: 250,
      status: 'locked',
      badge: 'SYNTHESIS',
    },
    divergent: {
      id: 'divergent',
      stage: 'MODULE 07',
      title: '07. DIVERGENT HISTORIES',
      branch: 'hotfix/urgent-patch',
      description: 'Simulate concurrent team workflows where main and side branches both advance independently.',
      commands: ['git checkout -b hotfix/urgent-patch', 'git commit -am "fix: urgent security update"'],
      xp: 275,
      status: 'locked',
      badge: 'DIVERGENCE',
    },
    conflicts: {
      id: 'conflicts',
      stage: 'MODULE 08',
      title: '08. CONFLICT RESOLUTION',
      branch: 'main',
      description: 'Face the crucible: inspect conflicting markers (<<<<<<< HEAD), resolve diffs, and seal the merge commit.',
      commands: ['git merge hotfix/urgent-patch', 'git add .', 'git commit'],
      xp: 350,
      status: 'locked',
      badge: 'CRUCIBLE',
    },
    rebase: {
      id: 'rebase',
      stage: 'MODULE 09',
      title: '09. INTERACTIVE REBASE',
      branch: 'feature/clean-history',
      description: 'Rewind and replay commits onto new bases. Squash messy intermediate commits into pristine history.',
      commands: ['git rebase -i HEAD~3', 'git rebase --continue'],
      xp: 400,
      status: 'locked',
      badge: 'LINEAR DAG',
    },
    remote_sync: {
      id: 'remote_sync',
      stage: 'MODULE 10',
      title: '10. REMOTE SYNC & PR',
      branch: 'main',
      description: 'Connect local branches to GitHub remotes, manage upstream tracking, and open pull requests.',
      commands: ['git remote add origin <url>', 'git push -u origin main'],
      xp: 500,
      status: 'locked',
      badge: 'FINAL QUEST',
    },
  };

  const renderNodeCard = (key: string) => {
    const q = quests[key];
    const isUnlocked = q.status !== 'locked';

    return (
      <div
        onClick={() => setSelectedQuest(q)}
        className={`w-full max-w-[340px] sm:max-w-[380px] p-5 rounded-[12px] border-2 border-[#09090B] transition-all duration-150 cursor-pointer text-left relative ${
          isUnlocked
            ? 'bg-[#D2E823] text-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
            : 'bg-[#F8F4E8] text-[#09090B] opacity-60 grayscale shadow-[3px_3px_0px_0px_#09090B]'
        }`}
      >
        <div className="flex items-center justify-between mb-3 border-b-2 border-[#09090B]/20 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono-brutal font-bold text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded">
              {q.stage}
            </span>
            <span className="font-mono-brutal text-[11px] font-bold text-[#09090B]">
              {q.badge}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {q.status === 'completed' && (
              <span className="flex items-center gap-1 text-[10px] font-mono-brutal font-bold bg-white text-[#09090B] px-2 py-0.5 rounded border border-[#09090B]">
                <CheckCircle2 className="w-3 h-3 text-[#09090B]" /> DONE
              </span>
            )}
            {q.status === 'active' && (
              <span className="flex items-center gap-1 text-[10px] font-mono-brutal font-bold bg-white text-[#09090B] px-2 py-0.5 rounded border border-[#09090B]">
                <Zap className="w-3 h-3 text-[#09090B] animate-bounce" /> ACTIVE
              </span>
            )}
            {q.status === 'locked' && (
              <span className="flex items-center gap-1 text-[10px] font-mono-brutal font-bold bg-zinc-300 text-zinc-700 px-2 py-0.5 rounded border border-[#09090B]">
                <Lock className="w-3 h-3 text-zinc-700" /> LOCKED
              </span>
            )}
          </div>
        </div>

        <h4 className="font-heading text-lg sm:text-xl text-[#09090B] tracking-tight leading-snug">
          {q.title}
        </h4>

        <p className="text-xs text-[#09090B]/85 font-medium mt-1.5 line-clamp-2">
          {q.description}
        </p>

        <div className="mt-4 pt-3 border-t-2 border-[#09090B]/15 flex items-center justify-between text-xs font-mono-brutal">
          <span className="font-bold bg-[#09090B] text-white px-2 py-0.5 rounded text-[11px]">
            {q.commands[0]}
          </span>
          <span className="font-bold text-[#09090B]">
            +{q.xp} XP
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative pb-24">
      <NoiseOverlay />
      <CustomCursor />
      <JourneyHeader userEmail={userEmail} xp={250} level={2} />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 w-full">
        <div className="bg-white border-2 border-[#09090B] rounded-[16px] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#09090B] mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D2E823] text-[#09090B] font-mono-brutal font-bold text-xs uppercase border-2 border-[#09090B] rounded-full shadow-[2px_2px_0px_0px_#09090B]">
                <Shield className="w-3.5 h-3.5" />
                <span>DIRECTED ACYCLIC GRAPH // CURRICULUM</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
                GIT BRANCH FLOWCHART
              </h1>
              <p className="text-sm text-[#09090B]/80 font-medium max-w-2xl leading-relaxed">
                Explore version control structured as an authentic Git branch tree. Follow the main trunk, spawn feature branches with sharp 90° splits, and conquer merge conflict crucible nodes.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="flex-1 sm:w-32 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-[#09090B]/70 uppercase block font-bold">BRANCHES</span>
                <span className="font-heading text-xl sm:text-2xl text-[#09090B]">03</span>
              </div>
              <div className="flex-1 sm:w-32 bg-[#D2E823] border-2 border-[#09090B] rounded-[12px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-[#09090B]/70 uppercase block font-bold">UNLOCKED</span>
                <span className="font-heading text-xl sm:text-2xl text-[#09090B]">4 / 10</span>
              </div>
              <div className="flex-1 sm:w-36 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-[12px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-zinc-400 uppercase block font-bold">TOTAL XP</span>
                <span className="font-heading text-xl sm:text-2xl">250 XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#09090B]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-brutal font-bold text-[#09090B]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#D2E823] border-2 border-[#09090B] rounded" />
              <span>UNLOCKED NODE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#F8F4E8] opacity-60 border-2 border-[#09090B] rounded" />
              <span>LOCKED NODE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#09090B]" />
              <span>90° BRANCH LINE</span>
            </div>
          </div>
          <span className="font-mono-brutal text-[11px] text-[#09090B]/60">
            CLICK ANY NODE TO INSPECT OBJECTIVES
          </span>
        </div>

        <div className="w-full bg-white border-2 border-[#09090B] rounded-[24px] shadow-[8px_8px_0px_0px_#09090B] p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid-subtle pointer-events-none opacity-70" />

          <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#09090B] text-[#D2E823] font-mono-brutal font-bold text-xs uppercase rounded-full border-2 border-[#09090B] mb-4 shadow-[2px_2px_0px_0px_#09090B]">
              <GitBranch className="w-3.5 h-3.5" />
              <span>TRUNK // branch: main</span>
            </div>

            {renderNodeCard('init')}

            <div className="w-1 h-14 bg-[#09090B]" />

            {renderNodeCard('commit')}

            <div className="w-1 h-14 bg-[#09090B]" />

            {renderNodeCard('logs')}

            <div className="w-full relative my-2">
              <div className="w-full flex justify-center">
                <svg
                  className="w-full max-w-3xl h-24 overflow-visible"
                  viewBox="0 0 600 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="300" y1="0" x2="300" y2="100" stroke="#09090B" strokeWidth="4" />

                  <path
                    d="M 300 15 H 480 V 100"
                    stroke="#09090B"
                    strokeWidth="4"
                    strokeLinejoin="miter"
                  />

                  <circle cx="300" cy="15" r="7" fill="#D2E823" stroke="#09090B" strokeWidth="3" />
                  <circle cx="480" cy="100" r="6" fill="#09090B" />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-full flex justify-center">
                    <span className="font-mono-brutal text-[11px] font-bold bg-white text-[#09090B] px-2 py-0.5 border border-[#09090B] rounded mb-3">
                      main trunk
                    </span>
                  </div>

                  {renderNodeCard('merge_ff')}
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full flex justify-center">
                    <span className="font-mono-brutal text-[11px] font-bold bg-[#D2E823] text-[#09090B] px-2 py-0.5 border border-[#09090B] rounded shadow-[2px_2px_0px_0px_#09090B] mb-3">
                      ⚡ branch: feature/sandbox
                    </span>
                  </div>

                  {renderNodeCard('branch_create')}

                  <div className="w-1 h-12 bg-[#09090B]" />

                  {renderNodeCard('feature_work')}
                </div>
              </div>

              <div className="w-full flex justify-center mt-2">
                <svg
                  className="w-full max-w-3xl h-24 overflow-visible"
                  viewBox="0 0 600 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="160" y1="0" x2="160" y2="100" stroke="#09090B" strokeWidth="4" />

                  <path
                    d="M 480 0 V 60 H 160 V 100"
                    stroke="#09090B"
                    strokeWidth="4"
                    strokeLinejoin="miter"
                  />

                  <circle cx="160" cy="60" r="7" fill="#09090B" />
                  <circle cx="160" cy="60" r="3" fill="#D2E823" />
                </svg>
              </div>
            </div>

            <div className="w-1 h-12 bg-[#09090B]" />

            <div className="w-full relative my-2">
              <div className="w-full flex justify-center mb-2">
                <span className="font-mono-brutal text-xs font-bold bg-red-100 text-red-900 border-2 border-[#09090B] px-3 py-1 rounded shadow-[2px_2px_0px_0px_#09090B]">
                  ⚠ CRUCIBLE: DIVERGENCE &amp; MERGE CONFLICTS
                </span>
              </div>

              <div className="w-full flex justify-center">
                <svg
                  className="w-full max-w-3xl h-24 overflow-visible"
                  viewBox="0 0 600 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="300" y1="0" x2="300" y2="100" stroke="#09090B" strokeWidth="4" />
                  <path
                    d="M 300 20 H 120 V 100"
                    stroke="#09090B"
                    strokeWidth="4"
                    strokeLinejoin="miter"
                  />
                  <circle cx="300" cy="20" r="6" fill="#09090B" />
                </svg>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full mt-2">
                <div className="flex flex-col items-center">
                  <span className="font-mono-brutal text-[11px] font-bold bg-[#09090B] text-white px-2 py-0.5 rounded mb-3">
                    branch: hotfix/urgent-patch
                  </span>
                  {renderNodeCard('divergent')}
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-mono-brutal text-[11px] font-bold bg-white text-[#09090B] px-2 py-0.5 border border-[#09090B] rounded mb-3">
                    main (conflicting changes)
                  </span>
                  {renderNodeCard('conflicts')}
                </div>
              </div>

              <div className="w-full flex justify-center mt-2">
                <svg
                  className="w-full max-w-3xl h-24 overflow-visible"
                  viewBox="0 0 600 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="440" y1="0" x2="440" y2="100" stroke="#09090B" strokeWidth="4" />
                  <path
                    d="M 160 0 V 55 H 440 V 100"
                    stroke="#09090B"
                    strokeWidth="4"
                    strokeLinejoin="miter"
                  />
                  <circle cx="440" cy="55" r="7" fill="#09090B" />
                </svg>
              </div>
            </div>

            <div className="w-1 h-12 bg-[#09090B]" />

            {renderNodeCard('rebase')}

            <div className="w-1 h-14 bg-[#09090B]" />

            {renderNodeCard('remote_sync')}

            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-[12px] bg-[#D2E823] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#09090B]" />
              </div>
              <span className="font-heading text-sm text-[#09090B] uppercase tracking-wider">
                MASTERY REACHED // GIT CHAMPION
              </span>
            </div>
          </div>
        </div>
      </main>

      <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
    </div>
  );
}
