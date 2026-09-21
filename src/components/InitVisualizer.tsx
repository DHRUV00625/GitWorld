'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Terminal, FolderGit2 } from 'lucide-react';

interface InitVisualizerProps {
  repoName?: string;
  isJustInitialized?: boolean;
  mainBranchName?: string;
  stageName?: string;
}

export default function InitVisualizer({
  repoName = '',
  isJustInitialized = false,
  mainBranchName = 'main',
  stageName = 'INIT',
}: InitVisualizerProps) {
  const cleanRepoName = (repoName || '').trim();
  const isInitialized = cleanRepoName.length > 0;

  // Track state transitions: the animation MUST only trigger when transitioning
  // from the empty state to the initialized state.
  const prevRepoNameRef = useRef<string>(cleanRepoName);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  // Transition occurs if previous repo_name was empty and current repo_name is populated,
  // or if isJustInitialized was explicitly set during the command execution.
  const isTransitioning = (!prevRepoNameRef.current && isInitialized) || Boolean(isJustInitialized);
  const shouldAnimate = isTransitioning && !hasAnimated;

  useEffect(() => {
    if (shouldAnimate) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    prevRepoNameRef.current = cleanRepoName;
  }, [cleanRepoName]);

  // Badge layout metrics inside SVG
  const displayRepoName = cleanRepoName || 'gitworld-project';
  const repoNameTextLength = Math.max(displayRepoName.length * 8.5, 90);
  const badgeWidth = Math.max(220, repoNameTextLength + 100);

  return (
    <div className="w-full bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#09090B] mt-6 relative select-none">
      {/* Visualizer Top Bar: 'DAG TIMELINE' Box Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#09090B]/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[6px] bg-[#09090B] text-[#D2E823] flex items-center justify-center font-bold border border-[#09090B]">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm sm:text-base text-[#09090B] tracking-tight uppercase leading-tight">
              DAG TIMELINE // GENESIS REPOSITORY GRAPH
            </h3>
            <span className="font-mono-brutal text-[10px] font-bold text-[#09090B]/60 uppercase">
              SVG VECTOR GRAPH &bull; LOCAL REPOSITORY SEED &bull; {stageName}
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
              isInitialized
                ? 'bg-[#D2E823] text-[#09090B]'
                : 'bg-zinc-200 text-zinc-500 opacity-60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{isInitialized ? `repo: ${cleanRepoName}` : 'NO REPO INITIALIZED'}</span>
          </div>
        </div>
      </div>

      {/* Visualizer Canvas / State Box */}
      <div className="relative w-full overflow-x-auto bg-[#F8F4E8] rounded-[8px] border-2 border-[#09090B]/30 p-2 sm:p-4">
        <AnimatePresence mode="wait">
          {!isInitialized ? (
            /* ============================================================ */
            /* EMPTY STATE UI (Pre-Execution):                             */
            /* Dashed 2px Ink Black (#09090B) border                        */
            /* Centered faint Space Grotesk text: [ YOUR JOURNEY STARTS HERE ]*/
            /* ============================================================ */
            <motion.div
              key="dag-empty-state"
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
            /* FRAMER MOTION SVG ANIMATION (Post-Execution):               */
            /* - 4px vertical line in Alert Red (#FF3333) drawn downwards   */
            /* - Delay 0.5s: square black commit node (c0 [genesis snapshot])*/
            /* - Delay 0.7s: Neo-Brutalist badge with <repo-name> & main    */
            /* ============================================================ */
            <motion.div
              key="dag-initialized-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="relative w-full"
            >
              <motion.svg
                className="w-full h-[240px] min-w-[460px]"
                viewBox="0 0 520 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="brutalist-grid-pattern-init"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="20" height="20" fill="transparent" />
                    <circle cx="2" cy="2" r="1" fill="#09090B" opacity="0.12" />
                  </pattern>
                </defs>

                {/* Blueprint grid fill */}
                <rect width="520" height="240" fill="url(#brutalist-grid-pattern-init)" />

                {/* ============================================================ */}
                {/* THE LINE: Alert Red (#FF3333), 4px Vertical Line            */}
                {/* Drawing downwards using initial pathLength: 0, animate: 1   */}
                {/* ============================================================ */}
                <motion.line
                  x1="100"
                  y1="25"
                  x2="100"
                  y2="185"
                  stroke="#FF3333"
                  strokeWidth="4"
                  strokeLinecap="square"
                  initial={{ pathLength: shouldAnimate ? 0 : 1 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.75, ease: [0.77, 0, 0.175, 1] }}
                />

                {/* Top Origin Indicator Dot */}
                <rect
                  x="96"
                  y="21"
                  width="8"
                  height="8"
                  fill="#FF3333"
                  stroke="#09090B"
                  strokeWidth="1.5"
                />

                {/* ============================================================ */}
                {/* THE NODE & LABEL: Square black commit node c0               */}
                {/* Fade in after delay 0.5s                                     */}
                {/* ============================================================ */}
                <motion.rect
                  x="92"
                  y="42"
                  width="16"
                  height="16"
                  fill="#09090B"
                  stroke="#FF3333"
                  strokeWidth="2"
                  initial={{ opacity: shouldAnimate ? 0 : 1, scale: shouldAnimate ? 0.4 : 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: shouldAnimate ? 0.5 : 0, duration: 0.25 }}
                />

                <motion.g
                  initial={{ opacity: shouldAnimate ? 0 : 1, x: shouldAnimate ? -8 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldAnimate ? 0.5 : 0, duration: 0.25 }}
                >
                  <text
                    x="124"
                    y="55"
                    className="font-mono-brutal font-bold text-[12px] fill-[#09090B]"
                  >
                    c0 [genesis snapshot]
                  </text>
                  <text
                    x="124"
                    y="70"
                    className="font-mono-brutal text-[10px] font-bold fill-[#09090B]/60 uppercase"
                  >
                    HEAD -&gt; {mainBranchName} &bull; root commit tree
                  </text>
                </motion.g>

                {/* ============================================================ */}
                {/* THE REPO TAG: Neo-Brutalist badge at base of the line        */}
                {/* Displays custom <repo-name> and main branch label            */}
                {/* ============================================================ */}
                <motion.g
                  initial={{ opacity: shouldAnimate ? 0 : 1, y: shouldAnimate ? 15 : 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: shouldAnimate ? 0.7 : 0, duration: 0.35, ease: 'easeOut' }}
                >
                  {/* Hard Shadow for Neo-Brutalist badge */}
                  <rect
                    x="33"
                    y="173"
                    width={badgeWidth}
                    height="36"
                    rx="6"
                    fill="#09090B"
                  />

                  {/* Badge Base Card */}
                  <rect
                    x="30"
                    y="170"
                    width={badgeWidth}
                    height="36"
                    rx="6"
                    fill="#D2E823"
                    stroke="#09090B"
                    strokeWidth="2"
                  />

                  {/* Folder / Repo icon box */}
                  <rect
                    x="36"
                    y="176"
                    width="24"
                    height="24"
                    rx="4"
                    fill="#09090B"
                  />
                  <text
                    x="48"
                    y="192"
                    textAnchor="middle"
                    className="font-mono-brutal font-bold text-[11px] fill-[#D2E823]"
                  >
                    ~
                  </text>

                  {/* Custom Repo Name */}
                  <text
                    x="68"
                    y="193"
                    className="font-mono-brutal font-bold text-xs fill-[#09090B]"
                  >
                    {displayRepoName}
                  </text>

                  {/* Main Branch Label Pill inside badge */}
                  <g transform={`translate(${30 + badgeWidth - 68}, 176)`}>
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
          <span className="font-bold text-[#09090B]">GENESIS ROOT:</span> SHA-1 null parent pointer
        </div>
        <div>
          <span className="font-bold text-[#09090B]">STATUS:</span>{' '}
          {isInitialized ? (
            <span className="text-emerald-700 font-bold">
              REPO INITIALIZED [{displayRepoName}]
            </span>
          ) : (
            <span className="text-amber-700 font-bold">
              AWAITING &apos;git init &lt;repo-name&gt;&apos;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
