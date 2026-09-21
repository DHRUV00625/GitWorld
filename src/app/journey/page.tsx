'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import JourneyHeader from '@/components/JourneyHeader';
import QuestModal, { QuestNodeData } from '@/components/QuestModal';
import NoiseOverlay from '@/components/NoiseOverlay';
import CustomCursor from '@/components/CustomCursor';
import { createClient } from '@/utils/supabase/client';
import { useGitStore, logoutUser } from '@/store/useGitStore';
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
  Mail,
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
  const router = useRouter();
  const [selectedQuest, setSelectedQuest] = useState<QuestNodeData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isUnconfirmed, setIsUnconfirmed] = useState<boolean>(false);
  const [completedTopics, setCompletedTopics] = useState<string[]>(['init']);
  const [totalXp, setTotalXp] = useState<number>(100);
  const [shakingNodeId, setShakingNodeId] = useState<string | null>(null);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [isUpdatingDb, setIsUpdatingDb] = useState<boolean>(false);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll Progress Hook: Track window scroll so animation starts IMMEDIATELY upon scrolling
  const { scrollYProgress } = useScroll();

  // Map scroll progress to pathLength so the line draws immediately on the first scroll pixel
  const pathLength = useTransform(scrollYProgress, [0, 0.9], [0, 1], { clamp: true });

  // Track scroll percentage for HUD indicator
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest: number) => {
      setScrollPercent(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Load user session & bind progress strictly to authenticated user's ID
  useEffect(() => {
    async function checkAuthAndLoadProgress() {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        // If no authenticated user exists, immediately redirect to /
        if (!authData?.user || authError) {
          useGitStore.getState().resetGitState();
          router.push('/');
          return;
        }

        const currentUser = authData.user;
        setUser(currentUser);

        // Auth Gating Check:
        // Allow access if user.is_anonymous === true.
        // If user.is_anonymous === false AND !user.email_confirmed_at, show verify email block.
        const isAnonymous = currentUser.is_anonymous === true;
        if (!isAnonymous && !currentUser.email_confirmed_at) {
          setIsUnconfirmed(true);
          return;
        }

        // If switching accounts or store has data from another user, purge stale state
        const prevStoreUserId = useGitStore.getState().userId;
        if (prevStoreUserId && prevStoreUserId !== currentUser.id) {
          useGitStore.getState().resetGitState();
        }

        // Fetch that specific user's row from user_progress using .eq('id', user.id)
        let progressRow: any = null;
        const { data: byId, error: errId } = await supabase
          .from('user_progress')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (byId && !errId) {
          progressRow = byId;
        } else {
          // Fallback in case table schema uses user_id
          const { data: byUserId } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          if (byUserId) progressRow = byUserId;
        }

        if (progressRow) {
          const topics = Array.isArray(progressRow.completed_topics)
            ? progressRow.completed_topics
            : ['init'];
          const xp = typeof progressRow.xp === 'number' ? progressRow.xp : 100;
          const repo = progressRow.repo_name || '';
          const branch = progressRow.current_branch_name || 'main';

          setCompletedTopics(topics);
          setTotalXp(xp);

          // Initialize or overwrite the store with the database record
          useGitStore.getState().initializeFromUserProgress({
            userId: currentUser.id,
            completed_topics: topics,
            repo_name: repo,
            current_branch_name: branch,
          });
        } else {
          // New authenticated user without existing row: initialize genesis progress bound to this user
          const initialTopics = ['init'];
          const initialXp = 100;

          setCompletedTopics(initialTopics);
          setTotalXp(initialXp);

          useGitStore.getState().initializeFromUserProgress({
            userId: currentUser.id,
            completed_topics: initialTopics,
            repo_name: '',
            current_branch_name: 'main',
          });

          // Insert or upsert initial record for this user
          try {
            await supabase.from('user_progress').upsert({
              id: currentUser.id,
              user_id: currentUser.id,
              completed_topics: initialTopics,
              xp: initialXp,
              repo_name: '',
              current_branch_name: 'main',
              updated_at: new Date().toISOString(),
            });
          } catch (insertErr) {
            console.warn('Could not insert genesis user_progress:', insertErr);
          }
        }
      } catch (err) {
        console.warn('Auth validation failed, redirecting to /:', err);
        useGitStore.getState().resetGitState();
        router.push('/');
      }
    }

    checkAuthAndLoadProgress();
  }, [router, supabase]);

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

    // Update Zustand store
    useGitStore.getState().addCompletedTopic(id);

    // Persist to Supabase user_progress table
    try {
      if (user) {
        await supabase.from('user_progress').upsert(
          {
            id: user.id,
            user_id: user.id,
            completed_topics: newCompleted,
            xp: newXp,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
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

  if (isUnconfirmed) {
    return (
      <div className="min-h-screen text-[#09090B] flex items-center justify-center p-4 relative z-10 bg-transparent">
        <NoiseOverlay />
        <CustomCursor />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full max-w-md p-6 sm:p-8 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[24px] shadow-[8px_8px_0px_0px_#09090B] text-left select-none font-body"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#09090B] text-[#D2E823] flex items-center justify-center font-bold border border-[#09090B]">
              <Mail className="w-4 h-4" />
            </div>
            <span className="font-mono-brutal text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 py-0.5 border border-[#09090B] rounded shadow-[2px_2px_0px_0px_#09090B]">
              VERIFICATION REQUIRED
            </span>
          </div>

          <h4 className="font-heading text-xl sm:text-2xl text-[#09090B] tracking-tight leading-none mb-2">
            CHECK YOUR INBOX:
          </h4>

          <p className="font-body text-xs sm:text-sm font-bold text-[#09090B]/90 leading-relaxed mb-4">
            A confirmation link was sent to your email. Please verify your email before entering the curriculum.
          </p>

          <div className="p-2.5 bg-white border-2 border-[#09090B] rounded-[8px] font-mono-brutal text-xs font-bold text-[#09090B] shadow-[2px_2px_0px_0px_#09090B] mb-5">
            &gt; Target: {user?.email || 'Registered Account'}
          </div>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full py-3 bg-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer text-center"
          >
            RETURN TO LANDING PAGE
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative z-10 bg-transparent pb-32">
      <NoiseOverlay />
      <CustomCursor />

      {/* Sticky Header with Level & Sign Out */}
      <JourneyHeader
        userEmail={user?.is_anonymous ? 'GUEST JUDGE' : user?.email}
        xp={totalXp}
        level={Math.floor(totalXp / 200) + 1}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 pt-8 sm:pt-12 relative z-10">
        {/* Page Hero Banner */}
        <div className="text-left mb-12 sm:mb-16 border-b-2 border-[#09090B] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D2E823] border-2 border-[#09090B] rounded-full text-xs font-mono-brutal font-bold uppercase tracking-wider mb-4 shadow-[2px_2px_0px_0px_#09090B]">
            <Compass className="w-3.5 h-3.5" />
            <span>CURRICULUM TREE // 5 STAGES</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl text-[#09090B] tracking-tighter leading-none mb-4">
            GITWORLD JOURNEY
          </h1>
          <p className="text-sm sm:text-base text-[#09090B]/80 max-w-2xl font-medium leading-relaxed">
            Scroll down the orthogonal timeline to advance through cryptographic Git concepts. Click any unlocked stage to launch its interactive terminal sandbox.
          </p>
        </div>

        {/* Locked Node Feedback Toast */}
        <AnimatePresence>
          {lockedNotice && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#FF3333] text-white border-2 border-[#09090B] rounded-[12px] shadow-[4px_4px_0px_0px_#09090B] font-mono-brutal text-xs sm:text-sm font-bold flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{lockedNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HUD Indicator: Floating Scroll & Progress Tracker */}
        <aside aria-label="Timeline navigation status" className="fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-3 bg-white border-2 border-[#09090B] rounded-[12px] p-2 shadow-[4px_4px_0px_0px_#09090B]">
          <div className="px-3 py-1 bg-[#F8F4E8] border border-[#09090B] rounded-[6px] font-mono-brutal text-xs font-bold">
            SCROLL: {scrollPercent}%
          </div>
          <div className="px-3 py-1 bg-[#D2E823] border border-[#09090B] rounded-[6px] font-mono-brutal text-xs font-bold text-[#09090B]">
            {completedTopics.length} / 5 COMPLETE
          </div>
        </aside>

        {/* Vertical Timeline Container */}
        <div ref={timelineContainerRef} className="relative min-h-[2200px] w-full py-12">
          {/* ========================================================= */}
          {/* THE JOURNEY LINE: Absolute SVG Orthogonal Path Behind Nodes */}
          {/* ========================================================= */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Desktop SVG Line: 1000px coordinate system */}
            <svg
              className="w-full h-full hidden md:block"
              viewBox="0 0 1000 2200"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Background Guide Line (Dotted / Muted) */}
              <path
                d="M 500,60 L 500,200 L 250,200 L 250,300 L 250,560 L 750,560 L 750,680 L 750,960 L 250,960 L 250,1080 L 250,1360 L 750,1360 L 750,1480 L 750,1760 L 500,1760 L 500,1880 L 500,2100"
                stroke="#09090B"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeOpacity="0.25"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />

              {/* Animated Journey Path (Solid 4px #09090B with pathLength binding) */}
              <motion.path
                d="M 500,60 L 500,200 L 250,200 L 250,300 L 250,560 L 750,560 L 750,680 L 750,960 L 250,960 L 250,1080 L 250,1360 L 750,1360 L 750,1480 L 750,1760 L 500,1760 L 500,1880 L 500,2100"
                stroke="#09090B"
                strokeWidth="4"
                strokeLinecap="square"
                strokeLinejoin="miter"
                style={{ pathLength }}
              />

              {/* Branch Waypoint Junction Circles */}
              <circle cx="500" cy="200" r="6" fill="#09090B" />
              <circle cx="250" cy="200" r="6" fill="#09090B" />
              <circle cx="250" cy="560" r="6" fill="#09090B" />
              <circle cx="750" cy="560" r="6" fill="#09090B" />
              <circle cx="750" cy="960" r="6" fill="#09090B" />
              <circle cx="250" cy="960" r="6" fill="#09090B" />
              <circle cx="250" cy="1360" r="6" fill="#09090B" />
              <circle cx="750" cy="1360" r="6" fill="#09090B" />
              <circle cx="750" cy="1760" r="6" fill="#09090B" />
              <circle cx="500" cy="1760" r="6" fill="#09090B" />
            </svg>

            {/* Mobile SVG Line: Simple Straight Spine */}
            <svg
              className="w-full h-full block md:hidden"
              viewBox="0 0 100 2200"
              fill="none"
              preserveAspectRatio="none"
            >
              <line
                x1="24"
                y1="40"
                x2="24"
                y2="2160"
                stroke="#09090B"
                strokeWidth="3"
                strokeDasharray="6 6"
                strokeOpacity="0.3"
              />
              <motion.line
                x1="24"
                y1="40"
                x2="24"
                y2="2160"
                stroke="#09090B"
                strokeWidth="3"
                style={{ pathLength }}
              />
            </svg>
          </div>

          {/* ========================================================= */}
          {/* TIMELINE NODES (Alternating Zigzag Layout) */}
          {/* ========================================================= */}
          <div className="relative z-10 flex flex-col justify-between h-full space-y-24 md:space-y-36">
            {/* Top Root Anchor */}
            <div className="flex justify-center mb-4">
              <div className="px-4 py-1.5 bg-[#09090B] text-[#D2E823] font-mono-brutal text-xs font-bold rounded-full border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D2E823] animate-ping" />
                <span>GENESIS TRUNK: refs/heads/main</span>
              </div>
            </div>

            {/* STAGE 01: INIT (Left on desktop) */}
            <TimelineNodeItem
              index={0}
              topic={TOPICS_CONFIG.init}
              isUnlocked={isNodeUnlocked('init')}
              isCompleted={isNodeCompleted('init')}
              isShaking={shakingNodeId === 'init'}
              onLockedClick={() => handleLockedClick('init', TOPICS_CONFIG.init.requires)}
              onInspect={() => setSelectedQuest(getQuestData('init'))}
              onMarkDone={(e) => handleMarkAsDone(e, 'init')}
              alignment="left"
            />

            {/* STAGE 02: COMMIT (Right on desktop) */}
            <TimelineNodeItem
              index={1}
              topic={TOPICS_CONFIG.commit}
              isUnlocked={isNodeUnlocked('commit')}
              isCompleted={isNodeCompleted('commit')}
              isShaking={shakingNodeId === 'commit'}
              onLockedClick={() => handleLockedClick('commit', TOPICS_CONFIG.commit.requires)}
              onInspect={() => setSelectedQuest(getQuestData('commit'))}
              onMarkDone={(e) => handleMarkAsDone(e, 'commit')}
              alignment="right"
            />

            {/* STAGE 03: BRANCHING (Left on desktop) */}
            <TimelineNodeItem
              index={2}
              topic={TOPICS_CONFIG.branching}
              isUnlocked={isNodeUnlocked('branching')}
              isCompleted={isNodeCompleted('branching')}
              isShaking={shakingNodeId === 'branching'}
              onLockedClick={() => handleLockedClick('branching', TOPICS_CONFIG.branching.requires)}
              onInspect={() => setSelectedQuest(getQuestData('branching'))}
              onMarkDone={(e) => handleMarkAsDone(e, 'branching')}
              alignment="left"
            />

            {/* STAGE 04: MERGING (Right on desktop) */}
            <TimelineNodeItem
              index={3}
              topic={TOPICS_CONFIG.merging}
              isUnlocked={isNodeUnlocked('merging')}
              isCompleted={isNodeCompleted('merging')}
              isShaking={shakingNodeId === 'merging'}
              onLockedClick={() => handleLockedClick('merging', TOPICS_CONFIG.merging.requires)}
              onInspect={() => setSelectedQuest(getQuestData('merging'))}
              onMarkDone={(e) => handleMarkAsDone(e, 'merging')}
              alignment="right"
            />

            {/* STAGE 05: CONFLICTS (Center / Final Apex on desktop) */}
            <TimelineNodeItem
              index={4}
              topic={TOPICS_CONFIG.conflicts}
              isUnlocked={isNodeUnlocked('conflicts')}
              isCompleted={isNodeCompleted('conflicts')}
              isShaking={shakingNodeId === 'conflicts'}
              onLockedClick={() => handleLockedClick('conflicts', TOPICS_CONFIG.conflicts.requires)}
              onInspect={() => setSelectedQuest(getQuestData('conflicts'))}
              onMarkDone={(e) => handleMarkAsDone(e, 'conflicts')}
              alignment="center"
            />

            {/* Bottom Apex Terminus */}
            <div className="flex justify-center pt-8">
              <div className="p-6 bg-white border-2 border-[#09090B] rounded-[16px] shadow-[6px_6px_0px_0px_#09090B] max-w-md text-center">
                <span className="font-mono-brutal text-xs font-bold text-[#09090B]/60 uppercase tracking-widest block mb-2">
                  TIMELINE TERMINUS
                </span>
                <h4 className="font-heading text-xl sm:text-2xl text-[#09090B] mb-2 tracking-tight">
                  {completedTopics.length === 5 ? 'GIT ARCHITECT CERTIFIED' : 'THE JOURNEY CONTINUES'}
                </h4>
                <p className="text-xs text-[#09090B]/70 font-medium mb-4">
                  {completedTopics.length === 5
                    ? 'All 5 timeline nodes synthesized cleanly into trunk. You have mastered local Git.'
                    : `Complete all nodes to unlock advanced Git Crucible modules (${completedTopics.length}/5 done).`}
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
                >
                  <span>RETURN TO HOME</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Quest Modal for Topic Details */}
      <QuestModal
        quest={selectedQuest}
        isOpen={!!selectedQuest}
        onClose={() => setSelectedQuest(null)}
        onLaunchTopic={(id: string) => {
          setSelectedQuest(null);
          router.push(`/topic/${id}`);
        }}
      />
    </div>
  );
}

// =================================================================
// Subcomponent: TimelineNodeItem
// Neo-Brutalist Box with Sharp Jagged Shake Animation on Locked Click
// =================================================================
interface TimelineNodeItemProps {
  index: number;
  topic: TopicNodeConfig;
  isUnlocked: boolean;
  isCompleted: boolean;
  isShaking: boolean;
  onLockedClick: () => void;
  onInspect: () => void;
  onMarkDone: (e: React.MouseEvent) => void;
  alignment: 'left' | 'right' | 'center';
}

function TimelineNodeItem({
  index,
  topic,
  isUnlocked,
  isCompleted,
  isShaking,
  onLockedClick,
  onInspect,
  onMarkDone,
  alignment,
}: TimelineNodeItemProps) {
  const router = useRouter();

  // Determine horizontal placement for zigzag layout
  const justifyClass =
    alignment === 'left'
      ? 'md:justify-start md:pl-8'
      : alignment === 'right'
      ? 'md:justify-end md:pr-8'
      : 'md:justify-center';

  // Jagged shake keyframes (sharp horizontal steps, no soft bounce)
  const shakeAnimation = isShaking
    ? {
        x: [-6, 6, -6, 6, -3, 3, 0],
        transition: { duration: 0.25, ease: 'linear' as const },
      }
    : { x: 0 };

  return (
    <div className={`w-full flex justify-start pl-8 md:pl-0 ${justifyClass}`}>
      <motion.div
        animate={shakeAnimation}
        className={`relative w-full max-w-sm sm:max-w-md ${
          isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
        onClick={() => {
          if (!isUnlocked) {
            onLockedClick();
          } else {
            onInspect();
          }
        }}
      >
        {/* Node Brutalist Card Container */}
        <div
          className={`relative border-2 border-[#09090B] rounded-[16px] p-5 sm:p-6 transition-all select-none ${
            isUnlocked
              ? isCompleted
                ? 'bg-[#D2E823] text-[#09090B] shadow-[6px_6px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#09090B]'
                : 'bg-[#F8F4E8] text-[#09090B] shadow-[6px_6px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#09090B]'
              : 'bg-[#F8F4E8]/60 text-[#09090B]/60 grayscale opacity-60 shadow-[3px_3px_0px_0px_#09090B]'
          }`}
        >
          {/* Top Status & Stage Badge */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono-brutal text-[11px] font-bold px-2 py-0.5 rounded border border-[#09090B] shadow-[1px_1px_0px_0px_#09090B] ${
                  isUnlocked
                    ? isCompleted
                      ? 'bg-white text-[#09090B]'
                      : 'bg-[#D2E823] text-[#09090B]'
                    : 'bg-white text-[#09090B]/50'
                }`}
              >
                {topic.stage}
              </span>
              <span className="font-mono-brutal text-[11px] font-bold text-[#09090B]/60">
                {topic.xp} XP
              </span>
            </div>

            {/* Lock / Completed Status Icon */}
            <div>
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 font-mono-brutal text-[10px] font-bold uppercase bg-[#09090B] text-[#D2E823] px-2 py-0.5 rounded border border-[#09090B]">
                  <Check className="w-3 h-3" />
                  <span>DONE</span>
                </span>
              ) : isUnlocked ? (
                <span className="inline-flex items-center gap-1 font-mono-brutal text-[10px] font-bold uppercase bg-white text-[#09090B] px-2 py-0.5 rounded border border-[#09090B] shadow-[1px_1px_0px_0px_#09090B]">
                  <Zap className="w-3 h-3 text-[#09090B]" />
                  <span>ACTIVE</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono-brutal text-[10px] font-bold uppercase bg-[#09090B]/10 text-[#09090B] px-2 py-0.5 rounded border border-[#09090B]/40">
                  <Lock className="w-3 h-3" />
                  <span>LOCKED</span>
                </span>
              )}
            </div>
          </div>

          {/* Title & Tagline */}
          <h3 className="font-heading text-2xl sm:text-3xl text-[#09090B] tracking-tighter leading-none mb-1">
            {topic.title}
          </h3>
          <p className="font-mono-brutal text-xs font-bold text-[#09090B]/70 uppercase tracking-tight mb-3">
            // {topic.tagline}
          </p>

          <p className="text-xs sm:text-sm text-[#09090B]/85 font-medium leading-relaxed mb-5 line-clamp-2">
            {topic.description}
          </p>

          {/* Interactive Button Group */}
          <div className="flex items-center gap-2 pt-2 border-t-2 border-[#09090B]/15">
            {isUnlocked ? (
              <>
                <Link
                  href={`/topic/${topic.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 py-2 px-3 bg-[#09090B] hover:bg-[#D2E823] hover:text-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>ENTER QUEST</span>
                </Link>

                {!isCompleted && (
                  <button
                    onClick={onMarkDone}
                    className="py-2 px-3 bg-white hover:bg-[#D2E823] text-[#09090B] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="Mark stage completed"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">DONE</span>
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLockedClick();
                }}
                className="w-full py-2 px-3 bg-[#09090B]/10 text-[#09090B]/70 font-mono-brutal text-xs font-bold uppercase rounded-[8px] border border-[#09090B]/40 flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>PREREQUISITE REQUIRED</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
