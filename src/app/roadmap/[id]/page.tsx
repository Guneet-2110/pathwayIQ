'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const questions = [
  {
    id: 1,
    question: "What grade are you currently in?",
    emoji: "🎓",
    type: "single",
    options: ["7th Grade or below", "8th Grade", "9th Grade (Freshman)", "10th Grade (Sophomore)", "11th Grade (Junior)", "12th Grade (Senior)"],
  },
  {
    id: 2,
    question: "Which subjects do you enjoy most?",
    emoji: "📚",
    type: "multi",
    options: ["Math", "Science", "English / Writing", "History", "Art / Music", "Computer Science", "Business", "Psychology"],
  },
  {
    id: 3,
    question: "What do you usually do in your free time?",
    emoji: "🎮",
    type: "single",
    options: ["Build or create things", "Read or write", "Help or teach others", "Solve puzzles or code", "Play sports or stay active", "Draw, design, or make music"],
  },
  {
    id: 4,
    question: "What kind of work environment excites you?",
    emoji: "🏢",
    type: "single",
    options: ["Lab or research setting", "Office or corporate", "Outdoors or on-site", "Hospital or clinic", "Studio or creative space", "Remote / my own schedule"],
  },
  {
    id: 5,
    question: "What type of problem do you want to solve?",
    emoji: "🌍",
    type: "single",
    options: ["Health and disease", "Technology and software", "Money and markets", "Education and learning", "Environment and sustainability", "Safety and security", "Art and culture"],
  },
  {
    id: 6,
    question: "How comfortable are you with math and science?",
    emoji: "🔢",
    type: "single",
    options: ["Very comfortable — it's my strong suit", "Comfortable but not my favorite", "Neutral — I can do it if needed", "Not very comfortable"],
  },
  {
    id: 7,
    question: "Do you prefer creative or structured work?",
    emoji: "🎨",
    type: "single",
    options: ["Very creative — I like open-ended problems", "Mostly creative with some structure", "Mostly structured with some creativity", "Very structured — I like clear rules"],
  },
  {
    id: 8,
    question: "What is your current GPA range?",
    emoji: "📊",
    type: "single",
    options: ["3.8 – 4.0+", "3.5 – 3.7", "3.0 – 3.4", "2.5 – 2.9", "Below 2.5"],
  },
  {
    id: 9,
    question: "What state or country are you in?",
    emoji: "🌎",
    type: "text",
    placeholder: "e.g. Texas, USA or Ontario, Canada",
  },
  {
    id: 10,
    question: "Do you already have a career in mind?",
    emoji: "💡",
    type: "text",
    placeholder: "e.g. Doctor, Software Engineer, Undecided",
  },
  {
    id: 11,
    question: "What matters most to you in a future career?",
    emoji: "⭐",
    type: "multi",
    options: ["High salary", "Making an impact", "Creative freedom", "Job stability", "Work-life balance", "Prestige", "Helping people directly"],
  },
  {
    id: 12,
    question: "Do any of these apply to you?",
    emoji: "🙋",
    type: "multi_with_none",
    options: ["First-generation college student", "Need financial aid or scholarships", "Prefer to stay close to home", "Want to study abroad", "Interested in military or service"],
    noneOption: "None of the above",
  },
  {
    id: 13,
    question: "How would you describe your work style?",
    emoji: "🤝",
    type: "single",
    options: ["I like working alone and independently", "I prefer collaborating in small teams", "I thrive in large group settings", "I like leading and managing others"],
  },
]

export default function QuizPage() {
  const supabase = createClient()
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [textInput, setTextInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showExit, setShowExit] = useState(false)

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  function selectSingle(option: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: option }))
  }

  function toggleMulti(option: string) {
    const current_answers = answers[q.id] || []
    if (current_answers.includes(option)) {
      setAnswers((prev) => ({ ...prev, [q.id]: current_answers.filter((o: string) => o !== option) }))
    } else {
      setAnswers((prev) => ({ ...prev, [q.id]: [...current_answers, option] }))
    }
  }

  function toggleMultiWithNone(option: string, noneOption: string) {
    const current_answers = answers[q.id] || []
    if (option === noneOption) {
      if (current_answers.includes(noneOption)) {
        setAnswers((prev) => ({ ...prev, [q.id]: [] }))
      } else {
        setAnswers((prev) => ({ ...prev, [q.id]: [noneOption] }))
      }
    } else {
      const withoutNone = current_answers.filter((o: string) => o !== noneOption)
      if (withoutNone.includes(option)) {
        setAnswers((prev) => ({ ...prev, [q.id]: withoutNone.filter((o: string) => o !== option) }))
      } else {
        setAnswers((prev) => ({ ...prev, [q.id]: [...withoutNone, option] }))
      }
    }
  }

  function isAnswered() {
    if (q.type === 'text') return textInput.trim().length > 0
    if (q.type === 'single') return !!answers[q.id]
    if (q.type === 'multi') return answers[q.id]?.length > 0
    if (q.type === 'multi_with_none') return answers[q.id]?.length > 0
    return false
  }

  function handleNext() {
    if (q.type === 'text') {
      setAnswers((prev) => ({ ...prev, [q.id]: textInput }))
      setTextInput('')
    }
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  function handleBack() {
    if (current > 0) {
      setCurrent((prev) => prev - 1)
      setTextInput('')
    }
  }

  async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const finalAnswers = q.type === 'text' ? { ...answers, [q.id]: textInput } : answers

    await supabase.from('quiz_responses').insert({ user_id: user.id, answers: finalAnswers })

    const params = new URLSearchParams({ answers: JSON.stringify(finalAnswers) })
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center px-4 py-8">

      {/* Exit confirmation modal */}
      {showExit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center">
            <p className="text-2xl mb-3">🚪</p>
            <h2 className="text-xl font-bold mb-2">Leave the quiz?</h2>
            <p className="text-white/40 text-sm mb-6">Your progress won't be saved.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowExit(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition">Stay</button>
              <button onClick={() => router.push('/dashboard')} className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-semibold py-3 rounded-lg transition">Leave</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-xl font-bold tracking-tight">
            Pathway<span className="text-indigo-400">IQ</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm">{current + 1} / {questions.length}</span>
            <button onClick={() => setShowExit(true)} className="text-white/30 hover:text-white/60 text-sm transition">Exit</button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-10">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* Question card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
          <div className="text-4xl mb-4">{q.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">{q.question}</h2>
          {(q.type === 'multi' || q.type === 'multi_with_none') && (
            <p className="text-white/30 text-xs mb-6">Select all that apply</p>
          )}
          {q.type !== 'multi' && q.type !== 'multi_with_none' && q.type !== 'text' && (
            <p className="text-white/30 text-xs mb-6">Choose one</p>
          )}

          {q.type === 'single' && (
            <div className="flex flex-col gap-3">
              {q.options!.map((option) => (
                <button
                  key={option}
                  onClick={() => selectSingle(option)}
                  className={`text-left px-5 py-4 rounded-xl border transition text-sm font-medium ${
                    answers[q.id] === option
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'bg-white/3 border-white/10 hover:bg-white/8 hover:border-indigo-400/40 text-white/80'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {q.type === 'multi' && (
            <div className="flex flex-col gap-3">
              {q.options!.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti(option)}
                  className={`text-left px-5 py-4 rounded-xl border transition text-sm font-medium flex items-center gap-3 ${
                    (answers[q.id] || []).includes(option)
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'bg-white/3 border-white/10 hover:bg-white/8 hover:border-indigo-400/40 text-white/80'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${(answers[q.id] || []).includes(option) ? 'bg-white border-white' : 'border-white/30'}`}>
                    {(answers[q.id] || []).includes(option) && (
                      <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {option}
                </button>
              ))}
            </div>
          )}

          {q.type === 'multi_with_none' && (
            <div className="flex flex-col gap-3">
              {q.options!.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMultiWithNone(option, (q as any).noneOption)}
                  className={`text-left px-5 py-4 rounded-xl border transition text-sm font-medium flex items-center gap-3 ${
                    (answers[q.id] || []).includes(option)
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'bg-white/3 border-white/10 hover:bg-white/8 hover:border-indigo-400/40 text-white/80'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${(answers[q.id] || []).includes(option) ? 'bg-white border-white' : 'border-white/30'}`}>
                    {(answers[q.id] || []).includes(option) && (
                      <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {option}
                </button>
              ))}
              <button
                onClick={() => toggleMultiWithNone((q as any).noneOption, (q as any).noneOption)}
                className={`text-left px-5 py-4 rounded-xl border transition text-sm font-medium flex items-center gap-3 ${
                  (answers[q.id] || []).includes((q as any).noneOption)
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'bg-white/3 border-white/10 hover:bg-white/8 text-white/50'
                }`}
              >
                <div className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center ${(answers[q.id] || []).includes((q as any).noneOption) ? 'bg-white border-white' : 'border-white/30'}`}>
                  {(answers[q.id] || []).includes((q as any).noneOption) && (
                    <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {(q as any).noneOption}
              </button>
            </div>
          )}

          {q.type === 'text' && (
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={(q as any).placeholder || 'Type your answer...'}
              className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition text-sm"
              onKeyDown={(e) => e.key === 'Enter' && isAnswered() && handleNext()}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={current === 0}
            className="bg-white/5 hover:bg-white/10 disabled:opacity-0 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered() || loading}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            {loading ? 'Saving...' : current === questions.length - 1 ? 'Generate My Roadmap 🚀' : 'Next →'}
          </button>
        </div>
      </div>
    </main>
  )
}
