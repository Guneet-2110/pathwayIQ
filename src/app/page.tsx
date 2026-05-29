export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="text-2xl font-bold tracking-tight">
          Pathway<span className="text-indigo-400">IQ</span>
        </span>
        <div className="flex gap-4">
          <a href="/pricing" className="px-4 py-2 text-sm text-white/70 hover:text-white transition">Pricing</a>
          <a href="/login" className="px-4 py-2 text-sm text-white/70 hover:text-white transition">Log in</a>
          <a href="/signup" className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 rounded-lg transition font-medium">Get Started Free</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-8 pt-20 pb-24 text-center">
        <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
          Free for every high schooler
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Your personalized
          <br />
          <span className="text-indigo-400">4-year roadmap</span>
          <br />
          starts here
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Answer 12 questions. Get a fully personalized high school plan — courses, APs, universities, scholarships, internships, books, and more. Built by students, for students.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="/signup" className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
            Build My Roadmap →
          </a>
          <a href="/login" className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
            Log In
          </a>
        </div>
        <p className="text-white/30 text-sm">No credit card. No fluff. Takes 5 minutes.</p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Take the Quiz', desc: 'Answer 12 adaptive questions about your interests, strengths, grades, and goals. Takes under 5 minutes.' },
            { step: '02', title: 'Get Matched', desc: 'AI matches you to 3 career paths with fit scores based on your unique profile.' },
            { step: '03', title: 'Get Your Roadmap', desc: 'Receive a full 4-year personalized plan with everything you need to succeed.' },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-5xl font-extrabold text-indigo-500/20 mb-4">{item.step}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Everything you need</h2>
        <p className="text-white/40 text-center mb-12 text-sm">One roadmap. Every resource. Zero cost.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🎯', title: 'Career Matching', desc: 'AI matches you to careers based on your interests, strengths, and goals with a fit score.' },
            { icon: '🗓️', title: '4-Year Plan', desc: 'Grade-by-grade roadmap with courses, APs, extracurriculars, and summer plans.' },
            { icon: '🏫', title: 'University Fit', desc: 'See which universities match your profile and your realistic admit likelihood.' },
            { icon: '💰', title: 'Scholarships', desc: 'Curated scholarships relevant to your career path with tips to stand out.' },
            { icon: '💼', title: 'Internships', desc: 'Real internship and fellowship opportunities matched to your grade and goals.' },
            { icon: '📚', title: 'Resources', desc: 'Books, YouTube channels, and online courses handpicked for your path.' },
            { icon: '✅', title: 'Progress Tracker', desc: 'Check off goals and milestones as you complete them. Track your progress over time.' },
            { icon: '📄', title: 'PDF Export', desc: 'Download your full roadmap as a PDF to share with parents or counselors.' },
            { icon: '📊', title: 'Compare Careers', desc: 'Compare two career paths side by side — salary, universities, difficulty, and more.' },
          ].map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-4xl mx-auto px-8 pb-24 text-center">
        <h2 className="text-3xl font-bold mb-4">Built for every high schooler</h2>
        <p className="text-white/50 mb-12 max-w-xl mx-auto text-sm leading-relaxed">
          Whether you're in 7th grade just starting to think about your future, or a senior finalizing college apps — PathwayIQ meets you where you are.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { grade: '7th–8th Grade', desc: 'Start early. Build habits, explore interests, and get ahead before high school.' },
            { grade: '9th–10th Grade', desc: 'Set the foundation. Right courses, right activities, right mindset from day one.' },
            { grade: '11th–12th Grade', desc: 'Execute the plan. College apps, scholarships, internships, and decision day.' },
          ].map((item) => (
            <div key={item.grade} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-indigo-300 mb-2">{item.grade}</h3>
              <p className="text-white/50 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-24 px-8">
        <div className="max-w-2xl mx-auto bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to find your path?</h2>
          <p className="text-white/50 mb-8 text-sm">Join thousands of students building their future with PathwayIQ.</p>
          <a href="/signup" className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
            Get Started Free →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-lg font-bold">Pathway<span className="text-indigo-400">IQ</span></span>
        <p className="text-white/30 text-xs">Built for the EduTech track. Free forever.</p>
        <div className="flex gap-6 text-white/40 text-sm">
          <a href="/signup" className="hover:text-white transition">Sign Up</a>
          <a href="/login" className="hover:text-white transition">Log In</a>
          <a href="/pricing" className="hover:text-white transition">Pricing</a>
          <a href="/compare" className="hover:text-white transition">Compare</a>
        </div>
      </footer>
    </main>
  )
}
