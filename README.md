# ⚡ GitWorld

> **Master Git visually. Instead of sifting through walls of dry documentation, GitWorld combines hands-on terminal simulation with real-time, animated vector visualizations to show you exactly how your branch history evolves**.

🌐 **Live Application**: [https://git-world-is-born.vercel.app](https://git-world-is-born.vercel.app)

---

## 🚀 Experience the Live App

Visit **[https://git-world-is-born.vercel.app](https://git-world-is-born.vercel.app)** to start your journey:
- **Interactive Journey Timeline**: Scroll through the zigzag curriculum tracking stages from `git init` to distributed remote workflows.
- **Failsafe Terminal Sandbox**: Type commands in a protected emulator featuring Levenshtein-based smart typo detection and instant syntax guidance.
- **Real-Time Orthogonal SVG Visualizer**: Watch commits and branch forks draw crisp 90° vector DAG timelines dynamically upon command execution.
- **Supabase Cloud Ledger**: Authenticate and persist your stage completions, custom repo names, and active branch pointers securely in real time.

---

## 🎨 Design System: Neo-Brutalist "Acid"

GitWorld strictly adheres to a stark, high-contrast Neo-Brutalist aesthetic:
- **Background**: `#F8F4E8` (Warm Canvas)
- **Heavy Ink & Borders**: `#09090B` (2px solid borders with 0-blur hard drop shadows: `4px 4px 0px 0px #09090B` and `8px 8px 0px 0px #09090B`)
- **Accents**: `#D2E823` (Acid Yellow-Green) & `#FF3333` (Alerts & Root Git Timeline)
- **Typography**: `Dela Gothic One` (Headers & Badges) + `Space Grotesk` (Body & Terminal Monospace)

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Design Tokens
- **Animations**: Framer Motion
- **State Management**: Zustand (Local + Cloud Synchronized)
- **Backend & Auth**: Supabase (PostgreSQL with Row Level Security & Triggers)
- **Hosting**: [Vercel](https://git-world-is-born.vercel.app)

---

## 💻 Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/DHRUV00625/GitWorld.git
cd GitWorld
npm install
```

Configure your local environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

Live production build deployed at:  
👉 **[https://git-world-is-born.vercel.app](https://git-world-is-born.vercel.app)**
