'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function PricingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [months, setMonths] = useState(1)

  async function handleUpgrade() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/signup'); return }

    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ months }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setLoading(false)
    }
  }

  const total = (12 * months).toFixed(2)

  const freeFeatures = [
    '1 roadmap generation',
    '4-year personalized plan',
    'University matching',
    'Progress tracker',
    'Basic scholarships & internships',
  ]

  const lockedFeatures = [
    'Essay Brainstormer',
    'Interview Prep',
    'Financial Aid Estimator',
    'Compare Careers',
    'Roadmap Sharing',
    'Unlimited regenerations',
  ]

  const proFeatures = [
    'Everything in Free',
    'Unlimited roadmap generations',
    'College Essay Brainstormer',
    'Interview Prep',
    'Financial Aid Estimator',
    'Compare Careers',
    'Roadmap Sharing',
    'Priority AI generation',
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">Pathway<span className="text-indigo-400">IQ</span></a>
        <div className="flex gap-4">
          <a href="/login" className="text-white/50 hover:text-white text-sm transition">Log in</a>
          <a href="/signup" className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Sign up free</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">Simple Pricing</h1>
          <p className="text-white/50 text-lg">Start free. Upgrade when you're ready.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-1">Free</h2>
            <p className="text-white/40 text-sm mb-6">Get started, no credit card needed</p>
            <div className="text-4xl font-extrabold mb-8">$0<span className="text-white/30 text-lg font-normal">/mo</span></div>
            <ul className="flex flex-col gap-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-white/70"><span className="text-indigo-400">✓</span>{f}</li>
              ))}
              {lockedFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-white/30 line-through"><span className="text-white/20">✗</span>{f}</li>
              ))}
            </ul>
            <a href="/signup" className="block w-full text-center bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition">Get Started Free</a>
          </div>

          {/* Pro */}
          <div className="bg-indigo-500/10 border-2 border-indigo-400 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">MOST POPULAR</div>
            <h2 className="text-2xl font-bold mb-1">Pro</h2>
            <p className="text-white/40 text-sm mb-4">Everything you need to succeed</p>

            <div className="text-4xl font-extrabold mb-2">
              ${total}
              <span className="text-white/30 text-lg font-normal"> / {months} {months === 1 ? 'month' : 'months'}</span>
            </div>
            <p className="text-white/30 text-xs mb-4">$12/month</p>

            {/* Month selector */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-white/50 text-xs mb-3">How many months?</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setMonths(Math.max(1, months - 1))} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition">−</button>
                <span className="text-xl font-bold w-8 text-center">{months}</span>
                <button onClick={() => setMonths(Math.min(12, months + 1))} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold transition">+</button>
                <div className="flex gap-1 ml-2">
                  {[1, 3, 6, 12].map((m) => (
                    <button key={m} onClick={() => setMonths(m)} className={`px-2 py-1 rounded text-xs font-medium transition ${months === m ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/40 hover:text-white'}`}>{m}mo</button>
                  ))}
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-3 mb-8">
              {proFeatures.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-white/80"><span className="text-indigo-400">✓</span>{f}</li>
              ))}
            </ul>
            <button onClick={handleUpgrade} disabled={loading} className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-semibold py-3 rounded-lg transition">
              {loading ? 'Redirecting...' : `Upgrade for $${total} →`}
            </button>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-8">Cancel anytime. No hidden fees. Secure payments via Stripe.</p>
      </div>
    </main>
  )
}
