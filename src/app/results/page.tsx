'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function generate() {
      const answersRaw = searchParams.get('answers')
      if (!answersRaw) {
        router.push('/quiz')
        return
      }

      try {
        const answers = JSON.parse(answersRaw)
        const res = await fetch('/api/generate-roadmap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers }),
})
const json = await res.json()
console.log('API response:', json)
if (!json.success) throw new Error(json.error)
setData(json.data)
      } catch (e) {
        setError('Failed to generate your roadmap. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    generate()
  }, [])

  async function handleSelect(career: any) {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: saved } = await supabase
      .from('roadmaps')
      .insert({
        user_id: user.id,
        career_matches: data.career_matches,
        selected_career: career.title,
        full_plan: data,
      })
      .select()
      .single()

    router.push(`/roadmap/${saved.id}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold">Building your roadmap...</p>
          <p className="text-white/40 text-sm mt-1">This takes about 15 seconds</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <button
          onClick={() => router.push('/quiz')}
          className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg transition"
        >
          Try Again
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
            Your Results
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Your Career Matches</h1>
          <p className="text-white/50">
            Based on your answers, here are your top 3 matches. Select one to
            generate your full 4-year roadmap.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {data?.career_matches?.map((career: any, i: number) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold leading-tight">{career.title}</h2>
                <span className="bg-indigo-500/20 text-indigo-300 text-sm font-bold px-3 py-1 rounded-full shrink-0 ml-2">
                  {career.fit_score}%
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed flex-1">
                {career.description}
              </p>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between text-white/40">
                  <span>Salary</span>
                  <span className="text-white/70">{career.salary_range}</span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>Growth</span>
                  <span className="text-white/70">{career.growth_outlook}</span>
                </div>
              </div>
              <button
                onClick={() => handleSelect(career)}
                disabled={saving}
                className="w-full bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-semibold py-3 rounded-lg transition text-sm"
              >
                {saving ? 'Saving...' : 'Build My Roadmap →'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading...</p>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
