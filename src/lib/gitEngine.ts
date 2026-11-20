export interface TheoryBento {
  whatItIs: string;
  whyWeNeedIt: string;
  howItWorks: string;
  howItHelps: string;
}

export interface TopicMeta {
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

export const TOPIC_REGISTRY: Record<string, TopicMeta> = {
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
    expectedPattern: /^git\s+commit\s+-m\s+["'](.+?)["']$/i,
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

/**
 * Calculates Levenshtein distance between two strings for intelligent typo detection.
 */
export function getLevenshteinDistance(a: string, b: string): number {
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

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  capturedArg?: string;
}

/**
 * Validates a simulated Git CLI command against the current topic stage,
 * providing pinpoint educational error feedback, typo correction suggestions,
 * and capturing arguments for DAG state transitions.
 */
export function validateGitCommand(input: string, topic: TopicMeta): ValidationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'Empty command entered. Please enter a valid Git command.' };
  }

  const tokens = trimmed.split(/\s+/);

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

    // Parse git init <repo-name>
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

    if (tokens.length <= 2) {
      return {
        isValid: false,
        errorMessage: `Missing commit flag and message. Correct syntax: git commit -m "your message" (e.g., '${topic.hint}').`,
      };
    }

    const hasMFlag = tokens.some((t) => t === '-m' || t.startsWith('-m'));
    if (!hasMFlag) {
      return {
        isValid: false,
        errorMessage: `Missing '-m' flag. In Git, specify your snapshot note with -m: git commit -m "your message".`,
      };
    }

    const match = trimmed.match(/^git\s+commit\s+-m\s+"([^"]+)"$/) || trimmed.match(/^git\s+commit\s+-m\s+'([^']+)'$/);

    if (!match) {
      const afterM = trimmed.split(/\s+-m\s*/i)[1] || '';
      if (!afterM) {
        return {
          isValid: false,
          errorMessage: `Missing commit message after '-m'. Please provide a message in quotes, e.g. '${topic.hint}'.`,
        };
      }
      if (afterM === '""' || afterM === "''") {
        return {
          isValid: false,
          errorMessage: `Empty commit message. Git requires a non-empty snapshot description: '${topic.hint}'.`,
        };
      }
      const startsWithQuote = afterM.startsWith('"') || afterM.startsWith("'");
      const endsWithQuote = afterM.endsWith('"') || afterM.endsWith("'");
      if ((startsWithQuote && !endsWithQuote) || (!startsWithQuote && endsWithQuote)) {
        return {
          isValid: false,
          errorMessage: `Unclosed quotation marks detected in commit message. Enclose your message in matching quotes, e.g. '${topic.hint}'.`,
        };
      }
      if (!startsWithQuote && !endsWithQuote) {
        return {
          isValid: false,
          errorMessage: `Missing quotation marks around commit message. In Git, wrap your message in quotes: git commit -m "your message".`,
        };
      }
      return {
        isValid: false,
        errorMessage: `Invalid commit syntax. Expected format: '${topic.hint}'.`,
      };
    }

    const extractedMessage = match[1].trim();
    if (!extractedMessage) {
      return {
        isValid: false,
        errorMessage: `Commit message cannot be blank. Example: '${topic.hint}'.`,
      };
    }

    return { isValid: true, capturedArg: extractedMessage };
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
    const targetBranch = tokens[2];
    if (!targetBranch) {
      return {
        isValid: false,
        errorMessage: `Incomplete merge syntax: No branch specified. Use 'git merge <branch-name>'. Expected: '${topic.hint}'.`,
      };
    }
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

    if (tokens.length < 3 || tokens[2].toLowerCase() !== 'origin') {
      return {
        isValid: false,
        errorMessage: `Missing or invalid remote specification. Expected: 'git push origin <branch>' (e.g. '${topic.hint}').`,
      };
    }

    if (tokens.length < 4 || !tokens[3]) {
      return {
        isValid: false,
        errorMessage: `Missing branch to push. Expected: 'git push origin <branch>' (e.g. '${topic.hint}').`,
      };
    }

    return { isValid: true, capturedArg: tokens[3] };
  }

  // Fallback pattern match
  if (topic.expectedPattern.test(trimmed)) {
    return { isValid: true, capturedArg: tokens.slice(2).join(' ') || undefined };
  }

  return {
    isValid: false,
    errorMessage: `Command '${trimmed}' is invalid for this stage. Expected syntax: '${topic.hint}'.`,
  };
}
