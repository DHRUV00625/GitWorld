'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, ArrowRight, Lock, CheckCircle2, Zap, GitBranch, Trophy } from 'lucide-react';

export interface QuestNodeData {
  id: string;
  stage: string;
  title: string;
  branch: string;
  description: string;
  commands: string[];
  xp: number;
  status?: 'completed' | 'active' | 'locked';
  badge: string;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  requires?: string[];
}

interface QuestModalProps {
  quest: QuestNodeData | null;
  isOpen?: boolean;
  onClose: () => void;
  onLaunchTopic?: (id: string) => void;
}

export default function QuestModal({ quest, isOpen = true, onClose, onLaunchTopic }: QuestModalProps) {
  if (!quest || !isOpen) return null;

  const isLocked = quest.status === 'locked' || quest.isUnlocked === false;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#09090B]/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-[#F8F4E8] border-2 border-[#09090B] rounded-[24px] shadow-[8px_8px_0px_0px_#09090B] p-6 sm:p-8 overflow-hidden z-10 font-body text-[#09090B]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#09090B] bg-[#F8F4E8] hover:bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Node Meta Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 border-2 border-[#09090B] rounded-full text-[11px] font-mono-brutal font-bold tracking-wider shadow-[2px_2px_0px_0px_#09090B] ${
              isLocked
                ? 'bg-zinc-200 text-zinc-600'
                : quest.status === 'completed' || quest.isCompleted
                ? 'bg-[#D2E823] text-[#09090B]'
                : 'bg-white text-[#09090B]'
            }`}>
              {quest.stage} &bull; {quest.branch}
            </span>
            <span className="text-xs font-mono-brutal font-bold text-zinc-600">
              +{quest.xp} XP
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading text-2xl sm:text-3xl text-[#09090B] tracking-tight leading-none mb-3">
            {quest.title}
          </h2>

          {/* Tagline / Badge */}
          <div className="inline-block px-2.5 py-1 bg-white border border-[#09090B] rounded-[6px] text-xs font-mono-brutal font-bold mb-4 shadow-[2px_2px_0px_0px_#09090B]">
            🏷️ {quest.badge}
          </div>

          {/* Description */}
          <p className="text-sm font-medium text-zinc-700 leading-relaxed mb-6">
            {quest.description}
          </p>

          {/* Terminal Command Spec */}
          <div className="bg-[#09090B] text-[#F8F4E8] border-2 border-[#09090B] rounded-[16px] p-4 mb-6 shadow-[4px_4px_0px_0px_#09090B]">
            <div className="flex items-center gap-2 mb-2 border-b border-zinc-700 pb-2">
              <Terminal className="w-4 h-4 text-[#D2E823]" />
              <span className="font-mono-brutal text-xs font-bold text-zinc-300">
                REQUIRED PROTOCOL
              </span>
            </div>
            <div className="space-y-1.5 font-mono-brutal text-xs">
              {quest.commands.map((cmd, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#D2E823] select-none">&gt;</span>
                  <span className="text-zinc-100">{cmd}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {isLocked ? (
            <div className="p-4 bg-zinc-200 border-2 border-[#09090B] rounded-[12px] flex items-center gap-3 text-xs font-mono-brutal text-zinc-700 shadow-[2px_2px_0px_0px_#09090B]">
              <Lock className="w-5 h-5 text-[#09090B] shrink-0" />
              <span>
                <strong>LOCKED MODULE:</strong> Complete preceding quests on this branch to unlock terminal access.
              </span>
            </div>
          ) : (
            <button
              onClick={() => {
                if (onLaunchTopic) {
                  onLaunchTopic(quest.id);
                } else {
                  onClose();
                }
              }}
              className="w-full py-3.5 px-6 bg-[#09090B] text-[#D2E823] font-heading text-sm tracking-tight rounded-[12px] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>LAUNCH QUEST SANDBOX</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
