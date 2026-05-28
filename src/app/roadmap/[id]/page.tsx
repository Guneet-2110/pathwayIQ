'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import ChecklistItem from '@/components/ChecklistItem'
import ProgressBar from '@/components/ProgressBar'
import ExportPDF from '@/components/ExportPDF'

const tabs = ['Overview', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Universities', 'Scholarships', 'Internships', 'Resources', 'Life Skills', 'Tests', 'App Timeline']

function Section({ title, items, card, checklist, roadmapId, userId, progress }: {
  title: string
  items: string[]
  card?: boolean
  checklist?: boolean
  roadmapId?: string
  userId?: string
  progress?: Record<string, boolean>
}) {
  if (!items?.length) return null
  return (
    <div className={card ? 'bg-white/5 border border-white/10 rounded-2xl p-6' : ''}>
      <h3 className="font-semibold text-white/80 mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item: string, i: number) => (
          checklist && roadmapId && userId ? (
            <ChecklistItem
              key={i}
              label={item}
              itemKey={`${title}-${i}-${item.slice(0, 20)}`}
              roadmapId={roadmapId}
              userId={userId}
              initialChecked={progress?.[`${title}-${i}-${item.slice(0, 20)}`] || false}
            />
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

function YearTab({ data, roadmapId, userId, progress }: {
  data: any
  roadmapId: string
  userId: string
  progress: Record<string, boolean>
}) {
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

      if (error || !data) {
        router.push('/dashboard')
        return
      }
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
          progressData.forEach((p: any) => {
            progressMap[p.item_key] = p.completed
          })
          setProgress(progressMap)
        }
      }
      setLoading(false)
    }
    load()
  }, [id])

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
          <ExportPDF roadmapTitle={roadmap.selected_career} />
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
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
            >
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
                    <div className="flex justify-between text-white/40">
                      <span>Salary</span>
                      <span className="text-white/70">{c.salary_range}</span>
                    </div>
                    <div className="flex justify-between text-white/40">
                      <span>Growth</span>
                      <span className="text-white/70">{c.growth_outlook}</span>
                    </div>
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
{s.link && s.link !== 'N/A' && s.link !== 'https://fastweb.com' && (
  <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Apply →</a>
)}
{(!s.link || s.link === 'N/A' || s.link === 'https://fastweb.com') && (
  <a href={`https://www.google.com/search?q=${encodeURIComponent(s.name + ' scholarship apply')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Search →</a>
)}
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
{item.link && item.link !== 'N/A' && item.link !== 'https://indeed.com' && (
  <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Learn More →</a>
)}
{(!item.link || item.link === 'N/A' || item.link === 'https://indeed.com') && (
  <a href={`https://www.google.com/search?q=${encodeURIComponent(item.name + ' internship apply')}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Search →</a>
)}
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
                          <ChecklistItem
                            key={i}
                            label={task}
                            itemKey={`timeline-${month}-${i}`}
                            roadmapId={id as string}
                            userId={userId}
                            initialChecked={progress[`timeline-${month}-${i}`] || false}
                          />
                        ))}
                      </ul>
                    </div>
                  )
                })
              })()}
            </div>
          )}
          )}
        </div>
      </div>
    </main>
  )
}
