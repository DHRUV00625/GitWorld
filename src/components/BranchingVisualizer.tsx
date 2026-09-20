'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GitBranch, GitCommit, Split } from 'lucide-react';

interface BranchingVisualizerProps {
  isBranchCreated: boolean;
  currentBranch: string;
  mainBranchName?: string;
  stageName?: string;
}

export default function BranchingVisualizer({
  isBranchCreated,
  currentBranch,
  mainBranchName = 'main',
  stageName = 'BRANCHING',
}: BranchingVisualizerProps) {
  const displayBranch = currentBranch && currentBranch !== 'main' ? currentBranch : 'feature/quantum-leap';

  return (
    <div className="w-full bg-[#F8F4E8] border-2 border-[#09090B] rounded-[12px] p-5 sm:p-6 shadow-[4px_4px_0px_0px_#09090B] mt-6 relative select-none">
      {/* Visualizer Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#09090B]/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[6px] bg-[#09090B] text-[#D2E823] flex items-center justify-center font-bold border border-[#09090B]">
            <Split className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm sm:text-base text-[#09090B] tracking-tight uppercase leading-tight">
              DAG TIMELINE // ORTHOGONAL BRANCH GRAPH
            </h3>
            <span className="font-mono-brutal text-[10px] font-bold text-[#09090B]/60 uppercase">
              SVG VECTOR GRAPH &bull; STRICT 90&deg; DIVERGENCE &bull; {stageName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-white border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-xs font-bold text-[#09090B] flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#FF3333] border border-[#09090B] inline-block" />
            <span>{mainBranchName}</span>
          </div>

          <div
            className={`px-2.5 py-1 border-2 border-[#09090B] rounded-[6px] shadow-[2px_2px_0px_0px_#09090B] font-mono-brutal text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isBranchCreated
                ? 'bg-[#D2E823] text-[#09090B]'
                : 'bg-zinc-200 text-zinc-500 opacity-60'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>{isBranchCreated ? displayBranch : 'NO FORK DETECTED'}</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto bg-[#F8F4E8] rounded-[8px] border-2 border-[#09090B]/30 p-2 sm:p-4">
        {/* Subtle Neo-Brutalist Grid Lines */}
        <svg
          className="w-full h-[240px] min-w-[460px]"
          viewBox="0 0 520 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="brutalist-grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="transparent" />
              <circle cx="2" cy="2" r="1" fill="#09090B" opacity="0.12" />
            </pattern>
          </defs>

          {/* Blueprint grid fill */}
          <rect width="520" height="240" fill="url(#brutalist-grid-pattern)" />

          {/* ============================================================ */}
          {/* THE MAIN TIMELINE (Striking Red #FF3333, 4px Vertical Line) */}
          {/* ============================================================ */}
          <line
            x1="90"
            y1="25"
            x2="90"
            y2="215"
            stroke="#FF3333"
            strokeWidth="4"
            strokeLinecap="square"
          />

          {/* Commit Node 1: Genesis Commit (16x16px square, #09090B fill, 2px border) */}
          <rect
            x="82"
            y="32"
            width="16"
            height="16"
            fill="#09090B"
            stroke="#FF3333"
            strokeWidth="2"
          />
          <text
            x="112"
            y="44"
            className="font-mono-brutal font-bold text-[11px] fill-[#09090B]"
          >
            c1 [genesis snapshot]
          </text>

          {/* Commit Node 2: Divergence / Fork Commit (16x16px square) */}
          <rect
            x="82"
            y="112"
            width="16"
            height="16"
            fill="#09090B"
            stroke="#09090B"
            strokeWidth="2"
          />
          <text
            x="112"
            y="124"
            className="font-mono-brutal font-bold text-[11px] fill-[#09090B]"
          >
            c2 [divergence point: HEAD~1]
          </text>

          {/* Commit Node 3: Main Branch Tip (16x16px square) */}
          <rect
            x="82"
            y="192"
            width="16"
            height="16"
            fill="#09090B"
            stroke="#FF3333"
            strokeWidth="2"
          />
          <text
            x="112"
            y="204"
            className="font-mono-brutal font-bold text-[11px] fill-[#09090B]"
          >
            c3 [trunk HEAD]
          </text>

          {/* Main Branch Label Badge */}
          <g transform="translate(18, 185)">
            <rect
              width="54"
              height="24"
              fill="#FF3333"
              stroke="#09090B"
              strokeWidth="2"
              rx="4"
            />
            <text
              x="27"
              y="16"
              textAnchor="middle"
              className="font-mono-brutal font-bold text-[11px] fill-[#09090B]"
            >
              main
            </text>
          </g>

          {/* ============================================================ */}
          {/* THE BRANCHING ANIMATION (Strict 90-Degree Orthogonal Fork)    */}
          {/* M 90 120 (from c2 center) -> L 320 120 -> L 320 45          */}
          {/* Double stroke: 8px #09090B under + 4px #D2E823 over          */}
          {/* ============================================================ */}
          {/* Under-path: 2px solid #09090B outer border */}
          <motion.path
            d="M 90 120 L 320 120 L 320 45"
            fill="none"
            stroke="#09090B"
            strokeWidth="8"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isBranchCreated ? 1 : 0 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
          />

          {/* Over-path: 4px Acid Accent #D2E823 inner core */}
          <motion.path
            d="M 90 120 L 320 120 L 320 45"
            fill="none"
            stroke="#D2E823"
            strokeWidth="4"
            strokeLinecap="square"
            strokeLinejoin="miter"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isBranchCreated ? 1 : 0 }}
            transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
          />

          {/* New Commit Node on Branch Tip: 16x16px square (#09090B fill, #D2E823 stroke) */}
          <motion.rect
            x="312"
            y="37"
            width="16"
            height="16"
            fill="#D2E823"
            stroke="#09090B"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={isBranchCreated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.2 }}
          />

          {/* Dotted indicator when awaiting branch creation */}
          {!isBranchCreated && (
            <path
              d="M 90 120 L 320 120 L 320 45"
              fill="none"
              stroke="#09090B"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.25"
            />
          )}
        </svg>

        {/* Dynamic Branch Label Tag (HTML Overlay for crisp Brutalist styling) */}
        <div className="absolute top-[28px] left-[325px] sm:left-[340px] pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={isBranchCreated ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 10 }}
            transition={{ delay: 0.85, type: 'spring', stiffness: 350, damping: 20 }}
            className="px-3 py-1.5 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-[6px] shadow-[3px_3px_0px_0px_#09090B] flex items-center gap-2 whitespace-nowrap"
          >
            <GitBranch className="w-3.5 h-3.5 text-[#09090B] shrink-0" />
            <span className="font-mono-brutal font-bold text-xs uppercase tracking-tight">
              {displayBranch}
            </span>
            <span className="font-mono-brutal text-[9px] font-bold bg-[#09090B] text-[#D2E823] px-1.5 py-0.5 rounded-[3px]">
              HEAD
            </span>
          </motion.div>
        </div>

        {/* Waiting state helper text */}
        {!isBranchCreated && (
          <div className="absolute bottom-4 right-4 bg-white/90 border border-[#09090B] px-3 py-1 rounded font-mono-brutal text-[10px] font-bold text-[#09090B]/70 shadow-[1px_1px_0px_0px_#09090B]">
            &gt; Awaiting branch command: git checkout -b {displayBranch}
          </div>
        )}
      </div>

      {/* Visualizer Footer Info */}
      <div className="mt-3 pt-2 border-t border-[#09090B]/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono-brutal text-[#09090B]/70 gap-1">
        <div>
          <span className="font-bold text-[#09090B]">TRUNK:</span> 41-byte SHA-1 linear pointer
        </div>
        <div>
          <span className="font-bold text-[#09090B]">STATUS:</span>{' '}
          {isBranchCreated ? (
            <span className="text-emerald-700 font-bold">DIVERGENT TRACK ACTIVE [ISOLATED]</span>
          ) : (
            <span className="text-amber-700 font-bold">UNFORKED LINEAR REPO</span>
          )}
        </div>
      </div>
    </div>
  );
}
