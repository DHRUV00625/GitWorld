'use client';

import { useState, useEffect } from 'react';
import JourneyHeader from '@/components/JourneyHeader';
import QuestModal, { QuestNodeData } from '@/components/QuestModal';
import NoiseOverlay from '@/components/NoiseOverlay';
import CustomCursor from '@/components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';
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
  Check,
  AlertCircle,
} from 'lucide-react';

interface TopicNodeConfig {
  id: string;
  stage: string;
  title: string;
  branch: string;
  description: string;
  commands: string[];
  xp: number;
  badge: string;
  requires: string[]; // Prerequisite topic IDs that must be completed to unlock this node
}

const TOPICS_CONFIG: Record<string, TopicNodeConfig> = {
  init: {
    id: 'init',
    stage: 'MODULE 01',
    title: '01. GIT INIT',
    branch: 'main',
    description: 'Create the repository genesis block, inspect hidden .git configuration, and verify status.',
    commands: ['git init gitworld-genesis', 'cd gitworld-genesis', 'git status'],
    xp: 100,
    badge: 'ROOT GENESIS',
    requires: [],
  },
  commit: {
    id: 'commit',
    stage: 'MODULE 02',
    title: '02. STAGING & COMMIT',
    branch: 'main',
    description: 'Master the three Git states: Working Directory, Staging Index, and Immutable Commit Object.',
    commands: ['git add .', 'git commit -m "feat: initial commit"'],
    xp: 150,
    badge: 'STAGING INDEX',
    requires: ['init'],
  },
  logs: {
    id: 'logs',
    stage: 'MODULE 03',
    title: '03. LOGS & DIFFS',
    branch: 'main',
    description: 'Traverse the Directed Acyclic Graph, inspect parent pointer hashes, and compare delta diffs.',
    commands: ['git log --oneline --graph --all', 'git diff HEAD~1'],
    xp: 175,
    badge: 'DAG INSPECTION',
    requires: ['commit'],
  },
  branch_create: {
    id: 'branch_create',
    stage: 'MODULE 04',
    title: '04. BRANCH ISOLATION',
    branch: 'feature/sandbox',
    description: 'Spawn a parallel universe branch without touching main. Understand HEAD pointer movement.',
    commands: ['git checkout -b feature/sandbox', 'git branch -v'],
    xp: 200,
    badge: 'PARALLEL TRACK',
    requires: ['logs'],
  },
  feature_work: {
    id: 'feature_work',
    stage: 'MODULE 05',
    title: '05. FEATURE WORK',
    branch: 'feature/sandbox',
    description: 'Craft isolated commits in the feature branch and inspect divergence from main trunk.',
    commands: ['git commit -am "feat: add experimental sandboxes"'],
    xp: 225,
    badge: 'BRANCH PROGRESS',
    requires: ['branch_create'],
  },
  merge_ff: {
    id: 'merge_ff',
    stage: 'MODULE 06',
    title: '06. FAST-FORWARD MERGE',
    branch: 'main',
    description: 'Bring feature progress back to main cleanly when no divergence has occurred.',
    commands: ['git checkout main', 'git merge feature/sandbox'],
    xp: 250,
    badge: 'SYNTHESIS',
    requires: ['feature_work', 'logs'],
  },
  divergent: {
    id: 'divergent',
    stage: 'MODULE 07',
    title: '07. DIVERGENT HISTORIES',
    branch: 'hotfix/urgent-patch',
    description: 'Simulate concurrent team workflows where main and side branches both advance independently.',
    commands: ['git checkout -b hotfix/urgent-patch', 'git commit -am "fix: urgent patch"'],
    xp: 275,
    badge: 'DIVERGENCE',
    requires: ['merge_ff'],
  },
  conflicts: {
    id: 'conflicts',
    stage: 'MODULE 08',
    title: '08. CONFLICT RESOLUTION',
    branch: 'main',
    description: 'Face the crucible: inspect conflicting markers (<<<<<<< HEAD), resolve diffs, and seal merge commit.',
    commands: ['git merge hotfix/urgent-patch', 'git add .', 'git commit'],
    xp: 350,
    badge: 'CRUCIBLE',
    requires: ['divergent'],
  },
  rebase: {
    id: 'rebase',
    stage: 'MODULE 09',
    title: '09. INTERACTIVE REBASE',
    branch: 'feature/clean-history',
    description: 'Rewind and replay commits onto new bases. Squash messy intermediate commits into pristine history.',
    commands: ['git rebase -i HEAD~3', 'git rebase --continue'],
    xp: 400,
    badge: 'LINEAR DAG',
    requires: ['conflicts'],
  },
  remote_sync: {
    id: 'remote_sync',
    stage: 'MODULE 10',
    title: '10. REMOTE SYNC & PR',
    branch: 'main',
    description: 'Connect local branches to GitHub remotes, manage upstream tracking, and open pull requests.',
    commands: ['git remote add origin <url>', 'git push -u origin main'],
    xp: 500,
    badge: 'FINAL QUEST',
    requires: ['rebase'],
  },
};

export default function JourneyFlowchartPage() {
  const [selectedQuest, setSelectedQuest] = useState<QuestNodeData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>(['init']);
  const [totalXp, setTotalXp] = useState<number>(100);
  const [shakingNodeId, setShakingNodeId] = useState<string | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [isUpdatingDb, setIsUpdatingDb] = useState<boolean>(false);

  const supabase = createClient();

  // Load user session & fetch completed_topics from user_progress table
  useEffect(() => {
    async function loadProgress() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          setUser(authData.user);

          // Fetch progression from user_progress table
          const { data: progressData, error: dbError } = await supabase
            .from('user_progress')
            .select('completed_topics, xp')
            .eq('user_id', authData.user.id)
            .maybeSingle();

          if (progressData && !dbError) {
            if (Array.isArray(progressData.completed_topics)) {
              setCompletedTopics(progressData.completed_topics);
            }
            if (typeof progressData.xp === 'number') {
              setTotalXp(progressData.xp);
            }
          } else {
            // Check localStorage fallback if table is empty or pending migrations
            const cached = localStorage.getItem('gitworld_progress');
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed.completed_topics) setCompletedTopics(parsed.completed_topics);
              if (parsed.xp) setTotalXp(parsed.xp);
            }
          }
        } else {
          // Guest mode fallback
          const cached = localStorage.getItem('gitworld_progress');
          if (cached) {
            const parsed = JSON.parse(cached);
            if (parsed.completed_topics) setCompletedTopics(parsed.completed_topics);
            if (parsed.xp) setTotalXp(parsed.xp);
          }
        }
      } catch (err) {
        console.warn('Could not query user_progress table, using local progression state:', err);
      }
    }
    loadProgress();
  }, []);

  // Determine if a node is unlocked based on completedTopics
  const isNodeUnlocked = (id: string) => {
    const config = TOPICS_CONFIG[id];
    if (!config) return false;
    if (config.requires.length === 0) return true;
    return config.requires.every((req) => completedTopics.includes(req));
  };

  const isNodeCompleted = (id: string) => completedTopics.includes(id);

  // Trigger sharp, jagged shake animation when clicking a locked node
  const handleLockedClick = (id: string, requiredList: string[]) => {
    setShakingNodeId(id);
    const reqNames = requiredList.map((r) => TOPICS_CONFIG[r]?.title || r).join(' & ');
    setLockedNotice(`LOCKED! You must first complete: ${reqNames}`);

    setTimeout(() => {
      setShakingNodeId(null);
    }, 350);

    setTimeout(() => {
      setLockedNotice(null);
    }, 3500);
  };

  // Mark as Done action: updates Supabase database and unlocks next node
  const handleMarkAsDone = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (completedTopics.includes(id)) return;

    setIsUpdatingDb(true);
    const config = TOPICS_CONFIG[id];
    const newCompleted = [...completedTopics, id];
    const newXp = totalXp + (config?.xp || 100);

    setCompletedTopics(newCompleted);
    setTotalXp(newXp);

    // Persist to localStorage
    localStorage.setItem(
      'gitworld_progress',
      JSON.stringify({ completed_topics: newCompleted, xp: newXp })
    );

    // Persist to Supabase user_progress table
    try {
      if (user) {
        await supabase.from('user_progress').upsert(
          {
            user_id: user.id,
            completed_topics: newCompleted,
            xp: newXp,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );
      }
    } catch (err) {
      console.warn('Supabase user_progress update failed:', err);
    } finally {
      setIsUpdatingDb(false);
    }
  };

  // Helper to construct QuestNodeData for the modal
  const getQuestData = (id: string): QuestNodeData => {
    const cfg = TOPICS_CONFIG[id];
    const unlocked = isNodeUnlocked(id);
    const completed = isNodeCompleted(id);

    return {
      id: cfg.id,
      stage: cfg.stage,
      title: cfg.title,
      branch: cfg.branch,
      description: cfg.description,
      commands: cfg.commands,
      xp: cfg.xp,
      status: completed ? 'completed' : unlocked ? 'active' : 'locked',
      badge: cfg.badge,
    };
  };

  const renderNodeCard = (id: string) => {
    const cfg = TOPICS_CONFIG[id];
    const unlocked = isNodeUnlocked(id);
    const completed = isNodeCompleted(id);
    const isShaking = shakingNodeId === id;

    return (
      <motion.div
        key={id}
        // Sharp, jagged shake animation on locked click (strictly linear, no soft curves)
        animate={
          isShaking
            ? {
                x: [-7, 7, -7, 7, -4, 4, 0],
                transition: { duration: 0.3, ease: 'linear' },
              }
            : { x: 0 }
        }
        onClick={() => {
          if (!unlocked) {
            handleLockedClick(id, cfg.requires);
          } else {
            setSelectedQuest(getQuestData(id));
          }
        }}
        className={`w-full max-w-[340px] sm:max-w-[380px] p-5 rounded-[12px] border-2 border-[#09090B] transition-all duration-150 cursor-pointer text-left relative select-none ${
          unlocked
            ? 'bg-[#D2E823] text-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
            : 'bg-[#F8F4E8] text-[#09090B] opacity-60 grayscale shadow-[3px_3px_0px_0px_#09090B] hover:opacity-75'
        }`}
      >
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between mb-3 border-b-2 border-[#09090B]/20 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-mono-brutal font-bold text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded">
              {cfg.stage}
            </span>
            <span className="font-mono-brutal text-[11px] font-bold text-[#09090B]">
              {cfg.badge}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {completed && (
              <span className="flex items-center gap-1 text-[10px] font-mono-brutal font-bold bg-white text-[#09090B] px-2 py-0.5 rounded border border-[#09090B]">
                <CheckCircle2 className="w-3 h-3 text-[#09090B]" /> DONE
              </span>
            )}
            {!completed && unlocked && (
              <span className="flex items-center gap-1 text-[10px] font-mono-brutal font-bold bg-white text-[#09090B] px-2 py-0.5 rounded border border-[#09090B]">
                <Zap className="w-3 h-3 text-[#09090B] animate-bounce" /> ACTIVE
              </span>
            )}
            {!unlocked && (
              <span className="flex items-center gap-1 text-[10px] font-mono-brutal font-bold bg-zinc-300 text-zinc-800 px-2 py-0.5 rounded border border-[#09090B]">
                <Lock className="w-3 h-3 text-zinc-800" /> LOCKED
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-heading text-lg sm:text-xl text-[#09090B] tracking-tight leading-snug">
          {cfg.title}
        </h4>

        {/* Description snippet */}
        <p className="text-xs text-[#09090B]/85 font-medium mt-1.5 line-clamp-2">
          {cfg.description}
        </p>

        {/* Bottom Bar: Action / Status */}
        <div className="mt-4 pt-3 border-t-2 border-[#09090B]/15 flex items-center justify-between gap-2 text-xs font-mono-brutal">
          <span className="font-bold text-[#09090B]">+{cfg.xp} XP</span>

          {/* Hard-Shadow Button: MARK AS DONE (only shown on unlocked, incomplete nodes) */}
          {unlocked && !completed && (
            <button
              onClick={(e) => handleMarkAsDone(e, id)}
              disabled={isUpdatingDb}
              className="px-3 py-1.5 bg-[#09090B] text-[#D2E823] font-heading text-[11px] tracking-tight rounded-[6px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1 cursor-pointer"
              title="Complete this quest and unlock subsequent nodes"
            >
              <Check className="w-3.5 h-3.5" />
              <span>MARK AS DONE</span>
            </button>
          )}

          {completed && (
            <span className="text-[11px] font-bold text-[#09090B]/80 font-mono-brutal">
              COMPLETED ✨
            </span>
          )}

          {!unlocked && (
            <span className="text-[10px] font-mono-brutal text-zinc-600 font-bold">
              CLICK TO INSPECT
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  const unlockedCount = Object.keys(TOPICS_CONFIG).filter(isNodeUnlocked).length;
  const currentLevel = Math.max(1, Math.floor(totalXp / 200) + 1);

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative pb-24">
      {/* Viewport Grain & Blend Cursor */}
      <NoiseOverlay />
      <CustomCursor />

      {/* Sticky Neo-Brutalist Navigation Header */}
      <JourneyHeader userEmail={user?.email} xp={totalXp} level={currentLevel} />

      {/* Locked Feedback Toast Banner */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 z-50 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-none"
          >
            <div className="bg-[#09090B] text-[#D2E823] border-2 border-[#D2E823] rounded-[12px] p-3.5 shadow-[4px_4px_0px_0px_#09090B] flex items-center gap-3 font-mono-brutal text-xs font-bold pointer-events-auto">
              <AlertCircle className="w-5 h-5 text-[#D2E823] shrink-0" />
              <span className="flex-1">{lockedNotice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 w-full">
        {/* Top Banner Box */}
        <div className="bg-white border-2 border-[#09090B] rounded-[16px] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#09090B] mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D2E823] text-[#09090B] font-mono-brutal font-bold text-xs uppercase border-2 border-[#09090B] rounded-full shadow-[2px_2px_0px_0px_#09090B]">
                <Shield className="w-3.5 h-3.5" />
                <span>SUPABASE AUTH &amp; DATABASE PROGRESSION</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
                GIT BRANCH FLOWCHART
              </h1>
              <p className="text-sm text-[#09090B]/80 font-medium max-w-2xl leading-relaxed">
                Your progress is synced with the <code className="bg-zinc-100 px-1 py-0.5 border border-black font-bold">user_progress</code> table. Complete topics to unlock branch connections and master version control through hands-on DAG quests.
              </p>
            </div>

            {/* Stats Dashboard */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="flex-1 sm:w-32 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-[#09090B]/70 uppercase block font-bold">COMPLETED</span>
                <span className="font-heading text-xl sm:text-2xl text-[#09090B]">
                  {completedTopics.length} / 10
                </span>
              </div>
              <div className="flex-1 sm:w-32 bg-[#D2E823] border-2 border-[#09090B] rounded-[12px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-[#09090B]/70 uppercase block font-bold">AVAILABLE</span>
                <span className="font-heading text-xl sm:text-2xl text-[#09090B]">
                  {unlockedCount} / 10
                </span>
              </div>
              <div className="flex-1 sm:w-36 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-[12px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-zinc-400 uppercase block font-bold">XP GAINED</span>
                <span className="font-heading text-xl sm:text-2xl">{totalXp} XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Legend & Helper */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-4 shadow-[3px_3px_0px_0px_#09090B]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-brutal font-bold text-[#09090B]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#D2E823] border-2 border-[#09090B] rounded" />
              <span>UNLOCKED NODE (#D2E823)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#F8F4E8] opacity-60 border-2 border-[#09090B] rounded" />
              <span>LOCKED NODE (SHAKES ON CLICK)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#09090B]" />
              <span>90° BRANCH LINE</span>
            </div>
          </div>
          <span className="font-mono-brutal text-[11px] text-[#09090B]/70 font-bold">
            CLICK &apos;MARK AS DONE&apos; TO ADVANCE THE BRANCH
          </span>
        </div>

        {/* ========================================================= */}
        {/* GIT BRANCH TREE FLOWCHART CANVAS */}
        {/* ========================================================= */}
        <div className="w-full bg-white border-2 border-[#09090B] rounded-[24px] shadow-[8px_8px_0px_0px_#09090B] p-6 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-grid-subtle pointer-events-none opacity-70" />

          <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
            {/* Trunk Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#09090B] text-[#D2E823] font-mono-brutal font-bold text-xs uppercase rounded-full border-2 border-[#09090B] mb-4 shadow-[2px_2px_0px_0px_#09090B]">
              <GitBranch className="w-3.5 h-3.5" />
              <span>TRUNK // branch: main</span>
            </div>

            {/* STAGE 1: INIT */}
            {renderNodeCard('init')}

            {/* Orthogonal Trunk Line */}
            <div className="w-1 h-14 bg-[#09090B]" />

            {/* STAGE 2: COMMIT */}
            {renderNodeCard('commit')}

            {/* Orthogonal Trunk Line */}
            <div className="w-1 h-14 bg-[#09090B]" />

            {/* STAGE 3: LOGS & DIFFS */}
            {renderNodeCard('logs')}

            {/* ===================================================== */}
            {/* 90-DEGREE BRANCH SPLIT SECTION (Feature Branch 01) */}
            {/* ===================================================== */}
            <div className="w-full relative my-2">
              {/* SVG 90-Degree Orthogonal Branching Diagram */}
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
                  <circle cx="300" cy="15" r="7" fill={isNodeCompleted('logs') ? '#D2E823' : '#09090B'} stroke="#09090B" strokeWidth="3" />
                  <circle cx="480" cy="100" r="6" fill="#09090B" />
                </svg>
              </div>

              {/* Two-Column Stream Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full mt-2">
                {/* Left: Main Trunk Stream */}
                <div className="flex flex-col items-center">
                  <span className="font-mono-brutal text-[11px] font-bold bg-white text-[#09090B] px-2 py-0.5 border border-[#09090B] rounded mb-3">
                    main trunk
                  </span>
                  {renderNodeCard('merge_ff')}
                </div>

                {/* Right: Feature Branch Stream */}
                <div className="flex flex-col items-center">
                  <span className="font-mono-brutal text-[11px] font-bold bg-[#D2E823] text-[#09090B] px-2 py-0.5 border border-[#09090B] rounded shadow-[2px_2px_0px_0px_#09090B] mb-3">
                    ⚡ branch: feature/sandbox
                  </span>
                  {renderNodeCard('branch_create')}

                  <div className="w-1 h-12 bg-[#09090B]" />

                  {renderNodeCard('feature_work')}
                </div>
              </div>

              {/* 90-Degree Merge Connector SVG */}
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

            {/* ===================================================== */}
            {/* CONFLICT CRUCIBLE SECTION (Divergent Branching) */}
            {/* ===================================================== */}
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
                {/* Left: Hotfix Branch */}
                <div className="flex flex-col items-center">
                  <span className="font-mono-brutal text-[11px] font-bold bg-[#09090B] text-white px-2 py-0.5 rounded mb-3">
                    branch: hotfix/urgent-patch
                  </span>
                  {renderNodeCard('divergent')}
                </div>

                {/* Right: Main Trunk Conflict Node */}
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

            {/* STAGE 9: REBASE */}
            {renderNodeCard('rebase')}

            <div className="w-1 h-14 bg-[#09090B]" />

            {/* STAGE 10: REMOTE PUSH & PR */}
            {renderNodeCard('remote_sync')}

            {/* Bottom Victory Card */}
            <div className="mt-10 flex flex-col items-center gap-2">
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

      {/* Interactive Quest Inspection Modal */}
      <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
    </div>
  );
}
