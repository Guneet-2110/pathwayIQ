'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ComparePage() {
  const supabase = createClient()
  const router = useRouter()
  const [roadmaps, setRoadmaps] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setRoadmaps(data || [])
      setLoading(false)
    }
    load()
  }, [])

  function toggleSelect(id: string) {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(s => s !== id))
    } else if (selected.length < 2) {
      setSelected(prev => [...prev, id])
    }
  }

  const compareRoadmaps = roadmaps.filter(r => selected.includes(r.id))

  function getCareer(roadmap: any) {
    return roadmap.full_plan?.career_matches?.find((c: any) => c.title === roadmap.selected_career) || {}
  }

  function getTopUniversity(roadmap: any) {
    return roadmap.full_plan?.universities?.[0] || {}
  }

  function getScholarshipCount(roadmap: any) {
    return roadmap.full_plan?.scholarships?.length || 0
  }

  function getAPCount(roadmap: any) {
    const years = ['freshman', 'sophomore', 'junior', 'senior']
    let count = 0
    years.forEach(year => {
      count += roadmap.full_plan?.roadmap?.[year]?.ap_classes?.length || 0
    })
    return count
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
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          Pathway<span className="text-indigo-400">IQ</span>
        </a>
        <a href="/dashboard" className="text-white/50 hover:text-white text-sm transition">Dashboard</a>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Compare Careers</h1>
          <p className="text-white/40 text-sm">Select two roadmaps to compare side by side.</p>
        </div>

        {/* Selector */}
        {roadmaps.length < 2 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center mb-10">
            <p className="text-4xl mb-4">📊</p>
            <h2 className="text-xl font-semibold mb-2">You need at least 2 roadmaps</h2>
            <p className="text-white/40 text-sm mb-6">Take the quiz again with different answers to create another roadmap.</p>
            <button onClick={() => router.push('/quiz')} className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition">Take Quiz Again →</button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {roadmaps.map(r => (
                <button
                  key={r.id}
                  onClick={() => toggleSelect(r.id)}
                  className={`text-left p-4 rounded-2xl border transition ${
                    selected.includes(r.id)
                      ? 'bg-indigo-500/20 border-indigo-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  } ${selected.length === 2 && !selected.includes(r.id) ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm">{r.selected_career}</h3>
                    {selected.includes(r.id) && (
                      <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">Selected</span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs mt-1">
                    {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </button>
              ))}
            </div>

            {/* Comparison Table */}
            {compareRoadmaps.length === 2 && (
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4" />
                  {compareRoadmaps.map(r => (
                    <div key={r.id} className="bg-indigo-500/10 border border-indigo-400/30 rounded-2xl p-4 text-center">
                      <h2 className="font-bold text-lg">{r.selected_career}</h2>
                      <span className="text-indigo-300 text-sm">{getCareer(r).fit_score}% fit</span>
                    </div>
                  ))}
                </div>

                {/* Rows */}
                {[
                  {
                    label: '💰 Salary Range',
                    getValue: (r: any) => getCareer(r).salary_range || 'N/A',
                  },
                  {
                    label: '📈 Growth Outlook',
                    getValue: (r: any) => getCareer(r).growth_outlook || 'N/A',
                  },
                  {
                    label: '🎯 Fit Score',
                    getValue: (r: any) => `${getCareer(r).fit_score || 0}%`,
                  },
                  {
                    label: '🏫 Top University',
                    getValue: (r: any) => getTopUniversity(r).name || 'N/A',
                  },
                  {
                    label: '📊 Admit Likelihood',
                    getValue: (r: any) => getTopUniversity(r).admit_likelihood || 'N/A',
                  },
                  {
                    label: '💵 Scholarships Available',
                    getValue: (r: any) => `${getScholarshipCount(r)} scholarships`,
                  },
                  {
                    label: '📚 Total AP Classes',
                    getValue: (r: any) => `${getAPCount(r)} AP classes`,
                  },
                  {
                    label: '⚠️ Biggest Challenge',
                    getValue: (r: any) => getCareer(r).biggest_challenges || 'N/A',
                  },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center">
                      <span className="text-white/60 text-sm font-medium">{row.label}</span>
                    </div>
                    {compareRoadmaps.map(r => (
                      <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center text-center">
                        <span className="text-white/80 text-sm">{row.getValue(r)}</span>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Skills comparison */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center">
                    <span className="text-white/60 text-sm font-medium">🛠️ Top Skills Needed</span>
                  </div>
                  {compareRoadmaps.map(r => (
                    <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <div className="flex flex-wrap gap-1">
                        {getCareer(r).top_skills_needed?.map((s: string, i: number) => (
                          <span key={i} className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{s}</span>
                        )) || <span className="text-white/40 text-sm">N/A</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View buttons */}
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div />
                  {compareRoadmaps.map(r => (
                    <button
                      key={r.id}
                      onClick={() => router.push(`/roadmap/${r.id}`)}
                      className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-2xl transition text-sm"
                    >
                      View Full Roadmap →
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
