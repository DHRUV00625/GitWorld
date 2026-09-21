'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function Footer({ onSignInClick }) {
  return (
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

          {/* 4 Columns: Platform, Topics, Social, Founder (7 cols total) */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-medium">
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
                  <span onClick={onSignInClick} className="hover:text-[#D2E823] transition-colors cursor-pointer">
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
            <div className="space-y-4">
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

            {/* Column 4: Founder */}
            <div className="space-y-4">
              <span className="font-mono-brutal text-[11px] font-bold text-[#D2E823] uppercase tracking-wider block">
                // FOUNDER
              </span>
              <div className="flex flex-col space-y-4">
                <p className="font-space text-sm text-gray-300">
                  GitWorld founder - Dhruv Sharma
                </p>
                <p className="font-space text-sm text-gray-300">
                  For any queries contact me at:<br />
                  <a
                    href="mailto:dhruv.official002@gmail.com"
                    className="text-[#D2E823] hover:text-white hover:underline transition-colors mt-1 inline-block"
                  >
                    dhruv.official002@gmail.com
                  </a>
                </p>
              </div>
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
  );
}
