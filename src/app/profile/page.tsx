'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setName(profileData.name || '')
        setGrade(profileData.grade || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    await supabase
      .from('profiles')
      .update({ name, grade })
      .eq('user_id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          Pathway<span className="text-indigo-400">IQ</span>
        </a>
        <div className="flex gap-4 items-center">
          
            href="/dashboard"
            className="text-white/50 hover:text-white text-sm transition"
          >
            Dashboard
          </a>
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white text-sm transition"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-8 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-1">Your Profile</h1>
          <p className="text-white/40 text-sm">Update your personal info here.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-6">
          {/* Email (read only) */}
          <div>
            <label className="text-sm text-white/60 mb-1 block">Email</label>
            <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/40 text-sm">
              {user?.email}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-white/60 mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition"
            />
          </div>

          {/* Grade */}
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

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving || !name || !grade}
            className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>

          {/* Danger zone */}
          <div className="border-t border-white/10 pt-6">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-4">
              Account
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 text-white/50 hover:text-red-400 font-semibold py-3 rounded-lg transition text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}