'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError('')

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        name,
        grade,
      })
    }

    router.push('/quiz')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold tracking-tight">
            Pathway<span className="text-indigo-400">IQ</span>
          </a>
          <p className="text-white/50 mt-2 text-sm">Create your free account</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-4">
          <div>
            <label className="text-sm text-white/60 mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Johnson"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@email.com"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-1 block">Current Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-400 transition"
            >
              <option value="" className="bg-slate-900">Select grade</option>
              <option value="8" className="bg-slate-900">8th Grade (incoming freshman)</option>
              <option value="9" className="bg-slate-900">9th Grade (Freshman)</option>
              <option value="10" className="bg-slate-900">10th Grade (Sophomore)</option>
              <option value="11" className="bg-slate-900">11th Grade (Junior)</option>
              <option value="12" className="bg-slate-900">12th Grade (Senior)</option>
            </select>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading || !name || !email || !password || !grade}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

          <p className="text-center text-white/40 text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-400 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}