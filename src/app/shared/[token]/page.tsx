import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'

const tabs = ['Overview', 'Freshman', 'Sophomore', 'Junior', 'Senior', 'Universities', 'Scholarships', 'Internships', 'Resources', 'Life Skills', 'Tests']

export default async function SharedRoadmapPage({ params }: { params: { token: string } }) {
  const supabase = await createServerSupabaseClient()

  const { data: roadmap } = await supabase
    .from('roadmaps')
    .select('*')
    .eq('share_token', params.token)
    .eq('is_public', true)
    .single()

  if (!roadmap) notFound()

  const plan = roadmap.full_plan

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/10">
        <a href="/" className="text-xl font-bold tracking-tight">
          Pathway<span className="text-indigo-400">IQ</span>
        </a>
        <a href="/signup" className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          Build My Own Roadmap →
        </a>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <span className="text-2xl">🔗</span>
          <div>
            <p className="text-indigo-300 text-sm font-semibold">Shared Roadmap</p>
            <p className="text-white/40 text-xs">This roadmap was shared with you. Create your own free at PathwayIQ.</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-1">Career Roadmap</p>
          <h1 className="text-4xl font-extrabold">{roadmap.selected_career}</h1>
        </div>

        {/* Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {plan.career_matches?.map((c: any, i: number) => (
            <div key={i} className={`bg-white/5 border rounded-2xl p-6 ${c.title === roadmap.selected_career ? 'border-indigo-400' : 'border-white/10'}`}>
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{c.title}</h3>
                <span className="bg-indigo-500/20 text-indigo-300 text-sm px-2 py-0.5 rounded-full">{c.fit_score}%</span>
              </div>
              <p className="text-white/50 text-sm mb-4">{c.description}</p>
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
            </div>
          ))}
        </div>

        {/* Universities */}
        <h2 className="text-2xl font-bold mb-4">🏫 Universities</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {plan.universities?.map((u: any, i: number) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{u.name}</h3>
                <span className="bg-green-500/20 text-green-300 text-sm px-2 py-0.5 rounded-full shrink-0 ml-2">{u.admit_likelihood}</span>
              </div>
              <p className="text-indigo-300 text-sm mb-2">{u.program}</p>
              <p className="text-white/50 text-sm">{u.why_fit}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-3">Want your own personalized roadmap?</h2>
          <p className="text-white/50 mb-6 text-sm">Free. Takes 5 minutes. Built specifically for you.</p>
          <a href="/signup" className="inline-block bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
            Build My Roadmap Free →
          </a>
        </div>
      </div>
    </main>
  )
}
