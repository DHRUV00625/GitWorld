'use client';

import { useState, useEffect, useRef } from 'react';
import JourneyHeader from '@/components/JourneyHeader';
import QuestModal, { QuestNodeData } from '@/components/QuestModal';
import NoiseOverlay from '@/components/NoiseOverlay';
import CustomCursor from '@/components/CustomCursor';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  Clock,
  Sparkles,
  Compass,
} from 'lucide-react';

interface TopicNodeConfig {
  id: string;
  stage: string;
  title: string;
  branch: string;
  tagline: string;
  description: string;
  commands: string[];
  xp: number;
  badge: string;
  requires: string[];
}

const TOPICS_CONFIG: Record<string, TopicNodeConfig> = {
  init: {
    id: 'init',
    stage: 'STAGE 01',
    title: '01. INIT',
    branch: 'main',
    tagline: 'Genesis Repository Block',
    description: 'Initialize the local Git repository, inspect the hidden .git genesis configuration, and seal identity settings.',
    commands: ['git init gitworld-project', 'cd gitworld-project', 'git status'],
    xp: 100,
    badge: 'ROOT GENESIS',
    requires: [],
  },
  commit: {
    id: 'commit',
    stage: 'STAGE 02',
    title: '02. COMMIT',
    branch: 'main',
    tagline: 'Immutable SHA-1 Snapshots',
    description: 'Master the three Git states: Working Directory, Staging Index, and cryptographic DAG commit snapshots.',
    commands: ['git add .', 'git commit -m "feat: initial commit"'],
    xp: 150,
    badge: 'STAGING INDEX',
    requires: ['init'],
  },
  branching: {
    id: 'branching',
    stage: 'STAGE 03',
    title: '03. BRANCHING',
    branch: 'feature/timeline-warp',
    tagline: 'Parallel Universe Tracks',
    description: 'Spawn isolated timeline branches without touching trunk. Understand HEAD pointer motion and isolated commit graphs.',
    commands: ['git checkout -b feature/timeline-warp', 'git branch -v'],
    xp: 200,
    badge: 'TIMELINE TRACK',
    requires: ['commit'],
  },
  merging: {
    id: 'merging',
    stage: 'STAGE 04',
    title: '04. MERGING',
    branch: 'main',
    tagline: 'Timeline Synthesis',
    description: 'Synthesize separate branches cleanly. Execute Fast-Forward merges and 3-way tree syntheses back to main trunk.',
    commands: ['git checkout main', 'git merge feature/timeline-warp'],
    xp: 250,
    badge: 'SYNTHESIS ENGINE',
    requires: ['branching'],
  },
  conflicts: {
    id: 'conflicts',
    stage: 'STAGE 05',
    title: '05. CONFLICTS',
    branch: 'crucible/merge-clash',
    tagline: 'The Crucible of Diffs',
    description: 'Confront the Crucible: inspect collision markers (<<<<<<< HEAD), manually resolve diffs, and seal the merge commit.',
    commands: ['git merge crucible/merge-clash', 'git add .', 'git commit'],
    xp: 350,
    badge: 'CRUCIBLE MASTER',
    requires: ['merging'],
  },
};

const ORDERED_TOPIC_IDS = ['init', 'commit', 'branching', 'merging', 'conflicts'];

export default function JourneyTimelinePage() {
  const [selectedQuest, setSelectedQuest] = useState<QuestNodeData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>(['init']);
  const [totalXp, setTotalXp] = useState<number>(100);
  const [shakingNodeId, setShakingNodeId] = useState<string | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [isUpdatingDb, setIsUpdatingDb] = useState<boolean>(false);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll Progress Hook
  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ['start start', 'end end'],
  });

  // Track scroll percentage for HUD indicator
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollPercent(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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
    setLockedNotice(`LOCKED! Complete prerequisite node: ${reqNames}`);

    setTimeout(() => {
      setShakingNodeId(null);
    }, 300);

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

  // Helper to construct QuestNodeData for modal inspection
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

  const unlockedCount = ORDERED_TOPIC_IDS.filter(isNodeUnlocked).length;
  const completedCount = ORDERED_TOPIC_IDS.filter(isNodeCompleted).length;
  const currentLevel = Math.max(1, Math.floor(totalXp / 200) + 1);

  // Strict 90-Degree Orthogonal Zigzag SVG Path Definition for Desktop
  // viewBox: 0 0 1000 3000
  // Left node anchor: X=250. Right node anchor: X=750. Central spine: X=500.
  const desktopOrthogonalPath = `
    M 500 40
    V 160
    H 250
    V 420
    H 500
    V 720
    H 750
    V 980
    H 500
    V 1280
    H 250
    V 1540
    H 500
    V 1840
    H 750
    V 2100
    H 500
    V 2400
    H 250
    V 2660
    H 500
    V 2900
  `;

  // Strict 90-Degree Orthogonal Path for Mobile (Single Column Spine on Left)
  // viewBox: 0 0 400 3000
  const mobileOrthogonalPath = `
    M 40 40
    V 160
    H 80
    V 420
    H 40
    V 720
    H 80
    V 980
    H 40
    V 1280
    H 80
    V 1540
    H 40
    V 1840
    H 80
    V 2100
    H 40
    V 2400
    H 80
    V 2660
    H 40
    V 2900
  `;

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative">
      {/* Film Grain Texture & Interactive Custom Cursor */}
      <NoiseOverlay />
      <CustomCursor />

      {/* Sticky Neo-Brutalist Navigation Header */}
      <JourneyHeader userEmail={user?.email} xp={totalXp} level={currentLevel} />

      {/* Brutalist HUD / Scroll Tracker Pill (Floating on bottom right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-2 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] px-4 py-2 rounded-[8px] shadow-[4px_4px_0px_0px_#D2E823] font-mono-brutal text-xs font-bold pointer-events-none">
        <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
        <span>TIMELINE // {scrollPercent}% SCROLLED</span>
        <span className="text-zinc-500">|</span>
        <span>{completedCount}/5 DONE</span>
      </div>

      {/* Locked Node Jagged Toast Banner */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-24 z-50 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-none"
          >
            <div className="bg-[#09090B] text-[#D2E823] border-2 border-[#D2E823] rounded-[10px] p-3.5 shadow-[4px_4px_0px_0px_#09090B] flex items-center gap-3 font-mono-brutal text-xs font-bold pointer-events-auto">
              <AlertCircle className="w-5 h-5 text-[#D2E823] shrink-0" />
              <span className="flex-1">{lockedNotice}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Briefing Header */}
      <header className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 w-full">
        <div className="bg-white border-2 border-[#09090B] rounded-[16px] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#09090B]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D2E823] text-[#09090B] font-mono-brutal font-bold text-xs uppercase border-2 border-[#09090B] rounded-full shadow-[2px_2px_0px_0px_#09090B]">
                <Shield className="w-3.5 h-3.5" />
                <span>SCROLL-LINKED ORTHOGONAL TIMELINE</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
                THE GIT TIMELINE
              </h1>
              <p className="text-sm text-[#09090B]/80 font-medium leading-relaxed">
                Scroll down to track the 4px orthogonal journey line. Alternating nodes unlock sequentially. Click <code className="bg-zinc-100 px-1.5 py-0.5 border border-black font-bold">MARK AS DONE</code> to persist your milestones into the Supabase <code className="bg-zinc-100 px-1.5 py-0.5 border border-black font-bold">user_progress</code> table.
              </p>
            </div>

            {/* Brutalist Stats Counters */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="flex-1 sm:w-28 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[10px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-[#09090B]/70 uppercase block font-bold">COMPLETED</span>
                <span className="font-heading text-2xl text-[#09090B]">{completedCount} / 5</span>
              </div>
              <div className="flex-1 sm:w-28 bg-[#D2E823] border-2 border-[#09090B] rounded-[10px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-[#09090B]/70 uppercase block font-bold">UNLOCKED</span>
                <span className="font-heading text-2xl text-[#09090B]">{unlockedCount} / 5</span>
              </div>
              <div className="flex-1 sm:w-36 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] rounded-[10px] p-3 text-center shadow-[3px_3px_0px_0px_#09090B]">
                <span className="font-mono-brutal text-[10px] text-zinc-400 uppercase block font-bold">TOTAL XP</span>
                <span className="font-heading text-2xl">{totalXp} XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* VERTICALLY SCROLLING TIMELINE CONTAINER */}
      {/* ========================================================= */}
      <main
        ref={timelineContainerRef}
        className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-12 pb-36 w-full"
      >
        {/* ======================================================= */}
        {/* ORTHOGONAL SVG JOURNEY LINE (DESKTOP: hidden on mobile) */}
        {/* ======================================================= */}
        <div className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 3000"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Guide line track with dashed ink line */}
            <path
              d={desktopOrthogonalPath}
              stroke="#09090B"
              strokeWidth="4"
              strokeDasharray="8 8"
              strokeOpacity="0.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />

            {/* Scroll-Linked Dynamic Solid 4px #09090B Animated Line */}
            <motion.path
              d={desktopOrthogonalPath}
              stroke="#09090B"
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scrollYProgress }}
            />

            {/* Commit Junction Anchor Dots */}
            {[
              { cx: 500, cy: 40 },
              { cx: 250, cy: 160 },
              { cx: 250, cy: 420 },
              { cx: 500, cy: 720 },
              { cx: 750, cy: 720 },
              { cx: 750, cy: 980 },
              { cx: 500, cy: 1280 },
              { cx: 250, cy: 1280 },
              { cx: 250, cy: 1540 },
              { cx: 500, cy: 1840 },
              { cx: 750, cy: 1840 },
              { cx: 750, cy: 2100 },
              { cx: 500, cy: 2400 },
              { cx: 250, cy: 2400 },
              { cx: 250, cy: 2660 },
              { cx: 500, cy: 2900 },
            ].map((pt, idx) => (
              <rect
                key={idx}
                x={pt.cx - 6}
                y={pt.cy - 6}
                width="12"
                height="12"
                fill="#09090B"
                stroke="#D2E823"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        {/* ======================================================= */}
        {/* ORTHOGONAL SVG JOURNEY LINE (MOBILE) */}
        {/* ======================================================= */}
        <div className="block md:hidden absolute inset-0 w-full h-full pointer-events-none z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 3000"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d={mobileOrthogonalPath}
              stroke="#09090B"
              strokeWidth="4"
              strokeDasharray="6 6"
              strokeOpacity="0.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={mobileOrthogonalPath}
              stroke="#09090B"
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
        </div>

        {/* ======================================================= */}
        {/* TIMELINE NODES (ZIGZAG ALTERNATING LAYOUT) */}
        {/* ======================================================= */}
        <div className="relative z-10 flex flex-col space-y-36 sm:space-y-48 mt-12">
          {ORDERED_TOPIC_IDS.map((topicId, index) => {
            const node = TOPICS_CONFIG[topicId];
            const unlocked = isNodeUnlocked(topicId);
            const completed = isNodeCompleted(topicId);
            const isLeft = index % 2 === 0;
            const isShaking = shakingNodeId === topicId;

            return (
              <div
                key={node.id}
                className={`w-full flex flex-col md:flex-row items-center ${
                  isLeft ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Topic Tab / Node Card */}
                <div
                  className={`w-full max-w-lg ${
                    isLeft ? 'md:mr-auto md:pl-0' : 'md:ml-auto md:pr-0'
                  }`}
                >
                  <motion.div
                    // Jagged shake animation on locked click: rapid linear x oscillations, zero soft bounce
                    animate={
                      isShaking
                        ? {
                            x: [-6, 6, -6, 6, -3, 3, 0],
                            transition: { duration: 0.25, ease: 'linear' },
                          }
                        : { x: 0 }
                    }
                    onClick={() => {
                      if (!unlocked) {
                        handleLockedClick(node.id, node.requires);
                      } else {
                        setSelectedQuest(getQuestData(node.id));
                      }
                    }}
                    className={`relative p-6 sm:p-7 rounded-[12px] border-2 border-[#09090B] transition-all duration-150 cursor-pointer select-none ${
                      unlocked
                        ? 'bg-[#D2E823] text-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#09090B]'
                        : 'bg-[#F8F4E8] text-[#09090B] opacity-60 grayscale shadow-[4px_4px_0px_0px_#09090B] hover:opacity-75'
                    }`}
                  >
                    {/* Header Strip */}
                    <div className="flex items-center justify-between border-b-2 border-[#09090B]/20 pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-brutal font-bold text-[11px] uppercase bg-[#09090B] text-white px-2.5 py-1 rounded-[4px]">
                          {node.stage}
                        </span>
                        <span className="font-mono-brutal text-xs font-bold text-[#09090B]">
                          {node.badge}
                        </span>
                      </div>

                      {/* State Badge */}
                      <div>
                        {completed && (
                          <span className="flex items-center gap-1.5 text-xs font-mono-brutal font-bold bg-white text-[#09090B] px-2.5 py-1 rounded-[4px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#09090B]" />
                            <span>DONE</span>
                          </span>
                        )}
                        {!completed && unlocked && (
                          <span className="flex items-center gap-1.5 text-xs font-mono-brutal font-bold bg-white text-[#09090B] px-2.5 py-1 rounded-[4px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B]">
                            <Zap className="w-3.5 h-3.5 text-[#09090B] animate-pulse" />
                            <span>ACTIVE</span>
                          </span>
                        )}
                        {!unlocked && (
                          <span className="flex items-center gap-1.5 text-xs font-mono-brutal font-bold bg-zinc-300 text-zinc-900 px-2.5 py-1 rounded-[4px] border-2 border-[#09090B]">
                            <Lock className="w-3.5 h-3.5" />
                            <span>LOCKED</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Node Heading */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 font-mono-brutal text-[11px] font-bold text-[#09090B]/70">
                        <GitBranch className="w-3 h-3" />
                        <span>branch: {node.branch}</span>
                      </div>
                      <h3 className="font-heading text-2xl sm:text-3xl text-[#09090B] tracking-tight">
                        {node.title}
                      </h3>
                      <p className="font-mono-brutal text-xs font-bold text-[#09090B]">
                        // {node.tagline}
                      </p>
                    </div>

                    {/* Mission Description */}
                    <p className="text-xs sm:text-sm text-[#09090B]/90 font-medium leading-relaxed mb-5">
                      {node.description}
                    </p>

                    {/* Terminal Commands Snippet */}
                    <div className="bg-[#09090B] text-[#D2E823] p-3 rounded-[8px] border-2 border-[#09090B] font-mono-brutal text-xs space-y-1 mb-5">
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400 uppercase font-bold border-b border-zinc-800 pb-1 mb-1">
                        <Terminal className="w-3 h-3" />
                        <span>Target Terminal Commands</span>
                      </div>
                      {node.commands.map((cmd, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5">
                          <span className="text-[#D2E823] select-none">$</span>
                          <span className="font-bold">{cmd}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="flex items-center justify-between pt-4 border-t-2 border-[#09090B]/20">
                      <span className="font-mono-brutal text-xs font-bold text-[#09090B]">
                        REWARD: +{node.xp} XP
                      </span>

                      {/* Hard-Shadow Button: MARK AS DONE (translates [2px, 2px] & loses shadow on click) */}
                      {unlocked && !completed && (
                        <button
                          type="button"
                          onClick={(e) => handleMarkAsDone(e, node.id)}
                          disabled={isUpdatingDb}
                          className="px-4 py-2 bg-[#09090B] text-[#D2E823] font-heading text-xs tracking-tight rounded-[6px] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#09090B] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
                          title="Complete this milestone and unlock subsequent timeline stage"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>MARK AS DONE</span>
                        </button>
                      )}

                      {completed && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-[11px] font-bold text-[#09090B]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>COMPLETED</span>
                        </div>
                      )}

                      {!unlocked && (
                        <span className="font-mono-brutal text-[11px] text-zinc-700 font-bold">
                          CLICK TO CHECK LOCK
                        </span>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}

          {/* Timeline Finale / Champion Milestone */}
          <div className="w-full flex justify-center pt-8">
            <div className="w-full max-w-md bg-white border-2 border-[#09090B] rounded-[16px] p-6 sm:p-8 text-center shadow-[6px_6px_0px_0px_#09090B] space-y-4">
              <div className="w-16 h-16 mx-auto rounded-[12px] bg-[#D2E823] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] flex items-center justify-center">
                <Flame className="w-8 h-8 text-[#09090B]" />
              </div>
              <div className="space-y-1">
                <span className="font-mono-brutal text-xs font-bold uppercase bg-[#09090B] text-white px-3 py-1 rounded-full">
                  TIMELINE DESTINATION
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl text-[#09090B]">
                  GIT CHAMPION
                </h2>
                <p className="text-xs text-[#09090B]/80 font-medium">
                  Complete all 5 stages to master Git version control, branch isolation, merge conflict resolution, and Directed Acyclic Graphs.
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block font-mono-brutal text-xs font-bold text-[#09090B] bg-[#D2E823] px-3 py-1.5 rounded-[6px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B]">
                  {completedCount === 5 ? '★ ALL MILESTONES SECURED ★' : `${5 - completedCount} STAGES REMAINING`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Interactive Quest Modal */}
      <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
    </div>
  );
}
