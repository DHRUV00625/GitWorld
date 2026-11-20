# ⚡ GitWorld

> **The Neo-Brutalist Interactive Git Learning Universe**  
> Master Git primitives visually and fearlessly through hands-on failsafe terminal sandboxes, real-time orthogonal DAG branch visualizers, structured theory bentos, and cloud-persisted skill progression.

[![Live Application](https://img.shields.io/badge/Live_App-git--world--is--born.vercel.app-D2E823?style=for-the-badge&logo=vercel&logoColor=09090B)](https://git-world-is-born.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Tests-24%2F24_Passing-22c55e?style=for-the-badge&logo=node.js&logoColor=ffffff)](https://github.com/DHRUV00625/GitWorld)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)

---

## 📌 Submission Overview

| Parameter | Details |
| :--- | :--- |
| **Project Name** | **GitWorld** |
| **Chosen Vertical** | **Developer Tooling & Education (EdTech / Developer Experience)** |
| **Live App URL** | [https://git-world-is-born.vercel.app](https://git-world-is-born.vercel.app) |
| **Repository URL** | [https://github.com/DHRUV00625/GitWorld](https://github.com/DHRUV00625/GitWorld) |
| **Repository Branch** | `main` (Single branch architecture strictly adhered to) |
| **Repository Size** | `< 1 MB` (Well within the 10 MB hackathon threshold) |

---

## 🎯 Chosen Vertical & Problem Statement Alignment

### Vertical
**Developer Tooling, EdTech & Developer Experience (DevEx)**

### Problem Statement
Version control is the cornerstone of modern software development, yet Git remains one of the steepest hurdles for aspiring engineers, students, and early-career developers. Standard Git learning tools suffer from critical drawbacks:
1. **The "Black Box" Panic**: Beginners execute commands in a blank terminal without visual feedback, dreading accidental data loss (`"Did I just delete my project?"`).
2. **Textbook Disconnect**: Traditional documentation presents dry, abstract ASCII diagrams that fail to build an intuitive mental model of Git's Directed Acyclic Graph (DAG).
3. **Cryptic Error Feedback**: Standard shells give unhelpful errors on minor typos without context-aware suggestions, demoralizing learners.

### The GitWorld Solution
GitWorld bridges the gap between CLI commands and internal Git data structures. By combining an **isolated client-side failsafe terminal emulator**, **real-time 90° orthogonal SVG DAG visualizers**, **Levenshtein-driven typo correction heuristics**, and **structured theory bentos**, GitWorld replaces fear with tangible, visual mastery.

---

## 🧠 Approach and Logic

### 1. Mental Model First (Orthogonal DAG Visualization)
Git is fundamentally a Directed Acyclic Graph (DAG) of commit snapshots and movable branch pointers. GitWorld renders this structure with strict **90° orthogonal vector lines**, ensuring zero visual clutter. Every commit snapshot, branch fork, and merge convergence animates deterministically in direct response to the learner's command.

### 2. Failsafe Emulation Sandbox
Rather than exposing novices to raw operating system shells where mistakes are destructive, GitWorld uses an in-memory client-side emulation engine. Commands are evaluated against strict regex and tokenized grammar rules, allowing users to experiment with zero risk to their local filesystem.

### 3. Levenshtein Typo Heuristics
When a user mistypes a command (e.g., `got init`, `git comit`, `git branc`), GitWorld computes the edit distance using the Levenshtein algorithm. Instead of generic `"command not found"` rejections, the engine provides actionable, encouraging advice:
> *`Typo detected: 'got' is misspelled. Did you mean 'git'? Correct syntax: 'git init <repo-name>'`*

### 4. Dual-State Synchronization (Local + Cloud Ledger)
User progression is managed via Zustand with `localStorage` fallback for frictionless offline/guest exploration, paired with Supabase Cloud Ledger (PostgreSQL + RLS) to securely record stage XP, custom repository names, and branch histories across devices.

---

## ⚙️ How the Solution Works

```
┌──────────────────────────────────────────────────────────────┐
│                      GitWorld Architecture                   │
└──────────────────────────────────────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│   Interactive Quest Journey  │       │  Stage Lesson Environment    │
│  (/journey)                  │       │  (/topic/[id])               │
│  - Zigzag visual curriculum  │       │  - Structured Theory Bento   │
│  - Stage unlock prerequisites│       │  - Failsafe Terminal Emulator│
│  - XP & badge tracking       │       │  - Dynamic Orthogonal SVG DAG│
└──────────────────────────────┘       └──────────────┬───────────────┘
                                                      │
                       ┌──────────────────────────────┼──────────────────────────────┐
                       ▼                              ▼                              ▼
        ┌──────────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
        │  Terminal Command Parser     │ │ Orthogonal SVG Engine    │ │ State Synchronization    │
        │  - Tokenizer & AST validator │ │ - Commit node injection  │ │ - Zustand local store    │
        │  - Levenshtein typo analysis │ │ - 90° branch forks       │ │ - Supabase cloud ledger  │
        │  - Pinpoint syntax feedback  │ │ - Dual-view push sync    │ │ - Guest mode fallback    │
        └──────────────────────────────┘ └──────────────────────────┘ └──────────────────────────┘
```

### Stage-by-Stage Curriculum
1. **Stage 01: `git init` (The Genesis Repository)**:
   - *Concepts*: `.git` hidden directory, object database, staging area, HEAD pointer.
   - *Interactive Behavior*: Typing `git init <repo-name>` seeds the root genesis commit node in the SVG timeline.
2. **Stage 02: `git commit` (Immutable Snapshots)**:
   - *Concepts*: Cryptographic SHA-1/SHA-256 commit hashes, parent pointers, commit messages.
   - *Interactive Behavior*: Typing `git commit -m "feat: message"` dynamically appends new commit nodes down the trunk line.
3. **Stage 03: `git branch` (Parallel Universes)**:
   - *Concepts*: Lightweight movable HEAD pointers, trunk isolation, feature branching.
   - *Interactive Behavior*: Typing `git branch <name>` or `git checkout -b <name>` forks a 90° orthogonal branch lane.
4. **Stage 04: `git merge` (Timeline Convergence)**:
   - *Concepts*: Common ancestors, fast-forward vs 3-way merges, merge commits.
   - *Interactive Behavior*: Typing `git merge <name>` animates convergence paths connecting the divergent feature branch back into `main`.
5. **Stage 05: `git push` (Interstellar Remote Sync)**:
   - *Concepts*: Distributed remotes, `origin`, upstream tracking references.
   - *Interactive Behavior*: The UI splits into side-by-side synchronized repositories (Local Repository vs Remote GitHub Origin), animating packet synchronization.

---

## 💡 Assumptions Made

1. **Pedagogical Simplification**: Early stages focus on mental models rather than complex porcelain edge cases (e.g., interactive rebasing or detached HEAD states are omitted in initial stages to prevent cognitive overload).
2. **Client-Side Isolation**: The terminal emulator runs 100% in the browser sandbox. It intentionally does not spawn host shell processes or write to the physical OS filesystem, ensuring total security and cross-platform consistency.
3. **Offline / Guest First**: Users do not need an account to learn. All state hydrates automatically from local storage, with Supabase authentication offered optionally to sync progress across sessions.
4. **Standard CLI Syntax**: Command validation adheres strictly to canonical POSIX Git conventions (double or single quotes for commit messages, flag semantics like `-m`, `-b`, `-c`).

---

## 🏆 Evaluation Focus Areas

### 1. Code Quality & Maintainability
- **TypeScript Strict Mode**: Fully typed interfaces for all stages, models, AST validations, and graph nodes (`src/lib/gitEngine.ts`).
- **Clean Architecture**: Decoupled terminal parsing and typo heuristics into pure testable modules (`src/lib/gitEngine.ts`) away from presentation components.
- **Modern Next.js 16**: Upgraded with App Router, Turbopack, and compliant server-side session proxies.

### 2. Security & Safe Implementation
- **Zero Shell Injection**: The terminal emulator is an isolated parser; no `eval()`, `exec()`, or child processes are ever invoked.
- **Input Sanitization**: Terminal inputs are bounded, trimmed, and parsed via strict regular expressions and token boundaries.
- **Cloud Security**: Supabase tables enforce PostgreSQL Row Level Security (RLS) policies allowing users to read and update only their own authenticated ledger rows.
- **Credential Protection**: No sensitive tokens or secrets are committed; environment variables are accessed safely with offline fallback stubs.

### 3. Efficiency & Resource Optimization
- **Vector Rendering**: The DAG visualizer uses lightweight SVG elements animated with GPU-accelerated Framer Motion transforms rather than heavy WebGL or Canvas runtimes.
- **Minimal Footprint**: Total repository size is **< 1 MB** (well below the 10 MB limit).
- **Fast Build Times**: Next.js with Turbopack compiles in under 2 seconds.

### 4. Testing & Functionality Validation
- **Automated Test Suite**: 24 native automated unit tests covering the Levenshtein distance algorithm, command validation across all 5 stages, typo heuristics, curriculum chain integrity, and route aliases.
- Run tests at any time with:
  ```bash
  npm test
  ```

### 5. Accessibility (a11y)
- **Screen Reader Support**: Terminal emulator outputs are wrapped in `role="region"`, `role="log"`, and `aria-live="polite"` regions so assistive technology immediately announces error and success feedback.
- **Form Semantics**: Inputs include explicit `aria-label`, `autoComplete="off"`, `autoCapitalize="none"`, and `spellCheck="false"` attributes.
- **Visual Accessibility**: SVG graphics contain `<title>` descriptors and `role="img"`. The Neo-Brutalist palette ensures strict WCAG AA/AAA contrast ratios between dark ink (`#09090B`) and bright accents (`#D2E823`, `#F8F4E8`).

---

## 🎨 Design System: Neo-Brutalist "Acid"

GitWorld strictly adheres to a stark, high-contrast Neo-Brutalist aesthetic:
- **Canvas Background**: `#F8F4E8` (Warm Canvas)
- **Heavy Ink & Borders**: `#09090B` (2px solid borders with 0-blur hard drop shadows: `4px 4px 0px 0px #09090B` and `8px 8px 0px 0px #09090B`)
- **Accents**: `#D2E823` (Acid Yellow-Green) & `#FF5555` (Alerts & Error states)
- **Typography**: `Dela Gothic One` (Headers & Badges) + `Space Grotesk` (Body & Monospace Terminal)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS & Neo-Brutalist design tokens
- **Animations**: Framer Motion (GPU-accelerated vector transitions)
- **State Management**: Zustand (Local Storage + Cloud sync)
- **Backend & Auth**: Supabase (PostgreSQL with Row Level Security)
- **Testing**: Node.js Native Test Runner (`node:test`)
- **Hosting**: [Vercel](https://git-world-is-born.vercel.app)

---

## 💻 Local Development & Testing

### 1. Clone & Install
```bash
git clone https://github.com/DHRUV00625/GitWorld.git
cd GitWorld
npm install
```

### 2. Run Automated Tests
```bash
npm test
```
*Executes all 24 automated unit tests verifying the parser, DAG engine, Levenshtein distance, and curriculum integrity.*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Live Deployment

Explore the full application live at:  
👉 **[https://git-world-is-born.vercel.app](https://git-world-is-born.vercel.app)**
