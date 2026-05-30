import Hero from '@/components/ui/animated-shader-hero'

export default function LandingPage() {
  return (
    <main className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white overflow-x-hidden">

      {/* Animated Hero */}
      <Hero
        trustBadge={{ text: 'Free for every high schooler · No credit card needed', icons: ['🎯'] }}
        headline={{ line1: 'Your personalized', line2: '4-year roadmap' }}
        subtitle="Answer 12 questions. Get a fully personalized high school plan — courses, APs, universities, scholarships, internships, and more."
        buttons={{
          primary: { text: 'Build My Roadmap →', href: '/signup' },
          secondary: { text: 'Log In', href: '/login' },
        }}
      />

      {/* Nav overlay on top of hero */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/20 backdrop-blur-md border-b border-white/5">
        <span className="text-xl font-bold tracking-tight">Pathway<span className="text-indigo-400">IQ</span></span>
        <div className="flex gap-4 items-center">
          <a href="/pricing" className="text-sm text-white/60 hover:text-white transition">Pricing</a>
          <a href="/login" className="text-sm text-white/60 hover:text-white transition">Log in</a>
          <a href="/signup" className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2 rounded-lg transition">Get Started Free</a>
        </div>
      </div>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-bold">Three steps to your future</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Take the Quiz', desc: 'Answer 12 adaptive questions about your interests, strengths, grades, and goals. Takes under 5 minutes.' },
            { step: '02', title: 'Get Matched', desc: 'AI matches you to 3 career paths with fit scores based on your unique answers and situation.' },
            { step: '03', title: 'Get Your Roadmap', desc: 'Receive a full 4-year personalized plan with everything you need from freshman year to graduation.' },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/3 border border-white/8 rounded-2xl p-8 hover:bg-white/5 transition">
              <div className="text-6xl font-extrabold text-indigo-500/20 mb-4">{item.step}</div>
              <h3 className="font-bold text-xl mb-3">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl font-bold mb-4">Everything in one place</h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">One roadmap. Every resource. Built specifically around your goals.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: '🎯', title: 'Career Matching', desc: 'AI matches you to careers based on your interests, strengths, and goals with a precise fit score.' },
            { icon: '🗓️', title: '4-Year Plan', desc: 'Grade-by-grade roadmap with courses, APs, extracurriculars, passion projects, and summer plans.' },
            { icon: '🏫', title: 'University Fit', desc: 'See which universities match your profile and your realistic admit likelihood based on your grades.' },
            { icon: '💰', title: 'Scholarships', desc: 'Curated scholarships relevant to your career path, location, and background with tips to win.' },
            { icon: '💼', title: 'Internships', desc: 'Real internship and fellowship opportunities matched to your grade level and career goals.' },
            { icon: '✍️', title: 'Essay Brainstormer', desc: '5 personalized college essay angles based on your story, with hooks, outlines, and tips.' },
            { icon: '🎤', title: 'Interview Prep', desc: 'Real interview questions for your target career with sample answers and expert tips.' },
            { icon: '💵', title: 'Financial Aid', desc: 'University cost breakdowns, aid types, and a personalized financial aid timeline.' },
            { icon: '✅', title: 'Progress Tracker', desc: 'Check off goals and milestones as you complete them. Watch your progress bar grow.' },
          ].map((f) => (
            <div key={f.title} className="group bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grade sections */}
      <section className="max-w-5xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">For every student</p>
          <h2 className="text-4xl font-bold">Meets you where you are</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { grade: '7th – 8th Grade', emoji: '🌱', desc: 'Start early. Build habits, explore interests, and get ahead before high school even begins.' },
            { grade: '9th – 10th Grade', emoji: '📚', desc: 'Set the foundation. Right courses, right activities, right mindset from the very first day.' },
            { grade: '11th – 12th Grade', emoji: '🎓', desc: 'Execute the plan. College apps, scholarships, interviews, and May 1 decision day.' },
          ].map((item) => (
            <div key={item.grade} className="bg-white/3 border border-white/8 rounded-2xl p-8 text-center hover:bg-white/5 transition">
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="font-bold text-indigo-300 text-lg mb-3">{item.grade}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-3xl mx-auto px-8 pb-32 text-center">
        <div className="bg-indigo-500/8 border border-indigo-400/15 rounded-3xl p-14">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl font-bold mb-4">Start free. Upgrade anytime.</h2>
          <p className="text-white/40 mb-3 text-sm">Free plan includes your full 4-year roadmap. Pro unlocks essay brainstorming, interview prep, financial aid, and more.</p>
          <div className="flex justify-center gap-6 mb-8 text-sm">
            <span className="text-white/60">Free — $0/mo</span>
            <span className="text-indigo-300 font-semibold">Pro — $12/mo</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl transition">Get Started Free →</a>
            <a href="/pricing" className="inline-block bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition">See Pricing</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 px-8 py-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-lg font-bold">Pathway<span className="text-indigo-400">IQ</span></span>
        <p className="text-white/20 text-xs">Built for the EduTech track. Free forever for students.</p>
        <div className="flex gap-6 text-white/30 text-sm">
          <a href="/signup" className="hover:text-white transition">Sign Up</a>
          <a href="/login" className="hover:text-white transition">Log In</a>
          <a href="/pricing" className="hover:text-white transition">Pricing</a>
          <a href="/compare" className="hover:text-white transition">Compare</a>
        </div>
      </footer>
    </main>
  )
}
