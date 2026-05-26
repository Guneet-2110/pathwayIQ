# PathwayIQ

A personalized 4-year high school roadmap generator powered by Gemini AI.

## What it does

Students answer 12 adaptive questions about their interests, strengths, and goals.
PathwayIQ generates a fully personalized plan including:

- Career matches with fit scores
- Grade-by-grade course and AP recommendations
- Extracurriculars and passion projects
- Summer programs and activities
- University list with admit likelihood
- Scholarships and internships
- Books, YouTube channels, and online courses
- Time, stress, and money management advice
- Standardized test recommendations

## Stack

- Next.js 15 (App Router)
- Supabase (Auth + Postgres)
- Gemini 1.5 Flash (AI generation)
- Tailwind CSS
- Vercel (hosting)

## Environment Variables

Create a `.env.local` file with:
NEXT_PUBLIC_SUPABASE_URL=https://zedocnlgwfsrbxdyyjko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZG9jbmxnd2ZzcmJ4ZHl5amtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTcyODEsImV4cCI6MjA5NTM5MzI4MX0.Tu1XQWT2wcXpPwCqp7peTgsklwXpJNMoMljflW3cNhE
GEMINI_API_KEY=AIzaSyAuwrK9sRdYnZnLEMGAXXw9XM9KUthO5Lc

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Deployed on Vercel. Push to main branch to trigger auto-deploy.