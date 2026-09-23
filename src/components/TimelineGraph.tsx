'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, FolderGit2 } from 'lucide-react';

import { useGitStore } from '@/store/useGitStore';

export interface CommitNode {
  id: string; // e.g. 'c0', 'c1'
  message?: string; // commit message
  label?: string; // backwards compatibility alias for message
  isNew?: boolean;
  hash?: string;
  secondaryLabel?: string;
}

export interface TimelineGraphProps {
  repoName?: string;
  repo_name?: string;
  isInitialized?: boolean;
  commits?: CommitNode[];
  mainBranchName?: string;
  customBranch?: string | null;
  stageName?: string;
  isMerged?: boolean;
  isRemoteMode?: boolean;
}

export default function TimelineGraph({
  repoName = '',
  repo_name = '',
  isInitialized = false,
  commits = [{ id: 'c0', message: 'genesis snapshot', isNew: false }],
  mainBranchName = 'main',
  customBranch = null,
  stageName = 'TIMELINE',
  isMerged: propIsMerged,
  isRemoteMode = false,
}: TimelineGraphProps) {
  const storeIsMerged = useGitStore((state) => state.isMerged);
  const isMerged = Boolean(propIsMerged ?? storeIsMerged);

  const effectiveRepoName = (repoName || repo_name || '').trim();
  const cleanRepoName = effectiveRepoName;
  const hasActiveRepo = Boolean(cleanRepoName) && isInitialized;
  const shouldDrawBranch = Boolean(customBranch && customBranch.trim() !== '' && customBranch !== 'main');

  // Track initial transition from empty to populated
  const prevRepoNameRef = useRef<string>(cleanRepoName);
  const [hasAnimatedGenesis, setHasAnimatedGenesis] = useState<boolean>(false);

  const isTransitioningFromEmpty = (!prevRepoNameRef.current && hasActiveRepo);
  const shouldAnimateGenesis = isTransitioningFromEmpty && !hasAnimatedGenesis;

  useEffect(() => {
    if (shouldAnimateGenesis) {
      const timer = setTimeout(() => {
        setHasAnimatedGenesis(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimateGenesis]);

  useEffect(() => {
    prevRepoNameRef.current = cleanRepoName;
  }, [cleanRepoName]);

  const commitList = commits && commits.length > 0
    ? commits
    : [{ id: 'c0', message: 'genesis snapshot', isNew: false }];

  const commitCount = commitList.length;
  const hasNewCommit = commitList.some((c) => c.isNew);

  // Dynamic layout metrics based on commit count and merge state
  const isBranchOrMerge = shouldDrawBranch || isMerged;
  const startY = 45;
  const nodeSpacing = 80;
  const lineStartX = 50;
  const lineStartY = isBranchOrMerge ? 0 : 25;

  // Node Y positioning helper:
  // For branch/merge: c0=0, c1=100, c2(merge)=300
  // For linear lessons (init, commit): strictly startY + idx * nodeSpacing
  const getNodeY = (idx: number) => {
    if (isBranchOrMerge) {
      return idx >= 2 ? 300 : idx * 100;
    }
    return startY + idx * nodeSpacing;
  };

  // Divergence origin: for branch/merge it's c1 at Y=100; for linear it's the last commit
  const lastY = isBranchOrMerge ? 100 : startY + (commitCount - 1) * nodeSpacing;

  // Main trunk line endpoint
  const lineEndY = isMerged
    ? 380
    : shouldDrawBranch
    ? 220
    : startY + (commitCount - 1) * nodeSpacing + 35;

  // Badge Y positions: slide to 380 when merged, otherwise 220
  const badgeY = isMerged
    ? 380
    : shouldDrawBranch
    ? 220
    : lineEndY + 12;

  const branchBadgeY = isMerged ? 380 : 220;

  // Dynamically scaling SVG height to prevent clipping
  const svgHeight = isMerged
    ? Math.max(480, commitCount * 150)
    : shouldDrawBranch
    ? Math.max(300, lastY + 250)
    : Math.max(240, 100 + commitCount * 80);

  // Badge widths and positioning
  const displayRepoName = cleanRepoName || 'gitworld-project';
  const repoNameTextLength = Math.max(displayRepoName.length * 8.5, 90);
  const defaultBadgeWidth = Math.max(220, repoNameTextLength + 100);

  const mainBadgeWidth = isBranchOrMerge ? 100 : defaultBadgeWidth;
  const mainBadgeX = isBranchOrMerge ? 50 - mainBadgeWidth / 2 : 30;

  const branchBadgeWidth = Math.max(130, Math.min(190, (customBranch?.length || 0) * 8.5 + 40));
  const branchBadgeHeight = 36;
  const branchBadgeX = 320 - branchBadgeWidth / 2;

  return (
    <div className="w-full bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#09090B] mt-6 relative select-none">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#09090B]/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[6px] bg-[#09090B] text-[#D2E823] flex items-center justify-center font-bold border border-[#09090B]">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm sm:text-base text-[#09090B] tracking-tight uppercase leading-tight">
              DAG TIMELINE // {hasActiveRepo ? 'ACTIVE DAG GRAPH' : 'EMPTY REPO LEDGER'}
            </h3>
            <span className="font-mono-brutal text-[10px] font-bold text-[#09090B]/60 uppercase">
              SVG VECTOR GRAPH &bull; {isMerged ? 'MERGED CONVERGENCE GRAPH' : shouldDrawBranch ? 'ORTHOGONAL BRANCH GRAPH' : 'STRICT LINEAR TIMELINE'} &bull; {stageName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Main branch pill */}
          <div className="px-2.5 py-1 bg-white border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-xs font-bold text-[#09090B] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF3333] border border-[#09090B] inline-block" />
            <span>{mainBranchName}</span>
          </div>

          {/* Custom branch pill if active */}
          {shouldDrawBranch && (
            <div className="px-2.5 py-1 bg-[#D2E823] border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-xs font-bold text-[#09090B] flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{customBranch}</span>
            </div>
          )}

          {/* Repository status badge */}
          <div
            className={`px-2.5 py-1 border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-xs font-bold flex items-center gap-1.5 transition-colors ${
              hasActiveRepo
                ? 'bg-[#D2E823] text-[#09090B]'
                : 'bg-zinc-200 text-zinc-500 opacity-60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{hasActiveRepo ? `repo: ${cleanRepoName}` : 'NO REPO INITIALIZED'}</span>
          </div>
        </div>
      </div>

      {/* Visualizer Canvas Area */}
      <div className="relative w-full overflow-x-auto bg-[#F8F4E8] rounded-[8px] border-2 border-[#09090B]/30 p-2 sm:p-4">
        <AnimatePresence mode="wait">
          {!hasActiveRepo ? (
            /* ============================================================ */
            /* EMPTY STATE UI (Pre-Execution):                             */
            /* Dashed 2px Ink Black border, faint Space Grotesk text        */
            /* ============================================================ */
            <motion.div
              key="timeline-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[240px] min-w-[460px] border-2 border-dashed border-[#09090B] rounded-[8px] flex flex-col items-center justify-center gap-3 bg-[#F8F4E8]/40"
            >
              <div className="text-center select-none px-4">
                <span
                  className="font-body text-sm sm:text-base font-bold tracking-widest text-[#09090B]/50 block uppercase"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  [ YOUR JOURNEY STARTS HERE ]
                </span>
                <span className="font-mono-brutal text-[10px] text-[#09090B]/40 uppercase mt-1 inline-block">
                  &gt; Execute &apos;git init &lt;repo-name&gt;&apos; in terminal to generate genesis tree
                </span>
              </div>
            </motion.div>
          ) : (
            /* ============================================================ */
            /* POPULATED STATE: Animated SVG with 4px Alert Red Line,       */
            /* Dynamic Line Extension, Square Commit Nodes, and Base Badges */
            /* ============================================================ */
            <motion.div
              key="timeline-populated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full"
            >
              <motion.svg
                className="w-full min-w-[460px] transition-all"
                height={svgHeight}
                style={{ height: `${svgHeight}px`, minHeight: `${svgHeight}px` }}
                viewBox={`0 ${isBranchOrMerge ? -15 : 0} 520 ${svgHeight + (isBranchOrMerge ? 15 : 0)}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="timeline-grid-pattern"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="20" height="20" fill="transparent" />
                    <circle cx="2" cy="2" r="1" fill="#09090B" opacity="0.12" />
                  </pattern>
                </defs>

                {/* Blueprint background grid */}
                <rect
                  y={isBranchOrMerge ? -15 : 0}
                  width="520"
                  height={svgHeight + (isBranchOrMerge ? 15 : 0)}
                  fill="url(#timeline-grid-pattern)"
                />

                {/* ============================================================ */}
                {/* CENTRAL 4px #FF3333 VERTICAL LINE WITH DYNAMIC EXTENSION    */}
                {/* ============================================================ */}
                <motion.line
                  x1={lineStartX}
                  y1={lineStartY}
                  x2={lineStartX}
                  y2={lineEndY}
                  stroke="#FF3333"
                  strokeWidth="4"
                  strokeLinecap="square"
                  initial={
                    isRemoteMode
                      ? { pathLength: 0 }
                      : shouldAnimateGenesis
                      ? { pathLength: 0 }
                      : hasNewCommit && commitCount > 1
                      ? { y2: lineEndY - nodeSpacing }
                      : { y2: lineEndY }
                  }
                  animate={{ pathLength: 1, y2: lineEndY }}
                  transition={{
                    duration: 0.65,
                    ease: [0.77, 0, 0.175, 1],
                    delay: isRemoteMode ? 0.5 : 0,
                  }}
                />

                {/* Top Origin Indicator Dot */}
                <rect
                  x={lineStartX - 4}
                  y={lineStartY - 4}
                  width="8"
                  height="8"
                  fill="#FF3333"
                  stroke="#09090B"
                  strokeWidth="1.5"
                />

                {/* ============================================================ */}
                {/* COMMIT NODES (Mapped from commits array)                    */}
                {/* ============================================================ */}
                {commitList.map((commit, index) => {
                  const idx = index;
                  const nodeY = getNodeY(index);
                  const commitMsg = commit.message || commit.label || 'snapshot';
                  const isLastCommit = index === commitCount - 1;
                  const isMergeNode = commitMsg.toLowerCase().includes('merge') || (isMerged && index === commitCount - 1);

                  const NodeContent = (
                    <g key={commit.id || index}>
                      {/* Black square commit node #09090B with #FF3333 or #D2E823 border */}
                      <rect
                        x={lineStartX - 8}
                        y={nodeY - 8}
                        width="16"
                        height="16"
                        fill="#09090B"
                        stroke={isMergeNode ? '#D2E823' : '#FF3333'}
                        strokeWidth={isMergeNode ? '2.5' : '2'}
                      />

                      {/* Text Labels: commit ID and message */}
                      <text
                        x={lineStartX + 24}
                        y={nodeY + 4}
                        className="font-mono-brutal font-bold text-[12px] fill-[#09090B]"
                      >
                        c{index} [{commitMsg}]
                      </text>

                      {/* Mock hash sub-label */}
                      <text
                        x={lineStartX + 24}
                        y={nodeY + 18}
                        className="font-mono-brutal text-[10px] font-bold fill-[#09090B]/50 uppercase"
                      >
                        SHA: {commit.hash || (index === 0 ? '9a01fd2' : 'e89f41b')}
                        {isMergeNode ? ` • MERGE COMMIT -> ${mainBranchName}` : isLastCommit ? ` • HEAD -> ${mainBranchName}` : ''}
                      </text>
                    </g>
                  );

                  if (isRemoteMode) {
                    return (
                      <motion.g
                        key={`remote-node-${commit.id || index}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.45,
                          delay: isRemoteMode ? 1.0 + (index * 0.8) : 0.8,
                        }}
                      >
                        {NodeContent}
                      </motion.g>
                    );
                  }

                  if (commit.isNew) {
                    return (
                      <motion.g
                        key={commit.id || index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.25 }}
                      >
                        {NodeContent}
                      </motion.g>
                    );
                  }

                  if (shouldAnimateGenesis) {
                    return (
                      <motion.g
                        key={commit.id || index}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        {NodeContent}
                      </motion.g>
                    );
                  }

                  return <g key={commit.id || index}>{NodeContent}</g>;
                })}

                {/* ============================================================ */}
                {/* DIVERGENT ORTHOGONAL BRANCH LINE (#D2E823, 4px STROKE)      */}
                {/* ============================================================ */}
                {shouldDrawBranch && (
                  <g key="orthogonal-branch-group">
                    {/* Dark under-path for brutalist contrast */}
                    <motion.path
                      d={`M 50 ${lastY} L 50 ${lastY + 55} L 320 ${lastY + 55} L 320 ${lastY + 120}`}
                      fill="none"
                      stroke="#09090B"
                      strokeWidth="6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: isRemoteMode ? 2.6 : 0 }}
                    />

                    {/* Acid Yellow (#D2E823) 4px stroke */}
                    <motion.path
                      d={`M 50 ${lastY} L 50 ${lastY + 55} L 320 ${lastY + 55} L 320 ${lastY + 120}`}
                      fill="none"
                      stroke="#D2E823"
                      strokeWidth="4"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: isRemoteMode ? 2.6 : 0 }}
                    />

                    {/* Branch Divergence Corner Node at turn (320, lastY + 55) */}
                    <motion.rect
                      x={320 - 4}
                      y={lastY + 55 - 4}
                      width="8"
                      height="8"
                      fill="#D2E823"
                      stroke="#09090B"
                      strokeWidth="1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: isRemoteMode ? 3.0 : 0.4, duration: 0.2 }}
                    />
                  </g>
                )}

                {/* ============================================================ */}
                {/* CONVERGENCE PATH: MERGES BRANCH BACK TO MAIN TRUNK           */}
                {/* ============================================================ */}
                {isMerged && (
                  <g key="convergence-branch-group">
                    {/* Dark under-path for brutalist contrast */}
                    <motion.path
                      d="M 320 220 L 320 300 L 50 300"
                      fill="none"
                      stroke="#09090B"
                      strokeWidth="6"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: isRemoteMode ? 4.2 : 0 }}
                    />

                    {/* Acid Yellow (#D2E823) 4px stroke */}
                    <motion.path
                      d="M 320 220 L 320 300 L 50 300"
                      fill="none"
                      stroke="#D2E823"
                      strokeWidth="4"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: isRemoteMode ? 4.2 : 0 }}
                    />

                    {/* Convergence turn corner marker at (320, 300) */}
                    <motion.rect
                      x={320 - 4}
                      y={300 - 4}
                      width="8"
                      height="8"
                      fill="#D2E823"
                      stroke="#09090B"
                      strokeWidth="1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: isRemoteMode ? 4.6 : 0.4, duration: 0.2 }}
                    />
                  </g>
                )}

                {/* ============================================================ */}
                {/* NEO-BRUTALIST BADGES AT THE BOTTOM OF THE LINE              */}
                {/* ============================================================ */}
                <motion.g
                  initial={
                    shouldAnimateGenesis
                      ? { opacity: 0, y: badgeY + 15 }
                      : hasNewCommit
                      ? { y: badgeY - nodeSpacing }
                      : { y: badgeY }
                  }
                  animate={{ opacity: 1, y: badgeY }}
                  transition={{ duration: 0.6, ease: 'easeInOut', delay: shouldAnimateGenesis ? 0.7 : 0.1 }}
                >
                  {/* Hard Shadow for badge */}
                  <rect
                    x={mainBadgeX + 3}
                    y="3"
                    width={mainBadgeWidth}
                    height="36"
                    rx="6"
                    fill="#09090B"
                  />

                  {/* Badge Base Card */}
                  <rect
                    x={mainBadgeX}
                    y="0"
                    width={mainBadgeWidth}
                    height="36"
                    rx="6"
                    fill="#D2E823"
                    stroke="#09090B"
                    strokeWidth="2"
                  />

                  {/* Folder Icon Box */}
                  <rect
                    x={mainBadgeX + 6}
                    y="6"
                    width="24"
                    height="24"
                    rx="4"
                    fill="#09090B"
                  />
                  <text
                    x={mainBadgeX + 18}
                    y="22"
                    textAnchor="middle"
                    className="font-mono-brutal font-bold text-[11px] fill-[#D2E823]"
                  >
                    ~
                  </text>

                  {/* Custom Repo Name */}
                  <text
                    x={mainBadgeX + 34}
                    y="23"
                    className="font-mono-brutal font-bold text-xs fill-[#09090B]"
                  >
                    {isBranchOrMerge
                      ? (displayRepoName.length > 5 ? `${displayRepoName.slice(0, 4)}…` : displayRepoName)
                      : displayRepoName}
                  </text>

                  {/* Main Branch Pill inside badge */}
                  <g transform={`translate(${mainBadgeX + mainBadgeWidth - (isBranchOrMerge ? 44 : 52)}, 6)`}>
                    <rect
                      width={isBranchOrMerge ? 38 : 46}
                      height="24"
                      rx="4"
                      fill="#09090B"
                      stroke="#09090B"
                      strokeWidth="1"
                    />
                    <rect
                      x={isBranchOrMerge ? 4 : 5}
                      y="8"
                      width={isBranchOrMerge ? 6 : 8}
                      height={isBranchOrMerge ? 6 : 8}
                      fill="#FF3333"
                    />
                    <text
                      x={isBranchOrMerge ? 22 : 26}
                      y="16"
                      textAnchor="middle"
                      className="font-mono-brutal font-bold text-[10px] fill-[#FFFFFF]"
                    >
                      {mainBranchName}
                    </text>
                  </g>
                </motion.g>

                {/* ============================================================ */}
                {/* BRANCH BADGE (SLIDES TO 380 WHEN MERGED, OTHERWISE 220)      */}
                {/* ============================================================ */}
                {shouldDrawBranch && (
                  <motion.g
                    key="custom-branch-badge"
                    initial={{ opacity: 0, y: branchBadgeY }}
                    animate={{ opacity: 1, y: branchBadgeY }}
                    transition={{
                      y: { duration: 0.6, ease: 'easeInOut', delay: isRemoteMode ? 3.4 : 0 },
                      opacity: { delay: isRemoteMode ? 3.4 : 0.8, duration: 0.3 },
                      delay: isRemoteMode ? 3.4 : 0.8,
                    }}
                  >
                    {/* Hard Shadow for Branch Badge */}
                    <rect
                      x={branchBadgeX + 3}
                      y="3"
                      width={branchBadgeWidth}
                      height={branchBadgeHeight}
                      rx="6"
                      fill="#09090B"
                    />

                    {/* Badge Base Card in Acid Yellow #D2E823 */}
                    <rect
                      x={branchBadgeX}
                      y="0"
                      width={branchBadgeWidth}
                      height={branchBadgeHeight}
                      rx="6"
                      fill="#D2E823"
                      stroke="#09090B"
                      strokeWidth="2"
                    />

                    {/* Branch Icon Box */}
                    <rect
                      x={branchBadgeX + 6}
                      y="6"
                      width="24"
                      height="24"
                      rx="4"
                      fill="#09090B"
                    />
                    <path
                      d={`M ${branchBadgeX + 15} 10 v 13 M ${branchBadgeX + 15} 17 c 0 -3 3.5 -3.5 6.5 -3.5`}
                      fill="none"
                      stroke="#D2E823"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle cx={branchBadgeX + 15} cy="10" r="1.5" fill="#D2E823" />
                    <circle cx={branchBadgeX + 21.5} cy="13.5" r="1.5" fill="#D2E823" />
                    <circle cx={branchBadgeX + 15} cy="23" r="1.5" fill="#D2E823" />

                    {/* Branch Name Text */}
                    <text
                      x={branchBadgeX + 36}
                      y="22"
                      className="font-mono-brutal font-bold text-xs fill-[#09090B]"
                    >
                      {customBranch && customBranch.length > 13 ? `${customBranch.slice(0, 12)}…` : customBranch}
                    </text>

                    {/* Neo-brutalist BRANCH pill on the right */}
                    <g transform={`translate(${branchBadgeX + branchBadgeWidth - 52}, 6)`}>
                      <rect
                        width="46"
                        height="24"
                        rx="4"
                        fill="#09090B"
                        stroke="#09090B"
                        strokeWidth="1"
                      />
                      <text
                        x="23"
                        y="16"
                        textAnchor="middle"
                        className="font-mono-brutal font-bold text-[9px] fill-[#D2E823]"
                      >
                        {isMerged ? 'MERGED' : 'BRANCH'}
                      </text>
                    </g>
                  </motion.g>
                )}
              </motion.svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visualizer Footer Info */}
      <div className="mt-3 pt-2 border-t border-[#09090B]/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono-brutal text-[#09090B]/70 gap-1">
        <div>
          <span className="font-bold text-[#09090B]">LEDGER STATUS:</span>{' '}
          {hasActiveRepo ? (
            <span className="text-emerald-700 font-bold">ACTIVE REPO [{displayRepoName}]</span>
          ) : (
            <span className="text-amber-700 font-bold">AWAITING GIT INIT COMMAND</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>
            <span className="font-bold text-[#09090B]">COMMITS:</span> {hasActiveRepo ? `${commitCount} snapshot(s)` : '0 snapshot(s)'}
          </span>
          {shouldDrawBranch && (
            <span className="border-l border-[#09090B]/30 pl-2 text-emerald-800 font-bold">
              BRANCH: {customBranch} {isMerged ? '[MERGED CONVERGENCE]' : '[DIVERGENT]'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
