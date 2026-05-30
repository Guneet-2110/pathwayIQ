import Hero from '@/components/ui/animated-shader-hero'

export default function LandingPage() {
  return (
    <main className="text-white overflow-x-hidden" style={{background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0a2e 25%, #0a0f2e 50%, #080a20 75%, #050510 100%)'}}>

      {/* Fixed Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-black/30 backdrop-blur-md border-b border-white/5">
        <span className="text-xl font-bold tracking-tight">Pathway<span className="text-indigo-400">IQ</span></span>
        <div className="flex gap-4 items-center">
          <a href="/pricing" className="text-sm text-white/50 hover:text-white transition">Pricing</a>
          <a href="/login" className="text-sm text-white/50 hover:text-white transition">Log in</a>
          <a href="/signup" className="text-sm bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-4 py-2 rounded-lg transition">Get Started Free</a>
        </div>
      </div>

      {/* Animated Shader Hero */}
      <Hero
        trustBadge={{ text: 'Free for every high schooler · No credit card needed', icons: ['🎯'] }}
        headline={{ line1: 'Your personalized', line2: '4-year roadmap' }}
        subtitle="Answer 12 questions. Get a fully personalized high school plan — courses, APs, universities, scholarships, internships, and more."
        buttons={{
          primary: { text: 'Build My Roadmap →', href: '/signup' },
          secondary: { text: 'Log In', href: '/login' },
        }}
      />

      {/* How it works */}
      <section className="relative max-w-5xl mx-auto px-8 py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-purple-950/10 to-transparent pointer-events-none rounded-3xl" />
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">How it works</p>
          <h2 className="text-4xl font-bold">Three steps to your future</h2>
          <p className="text-white/30 text-sm mt-3 max-w-lg mx-auto">No counselor appointments. No expensive courses. Just a plan built around you.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Take the Quiz', desc: '12 questions about your interests, strengths, grades, and goals. Honest answers get better results.' },
            { step: '02', title: 'See Your Matches', desc: 'Three career paths ranked by how well they fit your answers — with salary ranges and growth outlooks.' },
            { step: '03', title: 'Follow the Plan', desc: 'A year-by-year breakdown of what to study, join, apply for, and read. Updated to your grade level.' },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/3 border border-white/8 rounded-2xl p-8 hover:bg-indigo-500/5 hover:border-indigo-500/15 transition-all duration-300 group">
              <div className="text-6xl font-extrabold text-indigo-500/15 mb-5 group-hover:text-indigo-500/25 transition">{item.step}</div>
              <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      {/* What you get */}
      <section className="max-w-6xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">What's included</p>
          <h2 className="text-4xl font-bold mb-3">Built around your actual life</h2>
          <p className="text-white/30 text-sm max-w-lg mx-auto">Not generic advice. A plan that knows your grade, your location, your goals, and what you're working with.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: '🗓️', title: 'Year-by-year plan', desc: 'Freshman through senior year. What courses to take, what to do each summer, what to build.' },
            { icon: '🏫', title: 'University matching', desc: 'Schools that actually fit your profile, with realistic admit chances and what makes each one worth considering.' },
            { icon: '💰', title: 'Scholarships', desc: 'Opportunities that match your background and goals — not a generic database dump.' },
            { icon: '💼', title: 'Internships', desc: 'Programs you can realistically apply to at your current grade level, with guidance on how to stand out.' },
            { icon: '📚', title: 'Books and courses', desc: 'Specific titles and platforms that matter for your path. Not a reading list — a starting point.' },
            { icon: '📊', title: 'AP and test strategy', desc: 'Which exams to take, when to take them, and what scores to aim for based on your target schools.' },
            { icon: '✍️', title: 'Essay angles', desc: 'Five specific angles for your college essays based on your story — with opening hooks and what to include.' },
            { icon: '🎤', title: 'Interview prep', desc: 'Questions interviewers actually ask for your target field, with sample answers you can adapt.' },
            { icon: '💵', title: 'Financial picture', desc: 'What your target schools actually cost, what aid is available, and when to apply for it.' },
          ].map((f) => (
            <div key={f.title} className="group bg-white/2 border border-white/6 rounded-2xl p-6 hover:bg-indigo-500/5 hover:border-indigo-500/15 transition-all duration-300">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/50 transition">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      {/* Grade sections */}
      <section className="max-w-5xl mx-auto px-8 py-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-3">Who it's for</p>
          <h2 className="text-4xl font-bold">Wherever you are right now</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              grade: '7th and 8th grade',
              emoji: '🌱',
              desc: 'Most students wait until junior year to think about any of this. Starting now means building habits, trying things, and arriving at high school with a direction — not scrambling to find one.',
            },
            {
              grade: '9th and 10th grade',
              emoji: '📚',
desc: "The courses you take freshman and sophomore year shape what's available later. The extracurriculars you start now have time to actually go somewhere. This is when the plan matters most.",            },
            {
              grade: '11th and 12th grade',
              emoji: '🎓',
              desc: 'College apps, scholarship deadlines, financial aid forms, and a May 1 decision. A lot happens in a short window. Having a checklist and a timeline makes the difference.',
            },
          ].map((item) => (
            <div key={item.grade} className="bg-white/2 border border-white/6 rounded-2xl p-8 hover:bg-indigo-500/5 hover:border-indigo-500/15 transition-all duration-300">
              <div className="text-3xl mb-5">{item.emoji}</div>
              <h3 className="font-semibold text-indigo-300 text-lg mb-4">{item.grade}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-8 py-32 text-center">
        <p className="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">Pricing</p>
        <h2 className="text-4xl font-bold mb-4">Start free</h2>
        <p className="text-white/40 mb-3 text-sm max-w-md mx-auto">The free plan includes your full 4-year roadmap. Pro adds essay brainstorming, interview prep, financial aid estimates, and more.</p>
        <div className="flex justify-center gap-8 mb-10 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">$0</div>
            <div className="text-white/30 text-xs">Free plan</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-300 mb-1">$12</div>
            <div className="text-white/30 text-xs">Pro / month</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => window.location.href='/signup'} className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl transition">Get Started Free →</button>
          <button onClick={() => window.location.href='/pricing'} className="inline-block bg-white/5 hover:bg-white/8 border border-white/8 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-xl transition">See what's in Pro</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/6 px-8 py-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-lg font-bold">Pathway<span className="text-indigo-400">IQ</span></span>
        <p className="text-white/15 text-xs">Free for students. Built for the EduTech track.</p>
        <div className="flex gap-6 text-white/25 text-sm">
          <button onClick={() => window.location.href='/signup'} className="hover:text-white transition">Sign Up</button>
          <button onClick={() => window.location.href='/login'} className="hover:text-white transition">Log In</button>
          <button onClick={() => window.location.href='/pricing'} className="hover:text-white transition">Pricing</button>
          <button onClick={() => window.location.href='/compare'} className="hover:text-white transition">Compare</button>
        </div>
      </footer>
    </main>
  )
}
