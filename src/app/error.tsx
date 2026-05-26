'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl mb-6">⚠️</p>
      <h1 className="text-3xl font-bold mb-3">Something went wrong</h1>
      <p className="text-white/40 text-sm mb-8 max-w-sm">An unexpected error occurred. Try again or go back home.</p>
      <div className="flex gap-4">
        <button onClick={reset} className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition">Try Again</button>
        <a href="/" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition">Go Home</a>
      </div>
    </main>
  )
}
