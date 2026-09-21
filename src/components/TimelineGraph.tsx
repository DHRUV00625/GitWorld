'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, FolderGit2 } from 'lucide-react';

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
  isInitialized?: boolean;
  commits?: CommitNode[];
  mainBranchName?: string;
  stageName?: string;
}

export default function TimelineGraph({
  repoName = '',
  isInitialized = false,
  commits = [{ id: 'c0', message: 'genesis snapshot', isNew: false }],
  mainBranchName = 'main',
  stageName = 'TIMELINE',
}: TimelineGraphProps) {
  const cleanRepoName = (repoName || '').trim();
  const hasActiveRepo = Boolean(cleanRepoName) && isInitialized;

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

  // Dynamic layout metrics based on commit count
  const startY = 45;
  const nodeSpacing = 80;
  const lineStartX = 100;
  const lineStartY = 25;
  const lineEndY = startY + (commitCount - 1) * nodeSpacing + 35;
  const badgeY = lineEndY + 12;
  const svgHeight = Math.max(240, 100 + commitCount * 80);

  // Badge width calculation based on repo name
  const displayRepoName = cleanRepoName || 'gitworld-project';
  const repoNameTextLength = Math.max(displayRepoName.length * 8.5, 90);
  const badgeWidth = Math.max(220, repoNameTextLength + 100);

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
              SVG VECTOR GRAPH &bull; STRICT LINEAR TIMELINE &bull; {stageName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Main branch pill */}
          <div className="px-2.5 py-1 bg-white border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-xs font-bold text-[#09090B] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF3333] border border-[#09090B] inline-block" />
            <span>{mainBranchName}</span>
          </div>

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
                style={{ height: `${svgHeight}px` }}
                viewBox={`0 0 520 ${svgHeight}`}
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
                <rect width="520" height={svgHeight} fill="url(#timeline-grid-pattern)" />

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
                    shouldAnimateGenesis
                      ? { pathLength: 0 }
                      : hasNewCommit && commitCount > 1
                      ? { y2: lineEndY - nodeSpacing }
                      : { y2: lineEndY }
                  }
                  animate={{ pathLength: 1, y2: lineEndY }}
                  transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
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
                {commitList.map((commit, idx) => {
                  const nodeY = startY + idx * nodeSpacing;
                  const commitMsg = commit.message || commit.label || 'snapshot';
                  const isLastCommit = idx === commitCount - 1;

                  const NodeContent = (
                    <g key={commit.id || idx}>
                      {/* Black square commit node #09090B with #FF3333 border */}
                      <rect
                        x={lineStartX - 8}
                        y={nodeY - 8}
                        width="16"
                        height="16"
                        fill="#09090B"
                        stroke="#FF3333"
                        strokeWidth="2"
                      />

                      {/* Text Labels: commit ID and message */}
                      <text
                        x={lineStartX + 24}
                        y={nodeY + 4}
                        className="font-mono-brutal font-bold text-[12px] fill-[#09090B]"
                      >
                        c{idx} [{commitMsg}]
                      </text>

                      {/* Mock hash sub-label */}
                      <text
                        x={lineStartX + 24}
                        y={nodeY + 18}
                        className="font-mono-brutal text-[10px] font-bold fill-[#09090B]/50 uppercase"
                      >
                        SHA: {commit.hash || (idx === 0 ? '9a01fd2' : 'e89f41b')}
                        {isLastCommit ? ` • HEAD -> ${mainBranchName}` : ''}
                      </text>
                    </g>
                  );

                  if (commit.isNew) {
                    return (
                      <motion.g
                        key={commit.id || idx}
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
                        key={commit.id || idx}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                      >
                        {NodeContent}
                      </motion.g>
                    );
                  }

                  return <g key={commit.id || idx}>{NodeContent}</g>;
                })}

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
                  transition={{ duration: 0.5, ease: 'easeOut', delay: shouldAnimateGenesis ? 0.7 : 0.2 }}
                >
                  {/* Hard Shadow for badge */}
                  <rect
                    x="33"
                    y="3"
                    width={badgeWidth}
                    height="36"
                    rx="6"
                    fill="#09090B"
                  />

                  {/* Badge Base Card */}
                  <rect
                    x="30"
                    y="0"
                    width={badgeWidth}
                    height="36"
                    rx="6"
                    fill="#D2E823"
                    stroke="#09090B"
                    strokeWidth="2"
                  />

                  {/* Folder Icon Box */}
                  <rect
                    x="36"
                    y="6"
                    width="24"
                    height="24"
                    rx="4"
                    fill="#09090B"
                  />
                  <text
                    x="48"
                    y="22"
                    textAnchor="middle"
                    className="font-mono-brutal font-bold text-[11px] fill-[#D2E823]"
                  >
                    ~
                  </text>

                  {/* Custom Repo Name */}
                  <text
                    x="68"
                    y="23"
                    className="font-mono-brutal font-bold text-xs fill-[#09090B]"
                  >
                    {displayRepoName}
                  </text>

                  {/* Main Branch Pill inside badge */}
                  <g transform={`translate(${30 + badgeWidth - 68}, 6)`}>
                    <rect
                      width="60"
                      height="24"
                      rx="4"
                      fill="#09090B"
                      stroke="#09090B"
                      strokeWidth="1"
                    />
                    <rect
                      x="7"
                      y="8"
                      width="8"
                      height="8"
                      fill="#FF3333"
                    />
                    <text
                      x="22"
                      y="16"
                      className="font-mono-brutal font-bold text-[10px] fill-[#FFFFFF]"
                    >
                      {mainBranchName}
                    </text>
                  </g>
                </motion.g>
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
        <div>
          <span className="font-bold text-[#09090B]">COMMITS:</span> {hasActiveRepo ? `${commitCount} snapshot(s)` : '0 snapshot(s)'}
        </div>
      </div>
    </div>
  );
}
