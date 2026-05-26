import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-extrabold text-indigo-400 mb-4">404</p>
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-white/40 text-sm mb-8 max-w-sm">
        This page doesn't exist or was moved. Let's get you back on track.
      </p>
      <Link
        href="/"
        className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        Back to Home
      </Link>
    </main>
  )
}