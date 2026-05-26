'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const [{ data: profileData }, { data: roadmapData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('roadmaps').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      setProfile(profileData)
      setRoadmaps(roadmapData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleDelete(id: string) {
    await supabase.from('roadmaps').delete().eq('id', id)
    setRoadmaps((prev) => prev.filter((r) => r.id !== id))
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
          
            href="/profile"
            className="text-white/50 hover:text-white text-sm transition"
          >
            Profile
          </a>
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white text-sm transition"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold mb-1">
            Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-white/40 text-sm">
            {roadmaps.length === 0
              ? "You haven't built a roadmap yet."
              : `You have ${roadmaps.length} saved roadmap${roadmaps.length > 1 ? 's' : ''}.`}
          </p>
        </div>

        {/* New Roadmap CTA */}
        <button
          onClick={() => router.push('/quiz')}
          className="mb-10 flex items-center gap-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          <span className="text-xl">+</span>
          Build a New Roadmap
        </button>

        {/* Roadmaps */}
        {roadmaps.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-4xl mb-4">🗺️</p>
            <h2 className="text-xl font-semibold mb-2">No roadmaps yet</h2>
            <p className="text-white/40 text-sm mb-6">
              Take the quiz to generate your personalized 4-year plan.
            </p>
            <button
              onClick={() => router.push('/quiz')}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Take the Quiz →
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {roadmaps.map((r) => (
              <div
                key={r.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{r.selected_career}</h2>
                    <p className="text-white/40 text-xs">
                      Created{' '}
                      {new Date(r.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-white/20 hover:text-red-400 transition text-sm"
                  >
                    Delete
                  </button>
                </div>

                {/* Career match pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {r.career_matches?.slice(0, 3).map((c: any, i: number) => (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        c.title === r.selected_career
                          ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {c.title} · {c.fit_score}%
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/roadmap/${r.id}`)}
                  className="w-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition text-sm"
                >
                  View Roadmap →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}