# GitWorld

An interactive Next.js 14 application built with Tailwind CSS, Framer Motion, and Supabase SSR authentication.

## Features
- **Interactive Gamified Quests**: Learn Git & GitHub commands through visual RPG-style quests.
- **Supabase SSR Auth**: Secure authentication flow with Login and Sign Up modals.
- **Journey Map Dashboard**: Track your XP, completed quests, and level progress at `/journey`.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Add your Supabase credentials to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
