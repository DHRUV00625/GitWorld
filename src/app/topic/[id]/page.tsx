'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitStore } from '@/store/useGitStore';
import { createClient } from '@/utils/supabase/client';
import NoiseOverlay from '@/components/NoiseOverlay';
import CustomCursor from '@/components/CustomCursor';
import {
  ArrowLeft,
  Terminal as TerminalIcon,
  CheckCircle2,
  GitBranch,
  Folder,
  Layers,
  ArrowRight,
  Sparkles,
  Shield,
  HelpCircle,
  FileCode,
  Zap,
  CornerDownLeft,
  RotateCcw,
} from 'lucide-react';

interface TopicMeta {
  id: string;
  stageNum: string;
  stageName: string;
  title: string;
  xp: number;
  expectedPattern: RegExp;
  hint: string;
  theory: {
    whatItIs: string;
    whyWeNeedIt: string;
    howItWorks: string;
    theSolution: string;
  };
  nextTopicId: string | null;
  nextTopicTitle: string;
}

const TOPIC_REGISTRY: Record<string, TopicMeta> = {
  init: {
    id: 'init',
    stageNum: 'STAGE 01',
    stageName: 'INIT',
    title: 'THE GENESIS REPOSITORY',
    xp: 100,
    expectedPattern: /^git\s+init(?:\s+([a-zA-Z0-9_\-\.]+))?$/,
    hint: 'git init gitworld-project',
    theory: {
      whatItIs:
        'The `git init` command creates a brand new Git repository or reinitializes an existing one. It constructs the hidden `.git` folder that houses all objects, configuration, and pointer heads.',
      whyWeNeedIt:
        'Without repository initialization, version control cannot track delta history. Git needs a dedicated metadata database to record your commits, branches, and cryptographic hashes.',
      howItWorks:
        'Git allocates a `.git/` directory containing the `objects/` hash database, `refs/` directory for branch pointers, and a `HEAD` file referencing `refs/heads/main`.',
      theSolution:
        'Run `git init <name>` to spawn your repository folder and establish your genesis block. This sets the foundation for all subsequent commits.',
    },
    nextTopicId: 'commit',
    nextTopicTitle: '02. COMMIT',
  },
  commit: {
    id: 'commit',
    stageNum: 'STAGE 02',
    stageName: 'COMMIT',
    title: 'IMMUTABLE SNAPSHOTS',
    xp: 150,
    expectedPattern: /^git\s+(?:add\s+.*&&.*)?commit.*$/,
    hint: 'git commit -m "feat: genesis snapshot"',
    theory: {
      whatItIs:
        'A Git commit is an immutable cryptographic snapshot of your project at a specific instant in time. Each commit records an author, timestamp, parent pointer, and SHA-1/SHA-256 tree hash.',
      whyWeNeedIt:
        'Commits give you an irreversible history audit trail. Unlike standard file saving, Git commits allow you to rewind, compare diffs, and inspect parent lineage across the Directed Acyclic Graph.',
      howItWorks:
        'Files are staged into the Index cache, then compressed into immutable blob and tree objects. A commit object is created with a unique 40-character hash pointing to the tree.',
      theSolution:
        'Stage your modifications and execute `git commit -m "<message>"` to seal an immutable record into the repository history.',
    },
    nextTopicId: 'branching',
    nextTopicTitle: '03. BRANCHING',
  },
  branching: {
    id: 'branching',
    stageNum: 'STAGE 03',
    stageName: 'BRANCHING',
    title: 'PARALLEL TIMELINES',
    xp: 200,
    expectedPattern: /^git\s+(?:checkout\s+-b|switch\s+-c|branch)\s+([a-zA-Z0-9_\-\.\/]+)$/,
    hint: 'git checkout -b feature/quantum-leap',
    theory: {
      whatItIs:
        'A Git branch is a movable 41-byte pointer referencing a specific commit in the DAG. It enables teams to construct isolated features without disturbing the production trunk.',
      whyWeNeedIt:
        'Branches prevent untested code from polluting stable releases. They allow multiple engineers to work on divergent features in complete isolation simultaneously.',
      howItWorks:
        'Creating a branch does not copy files. It simply creates a new reference file under `.git/refs/heads/` that advances automatically whenever new commits are forged.',
      theSolution:
        'Use `git checkout -b <branchName>` to simultaneously spawn a new timeline pointer and switch your HEAD focus to that track.',
    },
    nextTopicId: 'merging',
    nextTopicTitle: '04. MERGING',
  },
  merging: {
    id: 'merging',
    stageNum: 'STAGE 04',
    stageName: 'MERGING',
    title: 'TIMELINE SYNTHESIS',
    xp: 250,
    expectedPattern: /^git\s+merge(?:\s+([a-zA-Z0-9_\-\.\/]+))?$/,
    hint: 'git merge feature/quantum-leap',
    theory: {
      whatItIs:
        'Merging combines divergent lines of development. It reconciles independent histories from one branch and integrates them cleanly into your current target branch.',
      whyWeNeedIt:
        'Once experimental feature work is vetted and tested, its changes must be integrated back into the main trunk so downstream teammates can benefit from the work.',
      howItWorks:
        'If the target branch has not diverged, Git executes a Fast-Forward merge by simply moving the pointer forward. If both diverged, Git constructs a 3-way merge commit with two parents.',
      theSolution:
        'Switch to your base trunk (`git checkout main`) and execute `git merge <featureBranch>` to synthesize your branch histories.',
    },
    nextTopicId: 'conflicts',
    nextTopicTitle: '05. CONFLICTS',
  },
  conflicts: {
    id: 'conflicts',
    stageNum: 'STAGE 05',
    stageName: 'CONFLICTS',
    title: 'THE CRUCIBLE OF DIFFS',
    xp: 350,
    expectedPattern: /^git\s+(?:merge|commit|add).*$/,
    hint: 'git commit -m "fix: resolve crucible conflict"',
    theory: {
      whatItIs:
        'A merge conflict occurs when concurrent commits modify the same lines of a file in incompatible ways. Git pauses synthesis and inserts visual collision markers.',
      whyWeNeedIt:
        'Git refuses to blindly guess which developer’s code is correct. The crucible ensures human engineers deliberately verify and decide what code survives.',
      howItWorks:
        'Git annotates the conflicted file with `<<<<<<< HEAD` (current branch changes), `=======` (boundary divider), and `>>>>>>>` (incoming branch changes).',
      theSolution:
        'Inspect the conflicting lines, remove the collision markers, choose the correct composite logic, and seal the resolution with `git commit`.',
    },
    nextTopicId: null,
    nextTopicTitle: 'JOURNEY COMPLETED',
  },
};

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || 'init';
  const topic = TOPIC_REGISTRY[rawId] || TOPIC_REGISTRY.init;

  // Global Zustand Store
  const {
    repoName,
    currentBranch,
    completedCommands,
    setRepoName,
    setCurrentBranch,
    addCompletedCommand,
  } = useGitStore();

  // Local State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<
    { text: string; isUser?: boolean; isError?: boolean; isSuccess?: boolean }[]
  >([]);
  const [isCommandLocked, setIsCommandLocked] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState(false);
  const [simulatedRepoName, setSimulatedRepoName] = useState(repoName || 'gitworld-project');

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Initialize terminal welcome log
  useEffect(() => {
    const activeRepo = repoName || 'gitworld-project';
    setSimulatedRepoName(activeRepo);

    setTerminalHistory([
      { text: `=== GITWORLD TERMINAL EMULATOR // ${topic.stageNum} ===` },
      { text: `Topic Mission: ${topic.title}` },
      { text: `Working Dir: ~/${activeRepo}` },
      { text: `Current Branch: [${currentBranch}]` },
      { text: `Hint: Execute '${topic.hint}' to pass quest.` },
      { text: `--------------------------------------------------------` },
    ]);

    // Focus input field automatically
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [topic.id, repoName, currentBranch]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory, showAnimation, showSuccessBadge]);

  // Command submission logic
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd || isCommandLocked) return;

    // Log the typed command
    const newHistory = [...terminalHistory, { text: `>_ ${cmd}`, isUser: true }];
    setTerminalHistory(newHistory);
    setTerminalInput('');

    // Check command validity against topic's expected pattern
    const match = cmd.match(topic.expectedPattern);

    if (match) {
      // Valid command execution
      setIsCommandLocked(true); // Lock input immediately: can only be executed once

      // State persistence logic
      let updatedRepo = repoName;
      if (topic.id === 'init') {
        const customName = match[1] || 'gitworld-project';
        setRepoName(customName);
        setSimulatedRepoName(customName);
        updatedRepo = customName;
      } else if (topic.id === 'branching') {
        const customBranch = match[1] || 'feature/sandbox';
        setCurrentBranch(customBranch);
      }

      addCompletedCommand(cmd);

      // Add feedback lines
      setTerminalHistory((prev) => [
        ...prev,
        { text: `[OK] Command verified: ${cmd}`, isSuccess: true },
        { text: `Generating cryptographic Git tree objects...` },
      ]);

      // Trigger Framer Motion sequence
      setTimeout(() => {
        setShowAnimation(true);
      }, 400);

      // Trigger Quest Complete Sticker
      setTimeout(() => {
        setShowSuccessBadge(true);
      }, 1200);

      // Persist completion to Supabase user_progress table
      try {
        const { data: authData } = await supabase.auth.getUser();
        const cached = localStorage.getItem('gitworld_progress');
        let currentCompleted: string[] = ['init'];
        let currentXp = 100;
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed.completed_topics)) currentCompleted = parsed.completed_topics;
            if (typeof parsed.xp === 'number') currentXp = parsed.xp;
          } catch {}
        }

        if (!currentCompleted.includes(topic.id)) {
          const nextCompleted = [...currentCompleted, topic.id];
          const nextXp = currentXp + topic.xp;
          localStorage.setItem(
            'gitworld_progress',
            JSON.stringify({ completed_topics: nextCompleted, xp: nextXp })
          );

          if (authData?.user) {
            await supabase.from('user_progress').upsert(
              {
                user_id: authData.user.id,
                completed_topics: nextCompleted,
                xp: nextXp,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            );
          }
        }
      } catch (err) {
        console.warn('Could not sync progress to Supabase:', err);
      }
    } else {
      // Invalid command feedback
      setTerminalHistory((prev) => [
        ...prev,
        {
          text: `[ERROR] Command unrecognized for this quest. ${topic.hint}`,
          isError: true,
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative pb-20">
      <NoiseOverlay />
      <CustomCursor />

      {/* ========================================================= */}
      {/* TOP HEADER: STICKY NAV */}
      {/* ========================================================= */}
      <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="w-full h-16 sm:h-20 bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] px-4 sm:px-8 flex items-center justify-between shadow-[4px_4px_0px_0px_#09090B]">
          {/* Left: Back Button & Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/journey"
              className="px-3 py-2 bg-white hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 font-mono-brutal text-xs font-bold cursor-pointer"
              title="Return to Journey Timeline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">BACK TO JOURNEY</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-2xl text-[#09090B] tracking-tighter">
                GITWORLD
              </span>
              <span className="font-mono-brutal font-bold text-xs text-[#09090B]/40 hidden sm:inline">
                //
              </span>
              <span className="font-mono-brutal font-bold text-xs uppercase bg-[#D2E823] text-[#09090B] px-2.5 py-1 border border-[#09090B] rounded shadow-[2px_2px_0px_0px_#09090B]">
                {topic.stageNum}: {topic.stageName}
              </span>
            </div>
          </div>

          {/* Right: Active Repo / Branch Indicator */}
          <div className="flex items-center gap-2 font-mono-brutal text-xs font-bold">
            <div className="hidden md:flex items-center gap-2 bg-white border-2 border-[#09090B] px-3 py-1.5 rounded-[8px] shadow-[2px_2px_0px_0px_#09090B]">
              <Folder className="w-3.5 h-3.5 text-[#09090B]" />
              <span className="text-[#09090B]">
                repo: {repoName ? repoName : '(uninitialized)'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#09090B] text-[#D2E823] border-2 border-[#09090B] px-3 py-1.5 rounded-[8px] shadow-[2px_2px_0px_0px_#09090B]">
              <GitBranch className="w-3.5 h-3.5 text-[#D2E823]" />
              <span>{currentBranch}</span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 12-COLUMN SPLIT VIEW LAYOUT */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ======================================================= */}
          {/* LEFT SIDE: THEORY BENTO GRID (5 Columns) */}
          {/* ======================================================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* Mission Overview Badge Box */}
            <div className="bg-white border-2 border-[#09090B] rounded-[16px] p-6 shadow-[4px_4px_0px_0px_#09090B]">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#D2E823] text-[#09090B] font-mono-brutal font-bold text-[10px] uppercase border border-[#09090B] rounded-full mb-2">
                <Shield className="w-3 h-3" />
                <span>THEORY BRIEFING // +{topic.xp} XP</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl text-[#09090B] tracking-tight">
                {topic.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#09090B]/80 font-medium mt-2 leading-relaxed">
                Read the theoretical breakdown below, then switch to the Sandbox terminal on the right to forge the required command.
              </p>
            </div>

            {/* Bento Card 1: WHAT IT IS */}
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 shadow-[4px_4px_0px_0px_#09090B]">
              <div className="flex items-center gap-2 border-b-2 border-[#09090B]/20 pb-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#09090B] rounded-full" />
                <h3 className="font-heading text-base sm:text-lg text-[#09090B]">
                  WHAT IT IS
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#09090B]/90 font-medium leading-relaxed">
                {topic.theory.whatItIs}
              </p>
            </div>

            {/* Bento Card 2: WHY WE NEED IT */}
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 shadow-[4px_4px_0px_0px_#09090B]">
              <div className="flex items-center gap-2 border-b-2 border-[#09090B]/20 pb-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#D2E823] border border-[#09090B] rounded-full" />
                <h3 className="font-heading text-base sm:text-lg text-[#09090B]">
                  WHY WE NEED IT
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#09090B]/90 font-medium leading-relaxed">
                {topic.theory.whyWeNeedIt}
              </p>
            </div>

            {/* Bento Card 3: HOW IT WORKS */}
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 shadow-[4px_4px_0px_0px_#09090B]">
              <div className="flex items-center gap-2 border-b-2 border-[#09090B]/20 pb-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#09090B] rounded-full" />
                <h3 className="font-heading text-base sm:text-lg text-[#09090B]">
                  HOW IT WORKS
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#09090B]/90 font-medium leading-relaxed">
                {topic.theory.howItWorks}
              </p>
            </div>

            {/* Bento Card 4: THE SOLUTION */}
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 shadow-[4px_4px_0px_0px_#09090B]">
              <div className="flex items-center gap-2 border-b-2 border-[#09090B]/20 pb-2 mb-3">
                <span className="w-2.5 h-2.5 bg-[#D2E823] border border-[#09090B] rounded-full" />
                <h3 className="font-heading text-base sm:text-lg text-[#09090B]">
                  THE SOLUTION
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#09090B]/90 font-medium leading-relaxed mb-3">
                {topic.theory.theSolution}
              </p>
              <div className="bg-white border border-[#09090B] p-2.5 rounded-[6px] font-mono-brutal text-xs font-bold text-[#09090B]">
                $ {topic.hint}
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* RIGHT SIDE: THE SANDBOX CONTAINER (7 Columns) */}
          {/* ======================================================= */}
          <div className="lg:col-span-7">
            <div className="w-full bg-[#09090B] border-2 border-[#09090B] rounded-[16px] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#D2E823] relative overflow-hidden flex flex-col min-h-[620px]">
              {/* Terminal Window Chrome */}
              <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-[#09090B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 border border-[#09090B]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500 border border-[#09090B]" />
                  <span className="font-mono-brutal text-xs text-zinc-400 font-bold ml-2">
                    bash -- sandbox-terminal
                  </span>
                </div>

                <div className="font-mono-brutal text-[11px] font-bold text-[#D2E823] bg-zinc-900 px-2.5 py-0.5 rounded border border-zinc-700">
                  SANDBOX ACTIVE
                </div>
              </div>

              {/* Terminal Log Output Area */}
              <div className="flex-1 font-mono-brutal text-xs space-y-1.5 text-[#D2E823] overflow-y-auto max-h-[280px] pr-2 scrollbar-thin">
                {terminalHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={
                      item.isError
                        ? 'text-red-400 font-bold'
                        : item.isSuccess
                        ? 'text-white font-bold bg-[#D2E823]/20 px-2 py-1 rounded'
                        : item.isUser
                        ? 'text-white font-bold'
                        : 'text-[#D2E823]/90'
                    }
                  >
                    {item.text}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* ===================================================== */}
              {/* FAKE GIT ANIMATION SEQUENCE (Revealed DOM on success) */}
              {/* ===================================================== */}
              <AnimatePresence>
                {showAnimation && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.77, 0, 0.175, 1] }}
                    className="my-4 p-4 bg-[#F8F4E8] text-[#09090B] border-2 border-[#D2E823] rounded-[10px] shadow-[4px_4px_0px_0px_#D2E823]"
                  >
                    {topic.id === 'init' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Folder className="w-5 h-5 text-[#09090B]" />
                          <span className="font-heading text-base sm:text-lg text-[#09090B]">
                            DIRECTORY INITIALIZED: ~/{simulatedRepoName}/.git
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-brutal font-bold text-[#09090B]/80 pt-1 border-t border-[#09090B]/20">
                          <div>✔ objects/ (hash storage)</div>
                          <div>✔ refs/heads/main</div>
                          <div>✔ HEAD -&gt; refs/heads/main</div>
                          <div>✔ config (genesis)</div>
                        </div>
                      </div>
                    )}

                    {topic.id === 'commit' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-[#09090B]" />
                          <span className="font-heading text-base sm:text-lg text-[#09090B]">
                            IMMUTABLE COMMIT SNAPSHOT SEALED
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-brutal font-bold text-[#09090B]/80 pt-1 border-t border-[#09090B]/20">
                          <div>commit sha1: [b8f4a1c9e832049d]</div>
                          <div>Author: BrutalistDev &lt;dev@gitworld.dev&gt;</div>
                          <div>Root tree snapshot linked into DAG.</div>
                        </div>
                      </div>
                    )}

                    {topic.id === 'branching' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-5 h-5 text-[#09090B]" />
                          <span className="font-heading text-base sm:text-lg text-[#09090B]">
                            PARALLEL TRACK FORKED: [{currentBranch}]
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-brutal font-bold text-[#09090B]/80 pt-1 border-t border-[#09090B]/20">
                          <div>HEAD detached from main -&gt; switched to {currentBranch}</div>
                          <div>Orthogonal branch line active for isolated commits.</div>
                        </div>
                      </div>
                    )}

                    {topic.id === 'merging' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-[#09090B]" />
                          <span className="font-heading text-base sm:text-lg text-[#09090B]">
                            TIMELINE SYNTHESIZED: FAST-FORWARD MERGE
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-brutal font-bold text-[#09090B]/80 pt-1 border-t border-[#09090B]/20">
                          <div>Updating main pointer: 8f4a1c..e4b901</div>
                          <div>Fast-forward merge complete. Zero conflicts encountered.</div>
                        </div>
                      </div>
                    )}

                    {topic.id === 'conflicts' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-[#09090B]" />
                          <span className="font-heading text-base sm:text-lg text-[#09090B]">
                            CRUCIBLE DIFF RESOLUTION CONCLUDED
                          </span>
                        </div>
                        <div className="text-[11px] font-mono-brutal font-bold text-[#09090B]/80 pt-1 border-t border-[#09090B]/20">
                          <div>Resolved collision markers: &lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD cleansed.</div>
                          <div>Merge commit forged. The entire curriculum is mastered!</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ===================================================== */}
              {/* SUCCESS STATE BADGE & PROCEED BUTTON */}
              {/* ===================================================== */}
              <AnimatePresence>
                {showSuccessBadge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="my-3 p-4 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[12px] shadow-[6px_6px_0px_0px_#09090B] flex flex-col sm:flex-row items-center justify-between gap-4 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#09090B] text-[#D2E823] flex items-center justify-center font-bold shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-heading text-xl sm:text-2xl text-[#09090B] tracking-tight leading-none">
                          QUEST COMPLETE!
                        </h4>
                        <span className="font-mono-brutal text-xs font-bold text-[#09090B]/80">
                          +{topic.xp} XP AWARDED // STAGE UNLOCKED
                        </span>
                      </div>
                    </div>

                    {topic.nextTopicId ? (
                      <Link
                        href={`/topic/${topic.nextTopicId}`}
                        className="px-5 py-2.5 bg-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[6px] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#09090B] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>PROCEED TO {topic.nextTopicTitle}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href="/journey"
                        className="px-5 py-2.5 bg-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[6px] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#09090B] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>VIEW COMPLETED TIMELINE</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Terminal Input Bar */}
              <form
                onSubmit={handleCommandSubmit}
                className="mt-auto pt-3 border-t-2 border-zinc-800 flex items-center gap-2"
              >
                <span className="font-mono-brutal text-sm font-bold text-[#D2E823] shrink-0 select-none">
                  &gt;_
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  disabled={isCommandLocked}
                  placeholder={
                    isCommandLocked
                      ? 'Quest executed & locked. Proceed to next stage.'
                      : `Type '${topic.hint}' and press Enter...`
                  }
                  className={`w-full bg-transparent font-mono-brutal text-xs sm:text-sm font-bold focus:outline-none transition-colors ${
                    isCommandLocked
                      ? 'text-zinc-600 cursor-not-allowed italic'
                      : 'text-[#D2E823] placeholder:text-zinc-600'
                  }`}
                  autoFocus
                />
                {!isCommandLocked && (
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#D2E823] text-[#09090B] font-mono-brutal text-xs font-bold rounded border border-[#09090B] hover:bg-white transition-colors cursor-pointer shrink-0"
                  >
                    RUN
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
