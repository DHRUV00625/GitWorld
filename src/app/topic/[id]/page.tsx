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
        'Without repository initialization, directory files are unversioned snapshots. Git cannot track changes, compute cryptographic diffs, or isolate timeline commits.',
      howItWorks:
        'Git allocates a local database inside `.git/` with subdirectories `objects/`, `refs/`, `HEAD`, and `config`. It sets the initial default branch to `main`.',
      theSolution:
        'Initialize the workspace by executing `git init <repo-name>` to create your versioned project universe.',
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
    expectedPattern: /^git\s+commit(?:\s+.*)?$/,
    hint: 'git commit -m "feat: initial commit"',
    theory: {
      whatItIs:
        'A commit is an immutable cryptographic snapshot of staged changes. It captures the exact state of files, authorship metadata, timestamp, and a parent commit hash pointer.',
      whyWeNeedIt:
        'Commits generate a verifiable audit trail. Unlike saving over files in place, every commit forms a permanent checkpoint in a Directed Acyclic Graph (DAG) that can be inspected forever.',
      howItWorks:
        'Git takes tree snapshots from the Staging Index (Index file), serializes blobs, computes the SHA-1 tree object, and writes a commit object pointing to its parent SHA.',
      theSolution:
        'Stage files via `git add .` and seal them into the history ledger with `git commit -m "message"`.',
    },
    nextTopicId: 'branching',
    nextTopicTitle: '03. BRANCHING',
  },
  branching: {
    id: 'branching',
    stageNum: 'STAGE 03',
    stageName: 'BRANCHING',
    title: 'PARALLEL UNIVERSES',
    xp: 200,
    expectedPattern: /^git\s+(?:checkout\s+-b|switch\s+-c|branch)(?:\s+([a-zA-Z0-9_\-\.\/]+))?$/,
    hint: 'git checkout -b feature/quantum-leap',
    theory: {
      whatItIs:
        'A Git branch is a lightweight movable pointer to a specific commit. Spawning a new branch diverges your commit trajectory without altering existing stable code.',
      whyWeNeedIt:
        'Branching empowers isolated feature development, experimental prototyping, and bug repairs without polluting or endangering the primary production line (`main`).',
      howItWorks:
        'Git creates a 41-byte text reference inside `.git/refs/heads/<branch>` containing the latest commit hash, then updates `.git/HEAD` to point to the new ref.',
      theSolution:
        'Create and switch onto an isolated track using `git checkout -b feature/<name>` or `git switch -c feature/<name>`.',
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

// Levenshtein Distance for typo identification
function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  capturedArg?: string;
}

// Smart Failsafe Validation Function
function validateGitCommand(input: string, topic: TopicMeta): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: '> SYNTAX FAULT: Empty command received. Type a valid Git expression.',
    };
  }

  // 1. Direct Regex Match check
  const match = trimmed.match(topic.expectedPattern);
  if (match) {
    return {
      isValid: true,
      capturedArg: match[1] || undefined,
    };
  }

  // 2. Tokenize by whitespace for word-by-word comparison
  const tokens = trimmed.split(/\s+/).filter(Boolean);

  // Check first token (must be 'git')
  const firstWord = tokens[0].toLowerCase();
  if (firstWord !== 'git') {
    if (levenshteinDistance(firstWord, 'git') <= 2) {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: You typed '${tokens[0]}'. Did you mean 'git'? Try again.`,
      };
    }
    return {
      isValid: false,
      errorMessage: `> SYNTAX FAULT: All Git commands must start with 'git'. You typed '${tokens[0]}'. Did you mean 'git ${topic.hint.replace(/^git\s*/, '')}'?`,
    };
  }

  // Only typed 'git'
  if (tokens.length === 1) {
    return {
      isValid: false,
      errorMessage: `> SYNTAX FAULT: Missing sub-command after 'git'. Try typing '${topic.hint}'.`,
    };
  }

  const secondWord = tokens[1].toLowerCase();

  // 3. Stage-specific syntactic analysis
  if (topic.id === 'branching') {
    const validBranchingWords = ['branch', 'checkout', 'switch'];

    // Word-by-word typo check on branching sub-command
    for (const validWord of validBranchingWords) {
      const dist = levenshteinDistance(secondWord, validWord);
      if (dist > 0 && dist <= 2) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: You typed 'git ${tokens[1]}'. Did you mean 'git ${validWord}'? Try again.`,
        };
      }
    }

    // Check if user typed other valid git sub-commands that don't apply to branching
    if (['init', 'commit', 'merge', 'push', 'pull', 'status', 'add'].includes(secondWord)) {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: Sub-command '${tokens[1]}' belongs to another stage. For branching, use 'git checkout -b <branch>' or 'git branch <branch>'.`,
      };
    }

    // Checkout flags check
    if (secondWord === 'checkout') {
      if (tokens.length === 2) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing '-b' flag and branch name. To create and switch to a new branch, use 'git checkout -b <branch-name>'.`,
        };
      }
      if (tokens[2] !== '-b') {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing '-b' flag. You typed 'git checkout ${tokens[2]}'. To create and switch to a new branch simultaneously, use 'git checkout -b ${tokens[2]}'.`,
        };
      }
      if (tokens.length === 3) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing branch name operand after '-b'. Specify a branch, e.g., 'git checkout -b feature/quantum-leap'.`,
        };
      }
    }

    // Switch flags check
    if (secondWord === 'switch') {
      if (tokens.length === 2) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing '-c' flag and branch name. To create and switch to a new branch, use 'git switch -c <branch-name>'.`,
        };
      }
      if (tokens[2] !== '-c') {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing '-c' flag. You typed 'git switch ${tokens[2]}'. Use 'git switch -c ${tokens[2]}'.`,
        };
      }
      if (tokens.length === 3) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing branch name operand after '-c'. Specify a branch, e.g., 'git switch -c feature/quantum-leap'.`,
        };
      }
    }

    // Branch flags/args check
    if (secondWord === 'branch') {
      if (tokens.length === 2) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: Missing branch name operand. Specify a branch name, e.g., 'git branch feature/quantum-leap'.`,
        };
      }
    }
  } else if (topic.id === 'init') {
    const dist = levenshteinDistance(secondWord, 'init');
    if (dist > 0 && dist <= 2) {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: You typed 'git ${tokens[1]}'. Did you mean 'git init'? Try again.`,
      };
    }
    if (secondWord !== 'init') {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: Expected 'git init [repo-name]'. You typed 'git ${tokens[1]}'. Did you mean '${topic.hint}'?`,
      };
    }
  } else if (topic.id === 'commit') {
    const dist = levenshteinDistance(secondWord, 'commit');
    if (dist > 0 && dist <= 2) {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: You typed 'git ${tokens[1]}'. Did you mean 'git commit'? Try again.`,
      };
    }
    if (secondWord !== 'commit') {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: Expected 'git commit -m "..."'. You typed 'git ${tokens[1]}'. Try '${topic.hint}'.`,
      };
    }
  } else if (topic.id === 'merging') {
    const dist = levenshteinDistance(secondWord, 'merge');
    if (dist > 0 && dist <= 2) {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: You typed 'git ${tokens[1]}'. Did you mean 'git merge'? Try again.`,
      };
    }
    if (secondWord === 'merge' && tokens.length === 2) {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: Missing branch operand to merge. Specify a branch name, e.g., 'git merge feature/quantum-leap'.`,
      };
    }
  } else if (topic.id === 'conflicts') {
    if (secondWord !== 'commit' && secondWord !== 'add' && secondWord !== 'merge') {
      return {
        isValid: false,
        errorMessage: `> SYNTAX FAULT: For conflict resolution, stage changes or commit. Try: '${topic.hint}'.`,
      };
    }
  }

  // 4. Word-by-word token comparison against topic hint
  const expectedTokens = topic.hint.split(/\s+/);
  for (let i = 0; i < Math.max(tokens.length, expectedTokens.length); i++) {
    const userToken = tokens[i];
    const expToken = expectedTokens[i];
    if (userToken && expToken && userToken.toLowerCase() !== expToken.toLowerCase()) {
      const dist = levenshteinDistance(userToken, expToken);
      if (dist <= 2) {
        return {
          isValid: false,
          errorMessage: `> SYNTAX FAULT: You typed '${userToken}'. Did you mean '${expToken}'? Try again.`,
        };
      }
    }
  }

  return {
    isValid: false,
    errorMessage: `> SYNTAX FAULT: Unrecognized syntax '${trimmed}'. Did you mean '${topic.hint}'? Try again.`,
  };
}

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
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
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
    setErrorFeedback(null);

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

    // Command is valid! Clear error state and lock input
    setErrorFeedback(null);
    setTerminalInput('');
    setIsCommandLocked(true); // Input can only be executed once

    // State persistence logic
    let updatedRepo = repoName;
    if (topic.id === 'init') {
      const customName = validation.capturedArg || 'gitworld-project';
      setRepoName(customName);
      setSimulatedRepoName(customName);
      updatedRepo = customName;
    } else if (topic.id === 'branching') {
      const customBranch = validation.capturedArg || 'feature/quantum-leap';
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

        useGitStore.getState().addCompletedTopic(topic.id);

        if (authData?.user) {
          await supabase.from('user_progress').upsert(
            {
              id: authData.user.id,
              user_id: authData.user.id,
              completed_topics: nextCompleted,
              xp: nextXp,
              repo_name: updatedRepo || useGitStore.getState().repoName || '',
              current_branch_name: useGitStore.getState().currentBranch || 'main',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );
        }
      }
    } catch (err) {
      console.warn('Could not sync progress to Supabase:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative pb-20">
      <NoiseOverlay />
      <CustomCursor />

      {/* Sticky Header */}
      <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="w-full h-16 sm:h-20 bg-[#F8F4E8]/90 backdrop-blur-[24px] border-2 border-[#09090B] rounded-[12px] px-4 sm:px-8 flex items-center justify-between shadow-[4px_4px_0px_0px_#09090B]">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/journey"
              className="p-2 sm:p-2.5 bg-white hover:bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer flex items-center justify-center"
              title="Return to Journey Curriculum"
            >
              <ArrowLeft className="w-4 h-4 text-[#09090B]" />
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/journey" className="font-heading text-lg sm:text-2xl text-[#09090B] tracking-tighter hover:opacity-80 transition-opacity">
                GITWORLD
              </Link>
              <span className="font-mono-brutal font-bold text-xs text-[#09090B]/40 hidden sm:inline">//</span>
              <span className="font-mono-brutal font-bold text-xs uppercase text-[#09090B] bg-[#D2E823] px-2 py-0.5 border border-[#09090B] rounded shadow-[2px_2px_0px_0px_#09090B] hidden sm:inline-block">
                {topic.stageNum}: {topic.stageName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white border-2 border-[#09090B] rounded-[8px] px-3 py-1.5 shadow-[2px_2px_0px_0px_#09090B]">
              <GitBranch className="w-3.5 h-3.5 text-[#09090B]" />
              <span className="font-mono-brutal text-xs font-bold text-[#09090B]">
                {currentBranch}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[8px] font-mono-brutal text-xs font-bold shadow-[2px_2px_0px_0px_#09090B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{topic.xp} XP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-8 sm:pt-12 relative z-10">
        {/* Topic Title Header */}
        <div className="mb-8 border-b-2 border-[#09090B] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-block px-3 py-1 bg-white text-[#09090B] border-2 border-[#09090B] rounded-full text-xs font-mono-brutal font-bold uppercase tracking-wider mb-2 shadow-[2px_2px_0px_0px_#09090B]">
              {topic.stageNum} // MISSION
            </div>
            <h1 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
              {topic.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono-brutal text-xs font-bold bg-[#F8F4E8] border border-[#09090B] px-3 py-1.5 rounded-[8px]">
              REPO: ~/{simulatedRepoName}
            </span>
          </div>
        </div>

        {/* 2-Column Split: Theory (Left) & Sandbox Terminal (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Deep Git Theory (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border-2 border-[#09090B] rounded-[20px] p-6 shadow-[6px_6px_0px_0px_#09090B] space-y-5">
              <div className="flex items-center gap-2 border-b-2 border-[#09090B] pb-3">
                <FileCode className="w-5 h-5 text-[#09090B]" />
                <h3 className="font-heading text-lg text-[#09090B] tracking-tight">
                  THEORY // CORE CONCEPTS
                </h3>
              </div>

              {/* 1. What it is */}
              <div>
                <h4 className="font-mono-brutal text-xs font-bold uppercase text-[#09090B] bg-[#D2E823] px-2 py-0.5 border border-[#09090B] rounded inline-block mb-1.5 shadow-[1px_1px_0px_0px_#09090B]">
                  01. WHAT IT IS
                </h4>
                <p className="text-xs sm:text-sm text-[#09090B]/85 font-medium leading-relaxed">
                  {topic.theory.whatItIs}
                </p>
              </div>

              {/* 2. Why we need it */}
              <div>
                <h4 className="font-mono-brutal text-xs font-bold uppercase text-[#09090B] bg-white px-2 py-0.5 border border-[#09090B] rounded inline-block mb-1.5 shadow-[1px_1px_0px_0px_#09090B]">
                  02. WHY WE NEED IT
                </h4>
                <p className="text-xs sm:text-sm text-[#09090B]/85 font-medium leading-relaxed">
                  {topic.theory.whyWeNeedIt}
                </p>
              </div>

              {/* 3. How it works */}
              <div>
                <h4 className="font-mono-brutal text-xs font-bold uppercase text-[#09090B] bg-white px-2 py-0.5 border border-[#09090B] rounded inline-block mb-1.5 shadow-[1px_1px_0px_0px_#09090B]">
                  03. HOW IT WORKS
                </h4>
                <p className="text-xs sm:text-sm text-[#09090B]/85 font-medium leading-relaxed">
                  {topic.theory.howItWorks}
                </p>
              </div>

              {/* 4. The solution */}
              <div className="p-3 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] shadow-[2px_2px_0px_0px_#09090B]">
                <h4 className="font-mono-brutal text-[11px] font-bold uppercase text-[#09090B] mb-1">
                  &gt; THE PROTOCOL COMMAND:
                </h4>
                <code className="font-mono-brutal text-xs font-bold text-[#09090B] bg-white px-2 py-1 border border-[#09090B] rounded block">
                  {topic.hint}
                </code>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Sandbox & Terminal Emulator (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Terminal Window */}
            <div className="bg-[#09090B] border-2 border-[#09090B] rounded-[20px] shadow-[8px_8px_0px_0px_#09090B] overflow-hidden">
              {/* Terminal Titlebar */}
              <div className="bg-[#18181B] px-4 py-3 border-b-2 border-[#27272A] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#09090B]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#09090B]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#09090B]" />
                  <span className="font-mono-brutal text-xs text-[#A1A1AA] ml-2 font-bold">
                    bash // gitworld-v2.0
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-brutal text-[11px] text-[#D2E823] bg-[#09090B] px-2 py-0.5 rounded border border-[#27272A]">
                    {currentBranch}
                  </span>
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-4 sm:p-6 font-mono-brutal text-xs sm:text-sm text-[#F4F4F5] space-y-3 min-h-[340px] max-h-[460px] overflow-y-auto">
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

                {/* Smart Failsafe Brutalist Error Block */}
                {errorFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="p-3 bg-[#FF3333] text-[#09090B] border-2 border-[#09090B] rounded-[8px] shadow-[4px_4px_0px_0px_#09090B] font-mono-brutal text-xs font-bold select-none"
                  >
                    <div className="flex items-center gap-2 mb-1 text-[#09090B]">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="uppercase tracking-wider">COMMAND FAULT DETECTED</span>
                    </div>
                    <p className="leading-snug">{errorFeedback}</p>
                  </motion.div>
                )}

                {/* Dynamic SVG Branching Animation (Topic 03 Branching Specific) */}
                {topic.id === 'branching' && showAnimation && (
                  <div className="py-4">
                    <BranchingVisualizer
                      mainBranch="main"
                      featureBranch={currentBranch !== 'main' ? currentBranch : 'feature/quantum-leap'}
                      isDiverged={true}
                    />
                  </div>
                )}

                {/* Animated Graph / Box for other topics */}
                {topic.id !== 'branching' && showAnimation && (
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
                      &gt; Ref updated: refs/heads/{currentBranch}
                    </div>
                  </motion.div>
                )}

                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Command Input Form */}
              <form
                onSubmit={handleCommandSubmit}
                className="p-3 sm:p-4 bg-[#18181B] border-t-2 border-[#27272A] flex items-center gap-3"
              >
                <span className="text-[#D2E823] font-mono-brutal font-bold text-sm sm:text-base select-none">
                  $&gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  disabled={isCommandLocked}
                  placeholder={
                    isCommandLocked
                      ? 'Quest validated! See next stage below.'
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

            {/* Success Quest Banner sticker */}
            <AnimatePresence>
              {showSuccessBadge && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="p-6 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[16px] shadow-[6px_6px_0px_0px_#09090B] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[12px] bg-[#09090B] text-[#D2E823] flex items-center justify-center font-heading text-xl border border-[#09090B] flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <h4 className="font-heading text-xl text-[#09090B] tracking-tight leading-none mb-1">
                        STAGE QUEST COMPLETED!
                      </h4>
                      <p className="font-mono-brutal text-xs font-bold text-[#09090B]/80">
                        Earned +{topic.xp} XP. State saved to local & cloud ledger.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {topic.nextTopicId ? (
                      <Link
                        href={`/topic/${topic.nextTopicId}`}
                        className="py-2.5 px-4 bg-[#09090B] hover:bg-white hover:text-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer text-center"
                      >
                        <span>NEXT: {topic.nextTopicTitle}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        href="/journey"
                        className="py-2.5 px-4 bg-[#09090B] hover:bg-white hover:text-[#09090B] text-[#D2E823] font-heading text-xs uppercase tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center gap-2 cursor-pointer text-center"
                      >
                        <span>BACK TO JOURNEY TREE</span>
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
