'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ChecklistItem from '@/components/ChecklistItem'
import ProgressBar from '@/components/ProgressBar'
import ShareRoadmap from '@/components/ShareRoadmap'

const tabs = ['Overview', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Universities', 'Scholarships', 'Internships', 'Resources', 'Life Skills', 'Tests', 'App Timeline', 'Essay Ideas', 'Interview Prep', 'Financial Aid']

function Section({ title, items, card, checklist, roadmapId, userId, progress }: {
  title: string; items: string[]; card?: boolean; checklist?: boolean
  roadmapId?: string; userId?: string; progress?: Record<string, boolean>
}) {
  if (!items?.length) return null
  return (
    <div className={card ? 'bg-white/5 border border-white/10 rounded-2xl p-6' : ''}>
      <h3 className="font-semibold text-white/80 mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item: string, i: number) => (
          checklist && roadmapId && userId ? (
            <ChecklistItem key={i} label={item} itemKey={`${title}-${i}-${item.slice(0, 20)}`} roadmapId={roadmapId} userId={userId} initialChecked={progress?.[`${title}-${i}-${item.slice(0, 20)}`] || false} />
          ) : (
            <li key={i} className="flex gap-2 text-sm text-white/70">
              <span className="text-indigo-400 mt-0.5">→</span>
              <span>{item}</span>
            </li>
          )
        ))}
      </ul>
    </div>
  )
}

function YearTab({ data, roadmapId, userId, progress }: { data: any; roadmapId: string; userId: string; progress: Record<string, boolean> }) {
  if (!data) return null
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-indigo-300 text-sm font-semibold mb-1">Monthly Focus</p>
        <p className="text-white/80">{data.monthly_focus}</p>
      </div>
      {data.gpa_target && (
        <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4">
          <p className="text-indigo-300 text-sm font-semibold mb-1">🎯 GPA Target</p>
          <p className="text-white/70 text-sm">{data.gpa_target}</p>
        </div>
      )}
      {data.networking_tips && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-white/60 text-sm font-semibold mb-1">🤝 Networking Tips</p>
          <p className="text-white/70 text-sm">{data.networking_tips}</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <Section title="📚 Courses" items={data.courses} checklist roadmapId={roadmapId} userId={userId} progress={progress} />
        <Section title="🎓 AP Classes" items={data.ap_classes} checklist roadmapId={roadmapId} userId={userId} progress={progress} />
        <Section title="🏆 Extracurriculars" items={data.extracurriculars} checklist roadmapId={roadmapId} userId={userId} progress={progress} />
        <Section title="💡 Passion Projects" items={data.passion_projects} checklist roadmapId={roadmapId} userId={userId} progress={progress} />
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold text-lg mb-4">☀️ Summer Plan</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Section title="Activities" items={data.summer?.activities} />
          <Section title="Programs" items={data.summer?.programs} />
          <Section title="Books to Read" items={data.summer?.books} />
        </div>
      </div>
      <Section title="🎯 Goals This Year" items={data.goals} card checklist roadmapId={roadmapId} userId={userId} progress={progress} />
    </div>
  )
}

function EssayTab({ roadmap, onSave }: { roadmap: any; onSave: (key: string, data: any) => void }) {
  const [data, setData] = useState<any>(roadmap.essay_ideas || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmap: { selected_career: roadmap.selected_career, career_matches: roadmap.full_plan?.career_matches } }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setData(json.data)
      onSave('essay_ideas', json.data)
    } catch (e: any) {
      setError(e.message || 'Failed to generate essay ideas')
    } finally {
      setLoading(false)
    }
  }

  if (!data && !loading) return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
      <p className="text-4xl mb-4">✍️</p>
      <h2 className="text-xl font-semibold mb-2">College Essay Brainstormer</h2>
      <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">Get 5 personalized college essay angles based on your career path and story.</p>
      <button onClick={generate} className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition">Generate My Essay Ideas →</button>
    </div>
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/40 text-sm">Crafting your essay angles...</p>
    </div>
  )

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={generate} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg transition">Try Again</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4">
        <p className="text-indigo-300 text-sm font-semibold">✍️ Your Personalized Essay Angles</p>
        <p className="text-white/40 text-xs mt-1">5 unique angles based on your career path. Use these as starting points.</p>
      </div>
      {data?.essays?.map((essay: any, i: number) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg">{essay.angle}</h3>
            <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full shrink-0 ml-2">Prompt #{essay.prompt_match}</span>
          </div>
          <div className="bg-white/5 rounded-lg p-3 mb-4">
            <p className="text-indigo-300 text-xs font-semibold mb-1">Opening Hook</p>
            <p className="text-white/70 text-sm italic">"{essay.hook}"</p>
          </div>
          <p className="text-white/60 text-sm mb-4 leading-relaxed">{essay.core_story}</p>
          <p className="text-green-300/70 text-xs mb-4">💡 {essay.why_powerful}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">What to Include</p>
              <ul className="flex flex-col gap-1">
                {essay.what_to_include?.map((item: string, j: number) => (
                  <li key={j} className="text-white/60 text-xs flex gap-2"><span className="text-indigo-400">→</span>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Avoid</p>
              <p className="text-red-400/60 text-xs">⚠️ {essay.avoid}</p>
            </div>
          </div>
        </div>
      ))}
      <button onClick={generate} className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-sm font-semibold px-6 py-3 rounded-lg transition self-start">Regenerate Ideas</button>
    </div>
  )
}

function InterviewTab({ career, roadmap, onSave }: { career: string; roadmap: any; onSave: (key: string, data: any) => void }) {
  const [data, setData] = useState<any>(roadmap.interview_prep || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setData(json.data)
      onSave('interview_prep', json.data)
    } catch (e: any) {
      setError(e.message || 'Failed to generate interview prep')
    } finally {
      setLoading(false)
    }
  }

  if (!data && !loading) return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
      <p className="text-4xl mb-4">🎤</p>
      <h2 className="text-xl font-semibold mb-2">Interview Prep</h2>
      <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">Get real interview questions for {career} roles with sample answers and tips.</p>
      <button onClick={generate} className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition">Generate Interview Prep →</button>
    </div>
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/40 text-sm">Preparing your interview questions...</p>
    </div>
  )

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={generate} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg transition">Try Again</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4">
        <p className="text-indigo-300 text-sm font-semibold">🎤 Interview Prep for {career}</p>
        <p className="text-white/50 text-sm mt-1">{data?.intro}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-green-300">✅ Do</h3>
          <ul className="flex flex-col gap-2">
            {data?.dos?.map((item: string, i: number) => (
              <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-green-400 shrink-0">→</span>{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-red-300">❌ Don't</h3>
          <ul className="flex flex-col gap-2">
            {data?.donts?.map((item: string, i: number) => (
              <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-red-400 shrink-0">→</span>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <h3 className="font-bold text-lg">Common Questions</h3>
      <div className="flex flex-col gap-4">
        {data?.questions?.map((q: any, i: number) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="flex-1 pr-4">
                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full mr-2">{q.category}</span>
                <p className="font-semibold mt-2">{q.question}</p>
              </div>
              <span className="text-white/40 text-lg">{expanded === i ? '−' : '+'}</span>
            </div>
            {expanded === i && (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Why They Ask This</p>
                  <p className="text-white/60 text-sm">{q.why_asked}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Sample Answer</p>
                  <p className="text-white/70 text-sm leading-relaxed italic">"{q.sample_answer}"</p>
                </div>
                <div className="bg-indigo-500/10 rounded-lg p-3">
                  <p className="text-indigo-300 text-xs">💡 {q.tips}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">📋 Prep Checklist</h3>
        <ul className="flex flex-col gap-2">
          {data?.prep_checklist?.map((item: string, i: number) => (
            <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-indigo-400">→</span>{item}</li>
          ))}
        </ul>
      </div>
      <button onClick={generate} className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-sm font-semibold px-6 py-3 rounded-lg transition self-start">Regenerate Questions</button>
    </div>
  )
}

function FinancialTab({ universities, career, location, roadmap, onSave }: { universities: any[]; career: string; location: string; roadmap: any; onSave: (key: string, data: any) => void }) {
  const [data, setData] = useState<any>(roadmap.financial_aid || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/generate-financial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universities, career, location }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setData(json.data)
      onSave('financial_aid', json.data)
    } catch (e: any) {
      setError(e.message || 'Failed to generate financial aid info')
    } finally {
      setLoading(false)
    }
  }

  if (!data && !loading) return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
      <p className="text-4xl mb-4">💰</p>
      <h2 className="text-xl font-semibold mb-2">Financial Aid Estimator</h2>
      <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">Get estimated costs, financial aid options, and a timeline for your target universities.</p>
      <button onClick={generate} className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-lg transition">Generate Financial Aid Info →</button>
    </div>
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-white/40 text-sm">Calculating your financial aid options...</p>
    </div>
  )

  if (error) return (
    <div className="text-center py-12">
      <p className="text-red-400 mb-4">{error}</p>
      <button onClick={generate} className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-lg transition">Try Again</button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4">
        <p className="text-indigo-300 text-sm font-semibold">💰 Financial Aid Overview</p>
        <p className="text-white/60 text-sm mt-2 leading-relaxed">{data?.overview}</p>
      </div>
      {data?.roi && (
        <div className="bg-green-500/10 border border-green-400/20 rounded-2xl p-4">
          <p className="text-green-300 text-sm font-semibold mb-1">📈 Return on Investment</p>
          <p className="text-white/60 text-sm leading-relaxed">{data.roi}</p>
        </div>
      )}
      <h3 className="font-bold text-lg">University Cost Breakdown</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {data?.universities?.map((u: any, i: number) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-3">{u.name}</h3>
            <div className="flex flex-col gap-2 text-sm mb-3">
              <div className="flex justify-between"><span className="text-white/40">Annual Cost</span><span className="text-white/70">{u.estimated_annual_cost}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Net Cost (after aid)</span><span className="text-green-300">{u.net_cost_estimate}</span></div>
            </div>
            <p className="text-white/50 text-xs mb-2">{u.typical_aid}</p>
            <p className="text-indigo-300/60 text-xs">💡 {u.financial_tip}</p>
          </div>
        ))}
      </div>
      <h3 className="font-bold text-lg">Types of Aid</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {data?.aid_types?.map((aid: any, i: number) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full">{aid.type}</span>
            <p className="text-white/60 text-sm mt-3 mb-2">{aid.description}</p>
            <p className="text-indigo-300/60 text-xs">💡 {aid.how_to_maximize}</p>
          </div>
        ))}
      </div>
      <h3 className="font-bold text-lg">Financial Aid Timeline</h3>
      <div className="flex flex-col gap-4">
        {data?.timeline?.map((item: any, i: number) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
            <div className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-lg shrink-0 h-fit">{item.when}</div>
            <div>
              <p className="text-white/80 text-sm font-semibold">{item.action}</p>
              <p className="text-white/40 text-xs mt-1">{item.why}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">💡 Money Saving Tips</h3>
        <ul className="flex flex-col gap-2">
          {data?.tips?.map((tip: string, i: number) => (
            <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-yellow-400">→</span>{tip}</li>
          ))}
        </ul>
      </div>
      <button onClick={generate} className="bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-sm font-semibold px-6 py-3 rounded-lg transition self-start">Regenerate</button>
    </div>
  )
}

export default function RoadmapPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [roadmap, setRoadmap] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [userId, setUserId] = useState<string>('')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) { router.push('/dashboard'); return }
      setRoadmap(data)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        const { data: progressData } = await supabase
          .from('progress')
          .select('item_key, completed')
          .eq('roadmap_id', id)
          .eq('user_id', user.id)
        if (progressData) {
          const progressMap: Record<string, boolean> = {}
          progressData.forEach((p: any) => { progressMap[p.item_key] = p.completed })
          setProgress(progressMap)
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

  async function handleSaveExtra(key: string, data: any) {
    await supabase.from('roadmaps').update({ [key]: data }).eq('id', id)
    setRoadmap((prev: any) => ({ ...prev, [key]: data }))
  }

  function totalItems() {
    if (!roadmap) return 0
    const plan = roadmap.full_plan
    let count = 0
    const years = ['freshman', 'sophomore', 'junior', 'senior']
    years.forEach(year => {
      const y = plan.roadmap?.[year]
      if (!y) return
      count += (y.courses?.length || 0)
      count += (y.ap_classes?.length || 0)
      count += (y.extracurriculars?.length || 0)
      count += (y.goals?.length || 0)
    })
    return count
  }

  function completedItems() {
    return Object.values(progress).filter(Boolean).length
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  const plan = roadmap.full_plan

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">Pathway<span className="text-indigo-400">IQ</span></a>
        <div className="flex gap-4 items-center">
          <a href="/dashboard" className="text-white/50 hover:text-white text-sm transition">My Roadmaps</a>
          <ShareRoadmap roadmapId={id as string} roadmapTitle={roadmap.selected_career} />
          <button onClick={() => router.push('/quiz')} className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">Retake Quiz</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10" id="roadmap-content">
        <div className="mb-8">
          <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-1">Your Roadmap</p>
          <h1 className="text-4xl font-extrabold">{roadmap.selected_career}</h1>
        </div>

        <ProgressBar completed={completedItems()} total={totalItems()} />

        <div className="flex gap-2 flex-wrap mb-10">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'Overview' && (
            <div className="grid md:grid-cols-3 gap-6">
              {plan.career_matches?.map((c: any, i: number) => (
                <div key={i} className={`bg-white/5 border rounded-2xl p-6 ${c.title === roadmap.selected_career ? 'border-indigo-400' : 'border-white/10'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{c.title}</h3>
                    <span className="bg-indigo-500/20 text-indigo-300 text-sm px-2 py-0.5 rounded-full">{c.fit_score}%</span>
                  </div>
                  <p className="text-white/50 text-sm mb-4">{c.description}</p>
                  {c.day_in_life && <p className="text-white/40 text-xs mb-4 italic">{c.day_in_life}</p>}
                  {c.top_skills_needed?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {c.top_skills_needed.map((s: string, j: number) => (
                        <span key={j} className="bg-white/10 text-white/60 text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between text-white/40"><span>Salary</span><span className="text-white/70">{c.salary_range}</span></div>
                    <div className="flex justify-between text-white/40"><span>Growth</span><span className="text-white/70">{c.growth_outlook}</span></div>
                  </div>
                  {c.biggest_challenges && <p className="text-white/30 text-xs mt-3 leading-relaxed">⚠️ {c.biggest_challenges}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Freshman' && <YearTab data={plan.roadmap?.freshman} roadmapId={id as string} userId={userId} progress={progress} />}
          {activeTab === 'Sophomore' && <YearTab data={plan.roadmap?.sophomore} roadmapId={id as string} userId={userId} progress={progress} />}
          {activeTab === 'Junior' && <YearTab data={plan.roadmap?.junior} roadmapId={id as string} userId={userId} progress={progress} />}
          {activeTab === 'Senior' && <YearTab data={plan.roadmap?.senior} roadmapId={id as string} userId={userId} progress={progress} />}

          {activeTab === 'Universities' && (
            <div className="grid md:grid-cols-2 gap-6">
              {plan.universities?.map((u: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{u.name}</h3>
                    <span className="bg-green-500/20 text-green-300 text-sm px-2 py-0.5 rounded-full shrink-0 ml-2">{u.admit_likelihood}</span>
                  </div>
                  <p className="text-indigo-300 text-sm mb-3">{u.program}</p>
                  <p className="text-white/50 text-sm mb-3">{u.why_fit}</p>
                  {u.notable_programs && <p className="text-white/40 text-xs mb-3">⭐ {u.notable_programs}</p>}
                  {u.application_tip && <p className="text-indigo-300/60 text-xs mb-4">💡 {u.application_tip}</p>}
                  <div className="flex gap-4 text-sm">
                    <div className="text-white/40">Avg GPA <span className="text-white/70 ml-1">{u.avg_gpa}</span></div>
                    <div className="text-white/40">Avg SAT <span className="text-white/70 ml-1">{u.avg_sat}</span></div>
                    <div className="text-white/40"><span className="text-white/70">{u.location}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Scholarships' && (
            <div className="grid md:grid-cols-2 gap-6">
              {plan.scholarships?.map((s: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{s.name}</h3>
                    <span className="bg-yellow-500/20 text-yellow-300 text-sm px-2 py-0.5 rounded-full shrink-0 ml-2">{s.amount}</span>
                  </div>
                  <p className="text-white/50 text-sm mb-3">{s.eligibility}</p>
                  {s.how_to_stand_out && <p className="text-indigo-300/60 text-xs mb-3">💡 {s.how_to_stand_out}</p>}
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Deadline: <span className="text-white/70">{s.deadline}</span></span>
                    {s.link && s.link !== 'N/A' && s.link !== 'https://fastweb.com' && (<a href={s.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Apply →</a>)}
                    {(!s.link || s.link === 'N/A' || s.link === 'https://fastweb.com') && (<a href={`https://www.google.com/search?q=${encodeURIComponent(s.name + ' scholarship apply')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Search →</a>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Internships' && (
            <div className="grid md:grid-cols-2 gap-6">
              {plan.internships?.map((item: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{item.name}</h3>
                    <span className="bg-purple-500/20 text-purple-300 text-sm px-2 py-0.5 rounded-full shrink-0 ml-2">{item.type}</span>
                  </div>
                  <p className="text-white/50 text-sm mb-3">{item.description}</p>
                  {item.how_to_apply && <p className="text-indigo-300/60 text-xs mb-3">💡 {item.how_to_apply}</p>}
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Grade: <span className="text-white/70">{item.grade_level}</span></span>
                    {item.link && item.link !== 'N/A' && item.link !== 'https://indeed.com' && (<a href={item.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Learn More →</a>)}
                    {(!item.link || item.link === 'N/A' || item.link === 'https://indeed.com') && (<a href={`https://www.google.com/search?q=${encodeURIComponent(item.name + ' internship apply')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Search →</a>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Resources' && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">📚 Books</h3>
                <ul className="flex flex-col gap-3">
                  {plan.resources?.books?.map((b: string, i: number) => (
                    <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-indigo-400">→</span>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">▶️ YouTube Channels</h3>
                <ul className="flex flex-col gap-3">
                  {plan.resources?.youtube_channels?.map((y: string, i: number) => (
                    <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-indigo-400">→</span>{y}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold mb-4">💻 Online Courses</h3>
                <ul className="flex flex-col gap-3">
                  {plan.resources?.online_courses?.map((c: string, i: number) => (
                    <li key={i} className="text-sm text-white/70 flex gap-2"><span className="text-indigo-400">→</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'Life Skills' && (
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: '⏰ Time Management', key: 'time_management' },
                { title: '🧘 Stress Management', key: 'stress_management' },
                { title: '💵 Money Management', key: 'money_management' },
              ].map((item) => (
                <div key={item.key} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="font-semibold text-lg mb-4">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{plan.life_skills?.[item.key]}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Tests' && (
            <div className="grid md:grid-cols-2 gap-6">
              {plan.standardized_tests?.map((t: any, i: number) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{t.test}</h3>
                    <span className="bg-blue-500/20 text-blue-300 text-sm px-2 py-0.5 rounded-full shrink-0 ml-2">{t.target_score}</span>
                  </div>
                  <p className="text-white/50 text-sm mb-3">{t.why}</p>
                  <p className="text-white/40 text-sm mb-2">When: <span className="text-white/70">{t.when_to_take}</span></p>
                  {t.prep_resources && <p className="text-indigo-300/60 text-xs">📖 {t.prep_resources}</p>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'App Timeline' && (
            <div className="flex flex-col gap-6">
              <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4 mb-2">
                <p className="text-indigo-300 text-sm font-semibold mb-1">📅 College Application Timeline</p>
                <p className="text-white/50 text-xs">Follow this checklist from junior year through senior year. Check off each task as you complete it.</p>
              </div>
              {plan.college_application_timeline && (() => {
                const order = ['junior_year', 'summer_before_senior', 'september', 'october', 'november', 'december', 'january', 'february_march', 'april_may']
                const timeline = plan.college_application_timeline
                return order.map((month) => {
                  const tasks = timeline[month]
                  if (!tasks?.length) return null
                  const labels: Record<string, string> = {
                    junior_year: '📚 Junior Year',
                    summer_before_senior: '☀️ Summer Before Senior Year',
                    september: '🍂 September',
                    october: '🍁 October',
                    november: '❄️ November',
                    december: '🎄 December',
                    january: '🎉 January',
                    february_march: '💐 February & March',
                    april_may: '🌸 April & May',
                  }
                  return (
                    <div key={month} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <h3 className="font-bold text-lg mb-4 text-indigo-300">{labels[month] || month.replace(/_/g, ' ')}</h3>
                      <ul className="flex flex-col gap-2">
                        {tasks?.map((task: string, i: number) => (
                          <ChecklistItem key={i} label={task} itemKey={`timeline-${month}-${i}`} roadmapId={id as string} userId={userId} initialChecked={progress[`timeline-${month}-${i}`] || false} />
                        ))}
                      </ul>
                    </div>
                  )
                })
              })()}
            </div>
          )}

          {activeTab === 'Essay Ideas' && <EssayTab roadmap={roadmap} onSave={handleSaveExtra} />}
          {activeTab === 'Interview Prep' && <InterviewTab career={roadmap.selected_career} roadmap={roadmap} onSave={handleSaveExtra} />}
          {activeTab === 'Financial Aid' && <FinancialTab universities={plan.universities} career={roadmap.selected_career} location={plan.roadmap?.freshman?.courses?.[0] || ''} roadmap={roadmap} onSave={handleSaveExtra} />}
        </div>
      </div>
    </main>
  )
}
