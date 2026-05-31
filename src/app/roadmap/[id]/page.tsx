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

function InterviewTab({ caree
