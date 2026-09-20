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
  status: 'completed' | 'active' | 'locked';
  badge: string;
}

interface QuestModalProps {
  quest: QuestNodeData | null;
  onClose: () => void;
}

export default function QuestModal({ quest, onClose }: QuestModalProps) {
  if (!quest) return null;

  const isLocked = quest.status === 'locked';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#09090B]/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-lg bg-[#F8F4E8] border-2 border-[#09090B] rounded-[24px] shadow-[8px_8px_0px_0px_#09090B] p-6 sm:p-8 overflow-hidden z-10 font-body text-[#09090B]"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#09090B] bg-[#F8F4E8] hover:bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 border-2 border-[#09090B] rounded-full text-[11px] font-mono-brutal font-bold tracking-wider shadow-[2px_2px_0px_0px_#09090B] ${
              isLocked
                ? 'bg-zinc-200 text-zinc-600'
                : 'bg-[#D2E823] text-[#09090B]'
            }`}>
              {quest.stage}
            </span>

            <div className="flex items-center gap-1 text-[11px] font-mono-brutal font-bold text-[#09090B] bg-white px-2.5 py-1 border border-[#09090B] rounded">
              <GitBranch className="w-3 h-3 text-[#09090B]" />
              <span>{quest.branch}</span>
            </div>
          </div>

          <h3 className="font-heading text-2xl sm:text-3xl text-[#09090B] tracking-tighter mb-2">
            {quest.title}
          </h3>

          <p className="text-sm text-[#09090B]/80 font-medium leading-relaxed mb-6">
            {quest.description}
          </p>

          <div className="bg-[#09090B] text-[#F8F4E8] border-2 border-[#09090B] rounded-[16px] p-4 sm:p-5 shadow-[4px_4px_0px_0px_#09090B] mb-6 space-y-3 font-mono-brutal text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-[#D2E823]">
                <Terminal className="w-3.5 h-3.5" />
                <span>COMMAND TARGETS</span>
              </div>
              <span>REWARD: +{quest.xp} XP</span>
            </div>

            <div className="space-y-2 pt-1">
              {quest.commands.map((cmd, idx) => (
                <div key={idx} className="flex items-center gap-2 text-zinc-200">
                  <span className="text-[#D2E823]">&gt;</span>
                  <code className="bg-zinc-900 text-white px-2 py-1 rounded border border-zinc-800 w-full font-bold">
                    {cmd}
                  </code>
                </div>
              ))}
            </div>
          </div>

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
                alert(`Starting sandbox quest: ${quest.title}`);
                onClose();
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
