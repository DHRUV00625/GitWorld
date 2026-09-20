'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signup' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('ACCOUNT CREATED! REDIRECTING TO YOUR JOURNEY...');
          setTimeout(() => {
            onClose();
            router.push('/journey');
          }, 1000);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg('WELCOME BACK! REDIRECTING TO YOUR JOURNEY...');
          setTimeout(() => {
            onClose();
            router.push('/journey');
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'AN UNEXPECTED ERROR OCCURRED.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-md bg-[#F8F4E8] border-2 border-[#09090B] rounded-[24px] shadow-[8px_8px_0px_0px_#09090B] p-6 sm:p-8 overflow-hidden z-10 font-body"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-[#09090B] bg-[#F8F4E8] hover:bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-[2px_2px_0px_0px_#09090B] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-left mb-6">
              <span className="inline-block px-3 py-1 bg-[#D2E823] text-[#09090B] border-2 border-[#09090B] rounded-full text-[11px] font-mono-brutal font-bold tracking-wider mb-3 shadow-[2px_2px_0px_0px_#09090B]">
                AUTHENTICATION
              </span>
              <h3 className="font-heading text-2xl text-[#09090B] tracking-tighter">
                {mode === 'signup' ? 'JOIN GITWORLD' : 'WELCOME BACK'}
              </h3>
              <p className="text-xs text-[#09090B]/70 mt-1 font-medium">
                {mode === 'signup'
                  ? 'Create your account to start interactive visual Git quests.'
                  : 'Log in to continue your Git journey.'}
              </p>
            </div>

            {/* Mode Toggle Switch */}
            <div className="grid grid-cols-2 p-1 bg-white border-2 border-[#09090B] rounded-[12px] mb-6 shadow-[2px_2px_0px_0px_#09090B]">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-heading tracking-tight rounded-[8px] transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#09090B] text-[#D2E823]'
                    : 'text-[#09090B] hover:bg-[#F8F4E8]'
                }`}
              >
                SIGN UP
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`py-2 text-xs font-heading tracking-tight rounded-[8px] transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#09090B] text-[#D2E823]'
                    : 'text-[#09090B] hover:bg-[#F8F4E8]'
                }`}
              >
                LOG IN
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 border-2 border-[#09090B] rounded-[8px] text-xs font-mono-brutal text-red-900 shadow-[2px_2px_0px_0px_#09090B]"
              >
                {errorMsg}
              </motion.div>
            )}

            {/* Success Message */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] text-xs font-mono-brutal text-[#09090B] font-bold shadow-[2px_2px_0px_0px_#09090B]"
              >
                {successMsg}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-heading text-[#09090B] mb-1 tracking-tight">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#09090B]/60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@gitworld.dev"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#09090B] rounded-[8px] text-sm text-[#09090B] font-medium outline-none focus:bg-[#F8F4E8] shadow-[2px_2px_0px_0px_#09090B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading text-[#09090B] mb-1 tracking-tight">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#09090B]/60" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#09090B] rounded-[8px] text-sm text-[#09090B] font-medium outline-none focus:bg-[#F8F4E8] shadow-[2px_2px_0px_0px_#09090B] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 px-4 bg-[#09090B] text-[#D2E823] font-heading text-sm tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-[4px_4px_0px_0px_#09090B] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#D2E823] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signup' ? 'START EXPLORING' : 'LOG IN TO QUEST'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
