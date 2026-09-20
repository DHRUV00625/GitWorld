'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import CustomCursor from '@/components/CustomCursor';
import NoiseOverlay from '@/components/NoiseOverlay';
import AuthListener from '@/components/AuthListener';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  GitCommit,
  GitBranch,
  GitPullRequest,
  Terminal,
  Lock,
  Sparkles,
  Zap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export default function NeoBrutalistLandingPage() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const curriculumScrollRef = useRef<HTMLDivElement>(null);

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

  const scrollCurriculum = (direction: 'left' | 'right') => {
    if (curriculumScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      curriculumScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const curriculumModules = [
    {
      id: '01',
      title: '01. INIT & COMMIT',
      subtitle: 'The Root Origin',
      desc: 'Master workspace staging, commit hashes, and history logs.',
      badge: 'LEVEL 01',
      badgeColor: 'bg-[#D2E823] text-[#09090B]',
      locked: false,
      graphic: (
        <div className="w-full h-44 bg-[#09090B] rounded-[16px] border-2 border-[#09090B] p-4 flex flex-col justify-between text-left font-mono-brutal text-xs text-[#F8F4E8]">
          <div className="flex items-center gap-1.5 text-[#D2E823]">
            <Terminal className="w-3.5 h-3.5" />
            <span>git init genesis</span>
          </div>
          <div className="flex items-center gap-3 my-auto">
            <div className="w-6 h-6 rounded-full bg-[#D2E823] text-[#09090B] flex items-center justify-center font-bold text-[10px]">
              C1
            </div>
            <div className="h-0.5 flex-1 bg-zinc-700" />
            <div className="w-6 h-6 rounded-full bg-white text-[#09090B] flex items-center justify-center font-bold text-[10px]">
              C2
            </div>
          </div>
          <span className="text-zinc-400 text-[10px]">[main 8f1c3a] commit verified</span>
        </div>
      ),
    },
    {
      id: '02',
      title: '02. BRANCHING',
      subtitle: 'Parallel Universes',
      desc: 'Create and switch isolate branches without disturbing main.',
      badge: 'LEVEL 02',
      badgeColor: 'bg-[#D2E823] text-[#09090B]',
      locked: false,
      graphic: (
        <div className="w-full h-44 bg-[#F8F4E8] rounded-[16px] border-2 border-[#09090B] p-4 flex flex-col justify-between text-left font-mono-brutal text-xs text-[#09090B] bg-dot-grid-subtle">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[11px] bg-black text-white px-2 py-0.5 rounded">feature/flux</span>
            <GitBranch className="w-4 h-4 text-[#09090B]" />
          </div>
          <div className="space-y-1.5 my-auto">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#09090B]" />
              <div className="h-0.5 w-16 bg-[#09090B]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#D2E823] border border-black" />
            </div>
            <div className="flex items-center gap-2 pl-4">
              <div className="w-0.5 h-4 bg-[#09090B]" />
              <div className="h-0.5 w-12 bg-[#09090B]" />
              <div className="w-3.5 h-3.5 rounded-full bg-black" />
            </div>
          </div>
          <span className="text-xs font-bold text-[#09090B]">HEAD -&gt; feature/flux</span>
        </div>
      ),
    },
    {
      id: '03',
      title: '03. MERGING',
      subtitle: 'DAG Synthesis',
      desc: 'Recombine branch timelines via 3-way recursive merge trees.',
      badge: 'LOCKED',
      badgeColor: 'bg-[#09090B] text-white',
      locked: true,
      graphic: (
        <div className="w-full h-44 bg-[#09090B] rounded-[16px] border-2 border-[#09090B] p-4 flex flex-col justify-between text-left font-mono-brutal text-xs text-[#F8F4E8] relative overflow-hidden">
          <div className="absolute inset-0 bg-[#09090B]/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 gap-2">
            <Lock className="w-6 h-6 text-[#D2E823]" />
            <span className="font-heading text-xs tracking-wider text-[#D2E823]">UNLOCKED AT LVL 3</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <GitPullRequest className="w-4 h-4" />
            <span>git merge dev</span>
          </div>
          <div className="h-10 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-zinc-600 text-[10px]">
            SYNTHESIZING TREE...
          </div>
          <span className="text-zinc-600 text-[10px]">Fast-forward evaluation</span>
        </div>
      ),
    },
    {
      id: '04',
      title: '04. CONFLICTS',
      subtitle: 'The Crucible',
      desc: 'Tackle merge conflicts with surgical accuracy and resolve HEAD markers.',
      badge: 'LOCKED',
      badgeColor: 'bg-[#09090B] text-white',
      locked: true,
      graphic: (
        <div className="w-full h-44 bg-[#F8F4E8] rounded-[16px] border-2 border-[#09090B] p-4 flex flex-col justify-between text-left font-mono-brutal text-xs text-[#09090B] relative overflow-hidden bg-dot-grid">
          <div className="absolute inset-0 bg-[#F8F4E8]/80 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 gap-2">
            <Lock className="w-6 h-6 text-[#09090B]" />
            <span className="font-heading text-xs tracking-wider text-[#09090B]">UNLOCKED AT LVL 4</span>
          </div>
          <div className="text-[10px] space-y-1 font-mono-brutal text-red-700">
            <div>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</div>
            <div>const target = &apos;main&apos;;</div>
            <div>=======</div>
            <div>const target = &apos;acid-ui&apos;;</div>
            <div>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature</div>
          </div>
          <span className="text-[10px] font-bold text-red-800">CONFLICT (content)</span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] flex flex-col font-body selection:bg-[#D2E823] selection:text-[#09090B] relative">
      {/* Viewport Noise Grain Overlay (3% opacity) */}
      <NoiseOverlay />

      {/* Interactive Lerp Blend Cursor */}
      <CustomCursor />

      {/* Auth State Listener for Auto-Redirect */}
      <AuthListener />

      {/* Sticky Neo-Brutalist Navigation */}
      <Navbar />

      {/* Hero Section (12-Column Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Sticker Badge */}
            <div className="inline-block px-4 py-1.5 bg-[#D2E823] text-[#09090B] font-mono-brutal font-bold text-xs uppercase border-2 border-[#09090B] shadow-hard-sm rounded-full -rotate-2 mb-6 cursor-default hover:rotate-0 transition-transform">
              ⚡ INTERACTIVE SANDBOX
            </div>

            {/* Massive Display Text with Glitch Hover */}
            <motion.h1
              whileHover={{
                x: [0, -2, 2, -2, 2, 0],
                y: [0, 2, -2, 1, -1, 0],
                transition: { duration: 0.25, repeat: Infinity },
              }}
              className="font-heading text-5xl sm:text-7xl lg:text-[6.5rem] xl:text-[7.8rem] leading-[0.85] text-[#09090B] tracking-tighter cursor-pointer select-none"
            >
              MASTER VERSION CONTROL
            </motion.h1>

            {/* Concise Description */}
            <p className="mt-8 text-base sm:text-xl font-medium text-[#09090B]/80 max-w-xl leading-relaxed">
              Ditch dry documentation. Explore realistic repository mechanics through high-octane visual sandboxes, interactive branches, and real-time command feedback.
            </p>

            {/* Massive Hard-Shadow CTA Button */}
            <div className="mt-10">
              <button
                onClick={handleCtaClick}
                className="group p-5 px-8 sm:px-10 bg-[#09090B] text-[#D2E823] font-heading text-base sm:text-lg tracking-tight rounded-[12px] border-2 border-[#09090B] shadow-hard-lg hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150 flex items-center gap-4 cursor-pointer active:scale-95"
              >
                <span>START YOUR JOURNEY</span>
                <div className="w-8 h-8 rounded-[8px] bg-[#D2E823] text-[#09090B] flex items-center justify-center border-2 border-[#09090B] group-hover:rotate-45 transition-transform duration-200">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex justify-center">
            {/* Primary Image Card: Mockup of Brutalist Terminal Window */}
            <div className="w-full max-w-md bg-[#09090B] border-2 border-[#09090B] rounded-[32px] p-6 shadow-hard-lg relative overflow-hidden text-[#F8F4E8]">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#D2E823] border border-black" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white border border-black" />
                  <div className="w-3.5 h-3.5 rounded-full bg-zinc-700 border border-black" />
                  <span className="ml-2 font-mono-brutal text-xs text-zinc-400">gitworld.sh</span>
                </div>
                <span className="font-mono-brutal text-[10px] bg-zinc-800 text-[#D2E823] px-2 py-0.5 rounded border border-zinc-700">
                  LIVE REPO
                </span>
              </div>

              {/* Terminal Body */}
              <div className="font-mono-brutal text-xs sm:text-sm space-y-3 text-zinc-300 pb-12">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-[#D2E823]">&gt;</span>
                  <span>git checkout -b feature/acid-storm</span>
                </div>
                <p className="text-[#D2E823] text-xs">
                  Switched to new branch &apos;feature/acid-storm&apos;
                </p>
                <div className="flex items-center gap-2 text-zinc-400 pt-1">
                  <span className="text-[#D2E823]">&gt;</span>
                  <span>git commit -m &quot;feat: brutalist engine&quot;</span>
                </div>
                <p className="text-white text-xs">
                  [feature/acid-storm 9a41b2] feat: brutalist engine ✨
                </p>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-400 mt-2">
                  1 file changed, 128 insertions(+)
                </div>
              </div>
            </div>

            {/* Overlapping Floating Asset Card (±10px y-axis float) */}
            <motion.div
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-8 -left-4 sm:-left-8 bg-[#F8F4E8] border-2 border-[#09090B] rounded-[20px] p-4 sm:p-5 shadow-hard-lg max-w-[260px] sm:max-w-[280px] z-20 cursor-pointer card-brutal-press"
            >
              <div className="flex items-center justify-between mb-3 border-b-2 border-[#09090B]/20 pb-2">
                <span className="font-mono-brutal text-[10px] font-bold text-[#09090B]">COMMIT NODE: 9a41b2</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D2E823] border border-black animate-ping" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#09090B] text-[#D2E823] flex items-center justify-center border-2 border-[#09090B]">
                  <GitCommit className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-heading text-xs text-[#09090B]">PARENT: main</p>
                  <p className="text-[11px] text-[#09090B]/70 font-bold">SHA: 8f3c401a</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Bento Grid Section */}
      <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-4 h-4 bg-[#D2E823] border-2 border-[#09090B] rotate-45" />
          <h2 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
            WHY GITWORLD?
          </h2>
        </div>

        {/* Bento Grid (Varied Aspect Ratios) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large 2x2 Card: VISUAL LEARNING (Spans 2 columns on desktop) */}
          <div className="md:col-span-2 bg-[#09090B] text-[#F8F4E8] border-2 border-[#09090B] rounded-[24px] p-8 sm:p-10 shadow-hard-lg relative overflow-hidden card-brutal-press flex flex-col justify-between min-h-[380px]">
            {/* Subtle Overlay Pattern at 40% opacity */}
            <div className="absolute inset-0 bg-grid-overlay opacity-40 mix-blend-overlay pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <span className="px-3 py-1 bg-[#D2E823] text-[#09090B] font-mono-brutal font-bold text-xs uppercase border-2 border-[#09090B] rounded-full">
                01 / CORE PRINCIPLE
              </span>
              <div className="w-12 h-12 rounded-[12px] bg-white text-[#09090B] flex items-center justify-center border-2 border-[#09090B] shadow-hard-sm">
                <Sparkles className="w-6 h-6 text-[#09090B]" />
              </div>
            </div>

            <div className="relative z-10 mt-12">
              <h3 className="font-heading text-3xl sm:text-5xl text-[#F8F4E8] tracking-tighter mb-4">
                VISUAL LEARNING
              </h3>
              <p className="font-body text-base sm:text-lg text-zinc-400 max-w-xl font-medium leading-relaxed">
                See your commits map out in real-time. Git is fundamentally a Directed Acyclic Graph (DAG) — we turn cryptic commit hashes into living, interactive branch diagrams.
              </p>
            </div>

            {/* Interactive graphical DAG mockup inside card */}
            <div className="relative z-10 pt-8 mt-6 border-t border-zinc-800 flex items-center gap-4 text-xs font-mono-brutal text-zinc-400">
              <span className="text-[#D2E823]">STATUS: ACTIVE DAG</span>
              <span>•</span>
              <span>LIVE TREE SYNCHRONIZATION</span>
            </div>
          </div>

          {/* Right Column with two 1x1 Small Cards */}
          <div className="flex flex-col gap-6">
            {/* Small 1x1 Card: INTERACTIVE SANDBOX */}
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-[24px] p-7 shadow-hard-lg relative overflow-hidden bg-dot-grid card-brutal-press flex-1 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center justify-between">
                <span className="font-mono-brutal text-[11px] font-bold text-[#09090B] bg-white px-2 py-0.5 rounded border border-[#09090B]">
                  02 / SANDBOX
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#D2E823] border-2 border-[#09090B] flex items-center justify-center shadow-hard-sm">
                  <Terminal className="w-4 h-4 text-[#09090B]" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-heading text-xl sm:text-2xl text-[#09090B] tracking-tighter mb-2">
                  INTERACTIVE SANDBOX
                </h3>
                <p className="text-xs sm:text-sm text-[#09090B]/80 font-medium">
                  Type real commands, get real visual feedback in a risk-free playground.
                </p>
              </div>
            </div>

            {/* Small 1x1 Card: STATE PERSISTENCE */}
            <div className="bg-[#F8F4E8] border-2 border-[#09090B] rounded-[24px] p-7 shadow-hard-lg relative overflow-hidden bg-dot-grid card-brutal-press flex-1 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-center justify-between">
                <span className="font-mono-brutal text-[11px] font-bold text-[#09090B] bg-white px-2 py-0.5 rounded border border-[#09090B]">
                  03 / STATE
                </span>
                <div className="w-9 h-9 rounded-lg bg-[#09090B] text-white border-2 border-[#09090B] flex items-center justify-center shadow-hard-sm">
                  <Layers className="w-4 h-4 text-[#D2E823]" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-heading text-xl sm:text-2xl text-[#09090B] tracking-tighter mb-2">
                  STATE PERSISTENCE
                </h3>
                <p className="text-xs sm:text-sm text-[#09090B]/80 font-medium">
                  Your repo travels with you across topics so every level builds on what you created.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Topics Section (Curriculum) */}
      <section id="curriculum" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 w-full">
        {/* Header with Navigation Arrows */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-[#09090B]">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 bg-[#09090B] border-2 border-[#09090B]" />
            <h2 className="font-heading text-3xl sm:text-5xl text-[#09090B] tracking-tighter">
              CURRICULUM
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollCurriculum('left')}
              className="p-3 bg-white hover:bg-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
              aria-label="Previous topic"
            >
              <ChevronLeft className="w-5 h-5 text-[#09090B]" />
            </button>
            <button
              onClick={() => scrollCurriculum('right')}
              className="p-3 bg-[#09090B] hover:bg-black text-[#D2E823] border-2 border-[#09090B] rounded-[8px] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer"
              aria-label="Next topic"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Cards Flex Container */}
        <div
          ref={curriculumScrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-6 pt-2 select-none"
        >
          {curriculumModules.map((item) => (
            <div
              key={item.id}
              onClick={() => !item.locked && handleCtaClick()}
              className={`min-w-[300px] sm:min-w-[340px] max-w-[340px] bg-white border-2 border-[#09090B] rounded-[24px] p-6 shadow-hard-lg flex flex-col justify-between transition-all duration-200 ${
                item.locked
                  ? 'grayscale opacity-60 cursor-not-allowed bg-zinc-100'
                  : 'cursor-pointer card-brutal-press hover:bg-[#F8F4E8]'
              }`}
            >
              {/* Graphic Mockup Area */}
              <div className="mb-6">{item.graphic}</div>

              {/* Text Info */}
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full font-mono-brutal font-bold text-[10px] border border-[#09090B] ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <span className="font-mono-brutal text-xs text-[#09090B]/60 font-bold">{item.subtitle}</span>
                </div>

                <h3 className="font-heading text-xl text-[#09090B] tracking-tight pt-1">
                  {item.title}
                </h3>

                <p className="text-xs text-[#09090B]/80 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t-2 border-[#09090B]/10 flex items-center justify-between">
                <span className="font-heading text-xs tracking-tight text-[#09090B]">
                  {item.locked ? 'LOCKED MODULE' : 'START MODULE'}
                </span>
                <div
                  className={`w-7 h-7 rounded-full border-2 border-[#09090B] flex items-center justify-center ${
                    item.locked ? 'bg-zinc-300 text-zinc-600' : 'bg-[#D2E823] text-[#09090B]'
                  }`}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full bg-[#09090B] text-[#F8F4E8] border-t-2 border-[#09090B] pt-16 pb-12 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b-2 border-zinc-800">
            {/* Brand and Newsletter (5 cols) */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-heading text-3xl text-white tracking-tighter">GITWORLD</span>
                <div className="w-3 h-3 bg-[#D2E823] border border-white" />
              </div>

              <p className="text-xs text-zinc-400 max-w-sm font-medium leading-relaxed">
                The unapologetic Neo-Brutalist interactive platform designed to teach version control through hands-on visual sandboxes.
              </p>

              {/* Newsletter / Updates Signup Form */}
              <div className="pt-2">
                <label className="block font-mono-brutal text-[11px] text-[#D2E823] mb-2 font-bold tracking-wider">
                  GET REPO DROPS &amp; QUEST ALERTS
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('Subscribed to GitWorld updates!');
                  }}
                  className="flex flex-col sm:flex-row gap-2 max-w-md"
                >
                  <input
                    type="email"
                    required
                    placeholder="dev@gitworld.sh"
                    className="flex-1 bg-transparent border-2 border-zinc-700 focus:border-[#D2E823] px-4 py-2.5 rounded-[8px] text-xs font-mono-brutal text-white outline-none placeholder:text-zinc-600 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#D2E823] text-[#09090B] font-heading text-xs tracking-tight rounded-[8px] border-2 border-[#09090B] shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer whitespace-nowrap"
                  >
                    SUBSCRIBE
                  </button>
                </form>
              </div>
            </div>

            {/* 3 Columns: Platform, Topics, Social (7 cols total) */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-medium">
              {/* Column 1: Platform */}
              <div className="space-y-4">
                <span className="font-mono-brutal text-[11px] font-bold text-[#D2E823] uppercase tracking-wider block">
                  // PLATFORM
                </span>
                <ul className="space-y-2.5 text-zinc-400">
                  <li>
                    <a href="#philosophy" className="hover:text-[#D2E823] transition-colors">Philosophy</a>
                  </li>
                  <li>
                    <a href="#curriculum" className="hover:text-[#D2E823] transition-colors">Curriculum</a>
                  </li>
                  <li>
                    <a href="/journey" className="hover:text-[#D2E823] transition-colors flex items-center gap-1">
                      <span>Journey Map</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <span onClick={() => setIsAuthOpen(true)} className="hover:text-[#D2E823] transition-colors cursor-pointer">
                      Account Sign In
                    </span>
                  </li>
                </ul>
              </div>

              {/* Column 2: Topics */}
              <div className="space-y-4">
                <span className="font-mono-brutal text-[11px] font-bold text-[#D2E823] uppercase tracking-wider block">
                  // TOPICS
                </span>
                <ul className="space-y-2.5 text-zinc-400">
                  <li>
                    <span className="hover:text-[#D2E823] transition-colors cursor-pointer">01. Git Init &amp; Staging</span>
                  </li>
                  <li>
                    <span className="hover:text-[#D2E823] transition-colors cursor-pointer">02. Branch Isolation</span>
                  </li>
                  <li>
                    <span className="hover:text-[#D2E823] transition-colors cursor-pointer">03. Fast-Forward Merges</span>
                  </li>
                  <li>
                    <span className="hover:text-[#D2E823] transition-colors cursor-pointer">04. Resolving Conflicts</span>
                  </li>
                </ul>
              </div>

              {/* Column 3: Social */}
              <div className="space-y-4 col-span-2 sm:col-span-1">
                <span className="font-mono-brutal text-[11px] font-bold text-[#D2E823] uppercase tracking-wider block">
                  // SOCIAL &amp; SOURCE
                </span>
                <ul className="space-y-2.5 text-zinc-400">
                  <li>
                    <a
                      href="https://github.com/DHRUV00625/GitWorld"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#D2E823] transition-colors flex items-center gap-1"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://git-scm.com"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#D2E823] transition-colors"
                    >
                      Official Git SCM
                    </a>
                  </li>
                  <li>
                    <span className="hover:text-[#D2E823] transition-colors cursor-pointer">Discord Community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright & Meta */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-brutal text-zinc-500 gap-3">
            <p>© 2026 GITWORLD // ALL RIGHTS RESERVED.</p>
            <p className="text-[#D2E823]/80">NEO-BRUTALIST ACID EDITION // V2.0</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="signup"
      />
    </div>
  );
}
