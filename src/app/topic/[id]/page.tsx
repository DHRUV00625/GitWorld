'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitStore } from '@/store/useGitStore';
import { createClient } from '@/utils/supabase/client';
import NoiseOverlay from '@/components/NoiseOverlay';
import CustomCursor from '@/components/CustomCursor';
import BranchingVisualizer from '@/components/BranchingVisualizer';
import InitVisualizer from '@/components/InitVisualizer';
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
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';

interface TheoryBento {
  whatItIs: string;
  whyWeNeedIt: string;
  howItWorks: string;
  howItHelps: string;
}

interface TopicMeta {
  id: string;
  stageNum: string;
  stageName: string;
  title: string;
  xp: number;
  expectedPattern: RegExp;
  hint: string;
  theory: TheoryBento;
  nextTopicId: string | null;
  nextTopicTitle: string;
}

const TOPIC_REGISTRY: Record<string, TopicMeta> = {
  init: {
    id: 'init',
    stageNum: '01',
    stageName: 'INIT',
    title: 'THE GENESIS REPOSITORY',
    xp: 100,
    expectedPattern: /^git\s+init(?:\s+([a-zA-Z0-9_\-\.]+))?$/,
    hint: 'git init gitworld-project',
    theory: {
      whatItIs:
        'The `git init` command initializes a brand-new Git repository or converts an existing unversioned workspace into a fully tracked local repository.',
      whyWeNeedIt:
        'Without repository initialization, project files are unmonitored text. Git cannot track modifications, record commit graphs, or maintain cryptographic diff integrity.',
      howItWorks:
        'Git creates a hidden `.git` directory containing the internal object database (`objects/`), reference heads (`refs/heads/`), index staging file, and `HEAD` pointer.',
      howItHelps:
        'Establishes the immutable foundation for local version control, allowing you to branch, commit, and travel back to any historical state in seconds.',
    },
    nextTopicId: 'commit',
    nextTopicTitle: '02. COMMIT',
  },
  commit: {
    id: 'commit',
    stageNum: '02',
    stageName: 'COMMIT',
    title: 'IMMUTABLE SNAPSHOTS',
    xp: 150,
    expectedPattern: /^git\s+commit(?:\s+.*)?$/,
    hint: 'git commit -m "feat: initial commit"',
    theory: {
      whatItIs:
        'A commit is an immutable cryptographic snapshot of staged workspace changes, capturing exact file tree states, author metadata, and a parent commit hash.',
      whyWeNeedIt:
        'Directly saving over files destroys change history and context. Commits create a verifiable, auditable Directed Acyclic Graph (DAG) of the project.',
      howItWorks:
        'Git packages staged index items into compressed SHA-1/SHA-256 blob objects, links them via tree objects, and seals them into a timestamped commit object.',
      howItHelps:
        'Provides airtight rollbacks, pinpoint diffs, regression bisecting, and permanent lineage protection for your entire codebase.',
    },
    nextTopicId: 'branching',
    nextTopicTitle: '03. BRANCHING',
  },
  branching: {
    id: 'branching',
    stageNum: '03',
    stageName: 'BRANCHING',
    title: 'PARALLEL UNIVERSES',
    xp: 200,
    expectedPattern: /^git\s+(?:checkout\s+-b|switch\s+-c|branch)(?:\s+([a-zA-Z0-9_\-\.\/]+))?$/,
    hint: 'git branch feature/quantum-leap',
    theory: {
      whatItIs:
        'A Git branch is an independent, lightweight movable pointer referencing a specific commit. Creating branches diverges your work without affecting trunk.',
      whyWeNeedIt:
        'Coding new experimental features or repairs directly on `main` threatens production stability. Branches isolate active development completely.',
      howItWorks:
        'Git writes a 41-byte pointer in `.git/refs/heads/<branch-name>` pointing to current HEAD, then switches the active reference pointer to this new branch.',
      howItHelps:
        'Empowers parallel feature engineering, isolated bugfixing, painless context switching, and safe experimentation with zero trunk pollution.',
    },
    nextTopicId: 'merging',
    nextTopicTitle: '04. MERGING',
  },
  merging: {
    id: 'merging',
    stageNum: '04',
    stageName: 'MERGING',
    title: 'TIMELINE CONVERGENCE',
    xp: 250,
    expectedPattern: /^git\s+merge(?:\s+([a-zA-Z0-9_\-\.\/]+))?$/,
    hint: 'git merge feature/quantum-leap',
    theory: {
      whatItIs:
        'Merging combines divergence histories from two separate branch pointers back into a unified branch, reconciling parallel development efforts.',
      whyWeNeedIt:
        'Isolated feature work must eventually be integrated into the primary deployment trunk without losing authorship or individual commit histories.',
      howItWorks:
        'Git performs either a Fast-Forward pointer advance or a 3-way merge algorithm finding the common ancestor commit, creating a 2-parent merge commit.',
      howItHelps:
        'Automates conflict identification, locks in reviewed team features, and unifies fragmented code streams cleanly.',
    },
    nextTopicId: 'remote',
    nextTopicTitle: '05. REMOTE',
  },
  remote: {
    id: 'remote',
    stageNum: '05',
    stageName: 'REMOTE',
    title: 'INTERSTELLAR SYNC',
    xp: 300,
    expectedPattern: /^git\s+push(?:\s+.*)?$/,
    hint: 'git push origin main',
    theory: {
      whatItIs:
        'Remote operations link your offline repository with distributed cloud hosting peers like GitHub, GitLab, or internal enterprise servers.',
      whyWeNeedIt:
        'Local machines are single points of failure. Distributed development requires decentralized synchronization and multi-engineer collaboration.',
      howItWorks:
        'Git negotiates SHA object packs over SSH or HTTPS, uploads delta blobs, and securely synchronizes remote tracking references (`origin/main`).',
      howItHelps:
        'Facilitates peer code review, off-site disaster backups, automated CI/CD deployment pipelines, and global developer synchronization.',
    },
    nextTopicId: null,
    nextTopicTitle: '',
  },
};

// Route aliases for /topic/1, /topic/01, etc.
TOPIC_REGISTRY['1'] = TOPIC_REGISTRY['init'];
TOPIC_REGISTRY['01'] = TOPIC_REGISTRY['init'];
TOPIC_REGISTRY['2'] = TOPIC_REGISTRY['commit'];
TOPIC_REGISTRY['02'] = TOPIC_REGISTRY['commit'];
TOPIC_REGISTRY['3'] = TOPIC_REGISTRY['branching'];
TOPIC_REGISTRY['03'] = TOPIC_REGISTRY['branching'];
TOPIC_REGISTRY['4'] = TOPIC_REGISTRY['merging'];
TOPIC_REGISTRY['04'] = TOPIC_REGISTRY['merging'];
TOPIC_REGISTRY['5'] = TOPIC_REGISTRY['remote'];
TOPIC_REGISTRY['05'] = TOPIC_REGISTRY['remote'];

// Levenshtein distance for smart typo detection
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Smart Failsafe Error Handler
interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  capturedArg?: string;
}

function validateGitCommand(input: string, topic: TopicMeta): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'Empty command entered. Please enter a valid Git command.' };
  }

  const tokens = trimmed.split(/\s+/);
  const hintTokens = topic.hint.split(/\s+/);

  // Check 1: Root command must be 'git'
  if (tokens[0].toLowerCase() !== 'git') {
    const dist = getLevenshteinDistance(tokens[0].toLowerCase(), 'git');
    if (dist <= 2) {
      return {
        isValid: false,
        errorMessage: `Typo detected in command root: '${tokens[0]}' is misspelled. Did you mean 'git'?`,
      };
    }
    return {
      isValid: false,
      errorMessage: `Invalid binary '${tokens[0]}'. All Git commands must start with 'git'. Expected '${topic.hint}'.`,
    };
  }

  // Check 2: Subcommand check based on topic
  if (tokens.length < 2) {
    return {
      isValid: false,
      errorMessage: `Missing Git subcommand. Expected: '${topic.hint}'.`,
    };
  }

  const subCmd = tokens[1].toLowerCase();

  if (topic.id === 'init') {
    if (subCmd !== 'init') {
      const dist = getLevenshteinDistance(subCmd, 'init');
      if (dist <= 2) {
        return {
          isValid: false,
          errorMessage: `Typo detected in subcommand: '${tokens[1]}' is misspelled. Did you mean 'init'? Correct syntax: '${topic.hint}'`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Unrecognized action '${tokens[1]}' for this stage. This lesson covers repository initialization. Expected: '${topic.hint}'.`,
      };
    }

    // Parse git init <repo-name> (regex ^git init ([\w-]+)$)
    const initRegex = /^git\s+init(?:\s+([\w-]+))?$/i;
    const match = trimmed.match(initRegex);

    if (!match || !match[1]) {
      if (tokens.length <= 2) {
        return {
          isValid: false,
          errorMessage: `Missing repository name. Correct syntax: 'git init <repo-name>' (e.g., '${topic.hint}').`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Invalid repository name '${tokens[2]}'. Use letters, numbers, hyphens, or underscores (e.g., '${topic.hint}').`,
      };
    }

    const customRepoName = match[1];
    return { isValid: true, capturedArg: customRepoName };
  }

  if (topic.id === 'commit') {
    if (subCmd !== 'commit') {
      const dist = getLevenshteinDistance(subCmd, 'commit');
      if (dist <= 2) {
        return {
          isValid: false,
          errorMessage: `Typo detected in subcommand: '${tokens[1]}' is misspelled. Did you mean 'commit'? Correct syntax: '${topic.hint}'`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Unrecognized action '${tokens[1]}'. Stage 02 teaches commit snapshots. Expected: '${topic.hint}'.`,
      };
    }

    // Check for commit message flag
    const hasFlag = tokens.some((t) => t === '-m' || t === '-am' || t.startsWith('-m'));
    if (!hasFlag && tokens.length > 2) {
      return {
        isValid: false,
        errorMessage: `Missing commit flag: In Git, commit messages require the '-m' flag. Example: '${topic.hint}'`,
      };
    }

    return { isValid: true };
  }

  if (topic.id === 'branching') {
    const isCheckoutB = tokens[1] === 'checkout' && tokens[2] === '-b';
    const isSwitchC = tokens[1] === 'switch' && tokens[2] === '-c';
    const isBranch = tokens[1] === 'branch';

    if (!isCheckoutB && !isSwitchC && !isBranch) {
      if (tokens[1] === 'checkout' && tokens.length < 3) {
        return {
          isValid: false,
          errorMessage: `Incomplete checkout: To create a new branch, use 'git checkout -b <branch-name>' or 'git branch <name>'.`,
        };
      }
      const distBranch = getLevenshteinDistance(tokens[1], 'branch');
      if (distBranch <= 2) {
        return {
          isValid: false,
          errorMessage: `Typo detected: '${tokens[1]}' is misspelled. Did you mean 'branch'? Correct syntax: '${topic.hint}'`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Unrecognized branching syntax '${tokens.slice(1).join(' ')}'. Use 'git branch <name>' or 'git checkout -b <name>'. Expected: '${topic.hint}'.`,
      };
    }

    let branchName = 'feature/quantum-leap';
    if (isCheckoutB || isSwitchC) {
      branchName = tokens[3] || 'feature/quantum-leap';
    } else if (isBranch) {
      branchName = tokens[2] || 'feature/quantum-leap';
    }

    return { isValid: true, capturedArg: branchName };
  }

  if (topic.id === 'merging') {
    if (subCmd !== 'merge') {
      const dist = getLevenshteinDistance(subCmd, 'merge');
      if (dist <= 2) {
        return {
          isValid: false,
          errorMessage: `Typo detected in subcommand: '${tokens[1]}' is misspelled. Did you mean 'merge'? Correct syntax: '${topic.hint}'`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Unrecognized action '${tokens[1]}'. Stage 04 teaches merging branches. Expected: '${topic.hint}'.`,
      };
    }
    const targetBranch = tokens[2] || 'feature/quantum-leap';
    return { isValid: true, capturedArg: targetBranch };
  }

  if (topic.id === 'remote') {
    if (subCmd !== 'push') {
      const dist = getLevenshteinDistance(subCmd, 'push');
      if (dist <= 2) {
        return {
          isValid: false,
          errorMessage: `Typo detected in subcommand: '${tokens[1]}' is misspelled. Did you mean 'push'? Correct syntax: '${topic.hint}'`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Unrecognized action '${tokens[1]}'. Stage 05 teaches syncing remotes with 'git push'. Expected: '${topic.hint}'.`,
      };
    }
    return { isValid: true };
  }

  // Fallback pattern match
  if (topic.expectedPattern.test(trimmed)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    errorMessage: `Command syntax does not match lesson target. Expected: '${topic.hint}'.`,
  };
}

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const id = typeof params.id === 'string' ? params.id : 'init';
  const topic = TOPIC_REGISTRY[id] || TOPIC_REGISTRY['init'];

  // Global store states
  const {
    repoName,
    repo_name,
    setRepoName,
    currentBranch,
    setCurrentBranch,
    addCompletedCommand,
    completedCommands,
    addCompletedTopic,
    completedTopics,
  } = useGitStore();

  const activeRepo = repo_name || repoName || '';

  // Local UI states
  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ text: string; isError?: boolean; isSuccess?: boolean; isUser?: boolean }>
  >([]);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [isCommandLocked, setIsCommandLocked] = useState<boolean>(false);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);
  const [createdBranchName, setCreatedBranchName] = useState<string>('');
  const [isJustInitialized, setIsJustInitialized] = useState<boolean>(false);
  const [simulatedRepoName, setSimulatedRepoName] = useState<string>(activeRepo);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Cards for sequential reveal
  const bentoCards = [
    {
      step: 1,
      tag: '01. FOUNDATION',
      title: 'WHAT IT IS',
      content: topic.theory.whatItIs,
      accentBg: 'bg-[#D2E823] text-[#09090B]',
    },
    {
      step: 2,
      tag: '02. NECESSITY',
      title: 'WHY WE NEED IT',
      content: topic.theory.whyWeNeedIt,
      accentBg: 'bg-white text-[#09090B]',
    },
    {
      step: 3,
      tag: '03. MECHANICS',
      title: 'HOW IT WORKS',
      content: topic.theory.howItWorks,
      accentBg: 'bg-white text-[#09090B]',
    },
    {
      step: 4,
      tag: '04. ADVANTAGE',
      title: 'HOW IT HELPS',
      content: topic.theory.howItHelps,
      accentBg: 'bg-[#D2E823] text-[#09090B]',
    },
  ];

  // Initialize terminal on topic change
  useEffect(() => {
    setRevealedCount(1);
    setTerminalInput('');
    setErrorFeedback(null);
    setShowAnimation(false);
    setShowSuccessBadge(false);
    setIsCommandLocked(false);

    // Initial greeting
    setTerminalHistory([
      { text: `[GITWORLD FAULTLESS SHELL v2.4.0]` },
      { text: `STAGE ${topic.stageNum}: ${topic.title}` },
      { text: `PROTOCOL TARGET: Enter '${topic.hint}' to execute module.` },
      { text: `Status: Awaiting input...` },
    ]);

    // Check if topic is already completed
    const isCompleted = completedTopics.includes(topic.id);
    if (isCompleted) {
      setIsCommandLocked(true);
      setShowAnimation(true);
      setShowSuccessBadge(true);
    }
    setIsJustInitialized(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [topic.id, topic.stageNum, topic.title, topic.hint, completedTopics]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory, showAnimation, showSuccessBadge, errorFeedback]);

  // Command submission logic
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim();
    if (!cmd || isCommandLocked) return;

    // Log the typed command to history
    const newHistory = [...terminalHistory, { text: `>_ ${cmd}`, isUser: true }];
    setTerminalHistory(newHistory);

    // Run Smart Failsafe Validation
    const validation = validateGitCommand(cmd, topic);

    if (!validation.isValid) {
      // Command contains a syntax fault or typo
      const faultMsg = validation.errorMessage || `> SYNTAX FAULT: Unrecognized command. Try '${topic.hint}'.`;
      setErrorFeedback(faultMsg);

      setTerminalHistory((prev) => [
        ...prev,
        {
          text: faultMsg,
          isError: true,
        },
      ]);

      // Keep input active and re-focus for instant retry
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return;
    }

    // Command is valid! Clear error state and lock input (single execution)
    setErrorFeedback(null);
    setTerminalInput('');
    setIsCommandLocked(true);

    // State persistence logic
    let updatedRepo = repoName || repo_name || '';
    let updatedBranch = currentBranch;

    if (topic.id === 'init') {
      const customName = validation.capturedArg || '';
      setRepoName(customName);
      setSimulatedRepoName(customName);
      updatedRepo = customName;
      setIsJustInitialized(true);
    } else if (topic.id === 'branching') {
      const customBranch = validation.capturedArg || 'feature/quantum-leap';
      setCurrentBranch(customBranch);
      setCreatedBranchName(customBranch);
      updatedBranch = customBranch;
    }

    addCompletedCommand(cmd);
    addCompletedTopic(topic.id);

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
    }, 1100);

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

      const nextCompleted = currentCompleted.includes(topic.id)
        ? currentCompleted
        : [...currentCompleted, topic.id];
      const nextXp = currentCompleted.includes(topic.id)
        ? currentXp
        : currentXp + topic.xp;

      localStorage.setItem(
        'gitworld_progress',
        JSON.stringify({
          completed_topics: nextCompleted,
          xp: nextXp,
          repo_name: updatedRepo || '',
          current_branch_name: updatedBranch || 'main',
        })
      );

      const userId = authData?.user?.id || useGitStore.getState().userId;
      if (userId) {
        await supabase.from('user_progress').upsert(
          {
            id: userId,
            user_id: userId,
            completed_topics: nextCompleted,
            xp: nextXp,
            repo_name: updatedRepo || '',
            current_branch_name: updatedBranch || 'main',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      }
    } catch (err) {
      console.warn('Could not sync progress to Supabase:', err);
    }
  };

  return (
    <div className="min-h-screen text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative z-10 bg-transparent pb-24">
      <NoiseOverlay />
      <CustomCursor />

      {/* Sticky Header with Topic Name & Back to Journey Button */}
      <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="w-full h-16 sm:h-20 bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] px-4 sm:px-8 flex items-center justify-between shadow-[4px_4px_0px_0px_#09090B]">
          {/* Left: Back to Journey Button & Topic Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/journey"
              className="px-3 py-2 bg-white hover:bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer flex items-center gap-1.5 font-heading text-xs uppercase"
              title="Return to Curriculum Journey"
            >
              <ArrowLeft className="w-4 h-4 text-[#09090B]" />
              <span className="hidden sm:inline">BACK TO JOURNEY</span>
              <span className="sm:hidden">BACK</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-mono-brutal font-bold text-xs text-[#09090B]/40 hidden md:inline">//</span>
              <span className="font-heading text-base sm:text-xl text-[#09090B] tracking-tight">
                {topic.stageNum}. {topic.stageName}
              </span>
            </div>
          </div>

          {/* Right: Active Branch & XP */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-[#09090B] rounded-[8px] px-3 py-1.5 shadow-[2px_2px_0px_0px_#09090B]">
              <GitBranch className="w-3.5 h-3.5 text-[#09090B]" />
              <span className="font-mono-brutal text-xs font-bold text-[#09090B]">
                {currentBranch || 'main'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[8px] font-mono-brutal text-xs font-bold shadow-[2px_2px_0px_0px_#09090B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{topic.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - 12-Column Grid */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 sm:pt-12 relative z-10">
        {/* Topic Title Header */}
        <div className="mb-8 border-b-2 border-[#09090B] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-white text-[#09090B] border-2 border-[#09090B] rounded-full text-xs font-mono-brutal font-bold uppercase tracking-wider mb-2 shadow-[2px_2px_0px_0px_#09090B]">
              STAGE {topic.stageNum} // MISSION
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
              {topic.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono-brutal text-xs font-bold bg-white border-2 border-[#09090B] px-3 py-1.5 rounded-[8px] shadow-[2px_2px_0px_0px_#09090B]">
              REPO: ~/{simulatedRepoName || activeRepo || '[UNINITIALIZED]'}
            </span>
          </div>
        </div>

        {/* 12-Column Grid: Left Column (5 cols) & Right Column (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN (5 cols - Theory Bento with Sequential Reveal) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-4">
            {/* Pagination Control Bar */}
            <div className="bg-[#09090B] text-white border-2 border-[#09090B] rounded-[16px] p-4 shadow-[4px_4px_0px_0px_#09090B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none">
              <div>
                <span className="font-mono-brutal text-[10px] font-bold text-[#D2E823] uppercase tracking-wider block mb-0.5">
                  THEORY BENTO // CURRICULUM
                </span>
                <span className="font-heading text-sm text-white">
                  CARD {revealedCount} OF 4 REVEALED
                </span>
              </div>

              <div className="flex items-center gap-2">
                {revealedCount > 1 && (
                  <button
                    type="button"
                    onClick={() => setRevealedCount((prev) => Math.max(1, prev - 1))}
                    className="px-2.5 py-1 bg-white hover:bg-[#F8F4E8] text-[#09090B] font-heading text-xs uppercase rounded-[6px] border border-[#09090B] shadow-[1px_1px_0px_0px_#D2E823] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>PREV</span>
                  </button>
                )}

                {revealedCount < 4 ? (
                  <button
                    type="button"
                    onClick={() => setRevealedCount((prev) => Math.min(4, prev + 1))}
                    className="px-3 py-1 bg-[#D2E823] hover:bg-white text-[#09090B] font-heading text-xs uppercase tracking-tight rounded-[6px] border border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className="px-2.5 py-1 bg-[#D2E823] text-[#09090B] font-mono-brutal text-[10px] font-bold uppercase rounded border border-[#09090B]">
                    ALL 4 REVEALED ✓
                  </span>
                )}
              </div>
            </div>

            {/* 4 Brutalist Bento Cards Stacked */}
            <div className="space-y-3">
              {bentoCards.map((card) => {
                const isRevealed = card.step <= revealedCount;
                return (
                  <motion.div
                    key={card.step}
                    initial={false}
                    animate={{
                      opacity: isRevealed ? 1 : 0.45,
                      scale: isRevealed ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.25 }}
                    className={`border-2 border-[#09090B] rounded-[16px] p-5 transition-all select-none ${
                      isRevealed
                        ? 'bg-white shadow-[4px_4px_0px_0px_#09090B]'
                        : 'bg-[#F8F4E8]/60 border-dashed border-[#09090B]/40 shadow-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`font-mono-brutal text-[10px] font-bold px-2 py-0.5 rounded border border-[#09090B] shadow-[1px_1px_0px_0px_#09090B] ${
                          isRevealed ? card.accentBg : 'bg-zinc-200 text-zinc-500'
                        }`}
                      >
                        {card.tag}
                      </span>
                      <span className="font-mono-brutal text-[10px] font-bold text-[#09090B]/50">
                        {isRevealed ? 'REVEALED' : 'LOCKED'}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg text-[#09090B] tracking-tight mb-2">
                      {card.title}
                    </h3>

                    {isRevealed ? (
                      <p className="text-xs sm:text-sm text-[#09090B]/85 font-medium leading-relaxed">
                        {card.content}
                      </p>
                    ) : (
                      <div className="py-1 flex items-center justify-between text-xs font-mono-brutal text-[#09090B]/60">
                        <span>[Card hidden]</span>
                        <button
                          type="button"
                          onClick={() => setRevealedCount(card.step)}
                          className="text-[#09090B] font-bold underline hover:text-black cursor-pointer text-[11px]"
                        >
                          Reveal Card {card.step} &rarr;
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Protocol Target Command Card */}
            <div className="p-4 bg-[#D2E823] border-2 border-[#09090B] rounded-[16px] shadow-[4px_4px_0px_0px_#09090B]">
              <div className="flex items-center gap-2 mb-2">
                <TerminalIcon className="w-4 h-4 text-[#09090B]" />
                <span className="font-mono-brutal text-[11px] font-bold uppercase text-[#09090B]">
                  TARGET PROTOCOL COMMAND
                </span>
              </div>
              <code className="font-mono-brutal text-xs font-bold text-[#09090B] bg-white px-3 py-2 border-2 border-[#09090B] rounded-[8px] block shadow-[2px_2px_0px_0px_#09090B] select-all">
                {topic.hint}
              </code>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (7 cols - Failsafe Terminal & Visual Timeline)*/}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Black Terminal Box (#09090B) with #D2E823 Border & Hard Shadow */}
            <div className="bg-[#09090B] border-2 border-[#D2E823] rounded-[16px] shadow-[8px_8px_0px_0px_#09090B] overflow-hidden">
              {/* Terminal Titlebar */}
              <div className="bg-[#18181B] px-4 py-3 border-b-2 border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#09090B]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#09090B]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#09090B]" />
                  <span className="font-mono-brutal text-xs text-[#A1A1AA] ml-2 font-bold">
                    bash // gitworld-failsafe-emulator
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-brutal text-[11px] text-[#D2E823] bg-[#09090B] px-2 py-0.5 rounded border border-[#27272A]">
                    {currentBranch || 'main'}
                  </span>
                </div>
              </div>

              {/* Terminal Body with Scrollable Log */}
              <div className="p-4 sm:p-6 font-mono-brutal text-xs sm:text-sm text-[#F4F4F5] space-y-3 min-h-[300px] max-h-[420px] overflow-y-auto">
                {terminalHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      item.isError
                        ? 'text-[#FF5555] font-bold'
                        : item.isSuccess
                        ? 'text-[#D2E823] font-bold'
                        : item.isUser
                        ? 'text-[#F4F4F5] font-bold'
                        : 'text-[#A1A1AA]'
                    }`}
                  >
                    {item.text}
                  </div>
                ))}

                {/* Smart Failsafe Red #FF3333 Error Card */}
                {errorFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="p-4 bg-[#FF3333] text-[#09090B] border-2 border-[#09090B] rounded-[8px] shadow-[4px_4px_0px_0px_#09090B] font-mono-brutal text-xs font-bold select-none"
                  >
                    <div className="flex items-center gap-2 mb-1.5 text-[#09090B]">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="uppercase tracking-wider font-heading text-xs">
                        COMMAND SYNTAX FAULT DETECTED
                      </span>
                    </div>
                    <p className="leading-relaxed">{errorFeedback}</p>
                  </motion.div>
                )}

                {/* Animated Graph Box on Success */}
                {showAnimation && topic.id !== 'branching' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-[#18181B] border-2 border-[#D2E823] rounded-[12px] text-[#D2E823] font-mono-brutal text-xs space-y-1 shadow-[4px_4px_0px_0px_#D2E823]"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      <span className="font-bold uppercase">CRYPTOGRAPHIC DAG GENERATED</span>
                    </div>
                    <div className="text-[11px] text-[#A1A1AA]">
                      &gt; Object: commit e89f41b2c7... (tree 9a01fd...)
                    </div>
                    <div className="text-[11px] text-[#A1A1AA]">
                      &gt; Ref updated: refs/heads/{currentBranch || 'main'}
                    </div>
                  </motion.div>
                )}

                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Command Input Form (>_ prompt) */}
              <form
                onSubmit={handleCommandSubmit}
                className="p-3 sm:p-4 bg-[#18181B] border-t-2 border-[#27272A] flex items-center gap-3"
              >
                <span className="text-[#D2E823] font-mono-brutal font-bold text-sm sm:text-base select-none">
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
                      ? '[LOCKED] Command executed successfully. Visual timeline updated below.'
                      : `Type '${topic.hint}'`
                  }
                  className="flex-1 bg-transparent text-[#F4F4F5] font-mono-brutal text-xs sm:text-sm outline-none placeholder:text-[#52525B] disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isCommandLocked || !terminalInput.trim()}
                  className="px-4 py-2 bg-[#D2E823] hover:bg-[#b8cc1c] text-[#09090B] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>EXECUTE</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* ========================================================= */}
            {/* VISUAL TIMELINE: Below Terminal (4px Vertical Red Line)   */}
            {/* ========================================================= */}
            <div>
              {topic.id === 'init' ? (
                <InitVisualizer
                  repoName={simulatedRepoName || activeRepo}
                  isJustInitialized={isJustInitialized}
                  mainBranchName={currentBranch || 'main'}
                  stageName={topic.stageName}
                />
              ) : (
                <BranchingVisualizer
                  isBranchCreated={showAnimation || isCommandLocked}
                  currentBranch={createdBranchName || currentBranch || 'feature/quantum-leap'}
                  mainBranchName="main"
                  stageName={topic.stageName}
                  repoName={simulatedRepoName || activeRepo}
                  isJustInitialized={isJustInitialized}
                />
              )}
            </div>

            {/* QUEST COMPLETE Badge & Next/Back Buttons */}
            <AnimatePresence>
              {showSuccessBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="p-6 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[16px] shadow-[6px_6px_0px_0px_#09090B] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[12px] bg-[#09090B] text-[#D2E823] flex items-center justify-center font-heading text-xl border-2 border-[#09090B] flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="inline-block px-2 py-0.5 bg-white border border-[#09090B] rounded text-[10px] font-mono-brutal font-bold uppercase tracking-wider mb-1 shadow-[1px_1px_0px_0px_#09090B]">
                        QUEST COMPLETE
                      </div>
                      <h4 className="font-heading text-xl text-[#09090B] tracking-tight leading-none">
                        STAGE QUEST VALIDATED!
                      </h4>
                      <p className="font-mono-brutal text-xs font-bold text-[#09090B]/80 mt-1">
                        Earned +{topic.xp} XP. State saved to local & cloud ledger.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/journey"
                      className="py-2.5 px-4 bg-white hover:bg-[#F8F4E8] text-[#09090B] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer text-center"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>BACK TO JOURNEY</span>
                    </Link>

                    {topic.nextTopicId ? (
                      <Link
                        href={`/topic/${topic.nextTopicId}`}
                        className="py-2.5 px-4 bg-[#09090B] hover:bg-white hover:text-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer text-center"
                      >
                        <span>NEXT LESSON: {topic.nextTopicTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href="/journey"
                        className="py-2.5 px-4 bg-[#09090B] hover:bg-white hover:text-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer text-center"
                      >
                        <span>JOURNEY COMPLETED!</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
