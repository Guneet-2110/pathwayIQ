export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <span className="text-2xl font-bold tracking-tight">
          Pathway<span className="text-indigo-400">IQ</span>
        </span>
        <div className="flex gap-4">
          
            href="/login"
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition"
          >
            Log in
          </a>
          
            href="/signup"
            className="px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-400 rounded-lg transition font-medium"
          >
            Get Started Free
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-32 text-center">
        <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
          Built for high schoolers
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Your personalized
          <span className="text-indigo-400"> 4-year roadmap</span>
          <br />to the career you want
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
          Answer 12 questions. Get a fully personalized plan — courses, APs,
          universities, scholarships, internships, books, and more. Free,
          forever.
        </p>
        
          href="/signup"
          className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
        >
          Build My Roadmap →
        </a>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 pb-32 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: "🎯",
            title: "Career Matching",
            desc: "AI matches you to careers based on your interests, strengths, and goals — with a fit score.",
          },
          {
            icon: "🗓️",
            title: "4-Year Plan",
            desc: "Grade-by-grade roadmap with courses, APs, extracurriculars, and summer plans.",
          },
          {
            icon: "🏫",
            title: "University Fit",
            desc: "See which universities match your profile and your realistic admit likelihood.",
          },
          {
            icon: "💰",
            title: "Scholarships",
            desc: "Curated scholarships and internships relevant to your career path.",
          },
          {
            icon: "📚",
            title: "Resources",
            desc: "Books, YouTube channels, and online courses handpicked for your path.",
          },
          {
            icon: "🧠",
            title: "Life Skills",
            desc: "Time management, stress, and money advice tailored to your situation.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center pb-24 px-8">
        <h2 className="text-3xl font-bold mb-4">Ready to find your path?</h2>
        <p className="text-white/50 mb-8">
          Takes 5 minutes. No credit card. No fluff.
        </p>
        
          href="/signup"
          className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition"
        >
          Get Started Free →
        </a>
      </section>
    </main>
  )
}