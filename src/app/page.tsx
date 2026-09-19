'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import EchoStack from '@/components/EchoStack';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  ArrowRight,
  GitCommit,
  GitBranch,
  GitPullRequest,
  Terminal,
  Compass,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const revealTransition = {
  duration: 0.7,
  ease: [0.77, 0, 0.175, 1] as [number, number, number, number],
};

export default function EditorialLandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    }
    checkUser();
  }, []);

  const handleCtaClick = () => {
    if (user) {
      router.push('/journey');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#111111] flex flex-col font-satoshi selection:bg-[#111111] selection:text-[#f2f2f2]">
      <Navbar />

      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 lg:px-12 py-16 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
          className="w-full max-w-6xl mx-auto flex flex-col items-center"
        >
          <EchoStack />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-[#838282] max-w-xl mx-auto mt-6 font-medium leading-relaxed"
          >
            Master version control through interactive visual sandboxes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...revealTransition, delay: 0.3 }}
            className="mt-10"
          >
            <button
              onClick={handleCtaClick}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#111111] text-[#f2f2f2] font-clash font-bold text-base uppercase tracking-wider rounded-full shadow-2xl transition-transform duration-500 hover:scale-105 active:scale-95 border border-[#111111]"
            >
              <span>Start Your Journey</span>
              <div className="w-8 h-8 rounded-full bg-[#f2f2f2] text-[#111111] flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </motion.div>
        </motion.div>
      </section>

      <section id="philosophy" className="py-24 px-6 lg:px-12 bg-[#f2f2f2] relative">
        <div className="max-w-6xl mx-auto">
          <div className="w-[1px] h-20 bg-[#1e1e1e]/10 mx-auto mb-12" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={revealTransition}
            className="text-center mb-16"
          >
            <h2 className="font-clash text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.95] text-[#111111]">
              Stop fearing the <span className="font-serif-italic font-normal text-[#111111]">conflict.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#1e1e1e]/10 pt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.1 }}
              className="space-y-3"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">01 / Visual</span>
              <h3 className="font-clash text-2xl font-bold text-[#111111]">Visual Learning</h3>
              <p className="text-sm text-[#838282] leading-relaxed">
                See your commits map out in real-time with continuous interactive branch diagrams.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.2 }}
              className="space-y-3"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">02 / Interactive</span>
              <h3 className="font-clash text-2xl font-bold text-[#111111]">Interactive Sandbox</h3>
              <p className="text-sm text-[#838282] leading-relaxed">
                Type real commands, get real visual feedback with zero setup or configuration required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.3 }}
              className="space-y-3"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">03 / Persistence</span>
              <h3 className="font-clash text-2xl font-bold text-[#111111]">State Persistence</h3>
              <p className="text-sm text-[#838282] leading-relaxed">
                Your repo travels with you across topics so you build real projects as you learn.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="showcase" className="py-24 px-6 lg:px-12 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#1e1e1e]/10 pb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">Showcase</span>
              <h2 className="font-clash text-3xl sm:text-5xl font-bold tracking-[-0.05em] text-[#111111] mt-1">
                Anatomy of GitWorld
              </h2>
            </div>
            <p className="text-sm text-[#838282] max-w-sm mt-4 md:mt-0 font-medium">
              Abstract geometric UI elements designed to demystify Git commands.
            </p>
          </div>

          <div className="grid grid-cols-12 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={revealTransition}
              className="col-span-12 lg:col-span-8 bg-[#111111] text-[#f2f2f2] p-8 rounded-2xl border border-[#1e1e1e]/20 grayscale-[20%] hover:grayscale-0 hover:scale-[1.02] transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[380px]"
            >
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <span className="ml-2 font-mono text-xs text-zinc-400">gitworld-sandbox ~/quest-01</span>
                </div>
                <Terminal className="w-4 h-4 text-zinc-400" />
              </div>

              <div className="font-mono text-sm space-y-3 my-6 text-zinc-300">
                <p className="text-zinc-500">$ git checkout -b feature/editorial-ui</p>
                <p className="text-emerald-400">Switched to a new branch 'feature/editorial-ui'</p>
                <p className="text-zinc-500">$ git commit -m "feat: luxury brutalist design system"</p>
                <p className="text-teal-300">[feature/editorial-ui 7a9d3e] feat: luxury brutalist design system ✨</p>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 font-mono pt-4 border-t border-zinc-800/80">
                <span>STATUS: CLEAN</span>
                <span>BRANCH: FEATURE/EDITORIAL-UI</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.15 }}
              className="col-span-12 lg:col-span-4 bg-[#ffffff] border border-[#1e1e1e]/10 rounded-[9999px] p-8 flex flex-col items-center justify-center text-center grayscale-[20%] hover:grayscale-0 hover:scale-[1.05] transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] min-h-[380px] shadow-lg relative overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full bg-[#111111] text-[#f2f2f2] flex items-center justify-center mb-6 shadow-md">
                <GitBranch className="w-8 h-8" />
              </div>
              <h3 className="font-clash text-2xl font-bold text-[#111111]">Tree Visualizer</h3>
              <p className="text-xs text-[#838282] max-w-[200px] mt-2">
                Observe branch creation and rebase operations live.
              </p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#111111]" />
                <div className="w-0.5 h-6 bg-[#838282]" />
                <div className="w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.2 }}
              className="col-span-12 lg:col-span-5 bg-[#e8e8e8] border border-[#1e1e1e]/10 rounded-[48px] p-8 flex flex-col justify-between min-h-[320px] grayscale-[20%] hover:grayscale-0 hover:scale-[1.03] transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] shadow-md"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">Interactive</span>
                <div className="p-3 bg-[#111111] text-[#f2f2f2] rounded-2xl">
                  <GitCommit className="w-6 h-6" />
                </div>
              </div>

              <div>
                <h3 className="font-clash text-3xl font-bold text-[#111111]">Commit Nodes</h3>
                <p className="text-sm text-[#838282] mt-2">
                  Inspect commit SHA hashes, parent refs, and staging states effortlessly.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.25 }}
              className="col-span-12 lg:col-span-7 bg-[#111111] text-[#f2f2f2] p-8 rounded-2xl border border-[#1e1e1e]/20 flex flex-col justify-between min-h-[320px] grayscale-[20%] hover:grayscale-0 hover:scale-[1.02] transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] shadow-xl"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">Conflict Engine</span>
                <GitPullRequest className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-clash text-3xl font-bold text-[#ffffff]">Merge Conflict Arena</h3>
                <p className="text-sm text-zinc-400 max-w-md">
                  Practice resolving HEAD vs incoming branch changes in a stress-free simulation.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="topics" className="py-24 px-6 lg:px-12 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#838282]">Curriculum</span>
            <h2 className="font-clash text-3xl sm:text-5xl font-bold tracking-[-0.05em] text-[#111111] mt-1">
              Curated Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.1 }}
              onClick={handleCtaClick}
              className="group p-8 border border-[#1e1e1e]/10 rounded-2xl bg-transparent hover:bg-[#ffffff] transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between min-h-[300px]"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-[#838282] font-semibold">01</span>
                <div className="w-16 h-16 bg-[#111111] text-[#f2f2f2] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 ease-out shadow-md">
                  <GitBranch className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-clash text-2xl font-bold text-[#111111] group-hover:text-[#111111]">
                  Branching Basics
                </h3>
                <p className="text-sm text-[#838282] mt-2 leading-relaxed">
                  Master git branch, checkout, and switch mechanics seamlessly.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                  <span>Explore Topic</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.2 }}
              onClick={handleCtaClick}
              className="group p-8 border border-[#1e1e1e]/10 rounded-2xl bg-transparent hover:bg-[#ffffff] transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between min-h-[300px]"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-[#838282] font-semibold">02</span>
                <div className="w-16 h-16 bg-[#111111] text-[#f2f2f2] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 ease-out shadow-md">
                  <Layers className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-clash text-2xl font-bold text-[#111111] group-hover:text-[#111111]">
                  The Merge
                </h3>
                <p className="text-sm text-[#838282] mt-2 leading-relaxed">
                  Fast-forward vs 3-way merges explained with visual DAG graphs.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                  <span>Explore Topic</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...revealTransition, delay: 0.3 }}
              onClick={handleCtaClick}
              className="group p-8 border border-[#1e1e1e]/10 rounded-2xl bg-transparent hover:bg-[#ffffff] transition-all duration-500 cursor-pointer shadow-sm hover:shadow-xl flex flex-col justify-between min-h-[300px]"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-[#838282] font-semibold">03</span>
                <div className="w-16 h-16 bg-[#111111] text-[#f2f2f2] rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 ease-out shadow-md">
                  <GitPullRequest className="w-7 h-7" />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-clash text-2xl font-bold text-[#111111] group-hover:text-[#111111]">
                  Resolving Conflicts
                </h3>
                <p className="text-sm text-[#838282] mt-2 leading-relaxed">
                  Understand ours vs theirs and resolve conflict markers confidently.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111]">
                  <span>Explore Topic</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1e1e1e] text-white/60 pt-16 pb-12 px-6 lg:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
            <div className="space-y-4">
              <span className="font-clash text-2xl font-bold tracking-[-0.05em] text-white uppercase">
                GITWORLD
              </span>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                An editorial luxury-brutalist interactive sandbox for mastering Git & GitHub.
              </p>
            </div>

            <div>
              <h4 className="font-clash text-sm font-bold text-white uppercase tracking-wider mb-4">Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#philosophy" className="hover:text-white transition-colors">Manifesto</a></li>
                <li><a href="#showcase" className="hover:text-white transition-colors">Showcase</a></li>
                <li><a href="#topics" className="hover:text-white transition-colors">Curriculum</a></li>
                <li><a href="/journey" className="hover:text-white transition-colors">Journey Map</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-clash text-sm font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="https://git-scm.com/doc" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Official Git Docs</a></li>
                <li><a href="https://github.com/DHRUV00625/GitWorld" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
                <li><a href="/journey" className="hover:text-white transition-colors">Interactive Terminal</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-clash text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Open Source License</span></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40">
            <p>© 2026 GitWorld. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 font-mono text-[11px]">Crafted with Next.js 14, Framer Motion & Supabase</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="signup"
      />
    </div>
  );
}
