'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const questions = [
  {
    id: 1,
    question: "What subjects do you enjoy most?",
    type: "multi",
    options: ["Math", "Science", "English/Writing", "History", "Art/Music", "Computer Science", "Business", "Psychology"],
  },
  {
    id: 2,
    question: "What do you usually do in your free time?",
    type: "single",
    options: ["Build or create things", "Read or write", "Help or teach others", "Solve puzzles or code", "Play sports or stay active", "Draw, design, or make music"],
  },
  {
    id: 3,
    question: "What kind of work environment excites you?",
    type: "single",
    options: ["Lab or research setting", "Office or corporate", "Outdoors or on-site", "Hospital or clinic", "Studio or creative space", "Remote / my own schedule"],
  },
  {
    id: 4,
    question: "What type of problem do you want to solve?",
    type: "single",
    options: ["Health and disease", "Technology and software", "Money and markets", "Education and learning", "Environment and sustainability", "Safety and security", "Art and culture"],
  },
  {
    id: 5,
    question: "How comfortable are you with math and science?",
    type: "single",
    options: ["Very comfortable — it's my strong suit", "Comfortable but not my favorite", "Neutral — I can do it if needed", "Not very comfortable"],
  },
  {
    id: 6,
    question: "Do you prefer creative or structured work?",
    type: "single",
    options: ["Very creative — I like open-ended problems", "Mostly creative with some structure", "Mostly structured with some creativity", "Very structured — I like clear rules and processes"],
  },
  {
    id: 7,
    question: "What is your current GPA range?",
    type: "single",
    options: ["3.8 – 4.0+", "3.5 – 3.7", "3.0 – 3.4", "2.5 – 2.9", "Below 2.5"],
  },
  {
    id: 8,
    question: "What state or country are you in?",
    type: "text",
  },
  {
    id: 9,
    question: "Do you already have a career in mind?",
    type: "text",
    placeholder: "e.g. Doctor, Software Engineer, Undecided",
  },
  {
    id: 10,
    question: "What matters most to you in a future career?",
    type: "multi",
    options: ["High salary", "Making an impact", "Creative freedom", "Job stability", "Work-life balance", "Prestige", "Helping people directly"],
  },
  {
    id: 11,
    question: "Do any of these apply to you?",
    type: "multi",
    options: ["First-generation college student", "Need financial aid or scholarships", "Prefer to stay close to home", "Want to study abroad", "Interested in military or service", "None of the above"],
  },
  {
    id: 12,
    question: "How would you describe your work style?",
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

  const q = questions[current]
  const progress = ((current + 1) / questions.length) * 100

  function selectSingle(option: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: option }))
  }

  function toggleMulti(option: string) {
    const current_answers = answers[q.id] || []
    if (current_answers.includes(option)) {
      setAnswers((prev) => ({
        ...prev,
        [q.id]: current_answers.filter((o: string) => o !== option),
      }))
    } else {
      setAnswers((prev) => ({
        ...prev,
        [q.id]: [...current_answers, option],
      }))
    }
  }

  function isAnswered() {
    if (q.type === 'text') return textInput.trim().length > 0
    if (q.type === 'single') return !!answers[q.id]
    if (q.type === 'multi') return answers[q.id]?.length > 0
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

   async function handleSubmit() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const finalAnswers = q.type === 'text' ? { ...answers, [q.id]: textInput } : answers

    await supabase.from('quiz_responses').insert({ user_id: user.id, answers: finalAnswers })

    sessionStorage.setItem('pathwayiq_answers', JSON.stringify(finalAnswers))
    router.push('/results')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-xl font-bold tracking-tight">
            Pathway<span className="text-indigo-400">IQ</span>
          </a>
          <span className="text-white/40 text-sm">
            {current + 1} / {questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-10">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">{q.question}</h2>

          {q.type === 'single' && (
            <div className="flex flex-col gap-3">
              {q.options!.map((option) => (
                <button
                  key={option}
                  onClick={() => selectSingle(option)}
                  className={`text-left px-4 py-3 rounded-lg border transition text-sm ${
                    answers[q.id] === option
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {q.type === 'multi' && (
            <div className="flex flex-col gap-3">
              <p className="text-white/40 text-xs mb-2">Select all that apply</p>
              {q.options!.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti(option)}
                  className={`text-left px-4 py-3 rounded-lg border transition text-sm ${
                    (answers[q.id] || []).includes(option)
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {q.type === 'text' && (
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={(q as any).placeholder || 'Type your answer...'}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-400 transition"
              onKeyDown={(e) => e.key === 'Enter' && isAnswered() && handleNext()}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              if (current > 0) {
                setCurrent((prev) => prev - 1)
                setTextInput('')
              }
            }}
            disabled={current === 0}
            className="bg-white/5 hover:bg-white/10 disabled:opacity-0 text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isAnswered() || loading}
            className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition"
          >
            {loading
              ? 'Saving...'
              : current === questions.length - 1
              ? 'Generate My Roadmap →'
              : 'Next →'}
          </button>
        </div>
      </div>
    </main>
  )
}
