'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Props {
  roadmapId: string
  roadmapTitle: string
}

export default function ShareRoadmap({ roadmapId, roadmapTitle }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    setLoading(true)
    try {
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

      await supabase
        .from('roadmaps')
        .update({ is_public: true, share_token: token })
        .eq('id', roadmapId)

      const url = `${window.location.origin}/shared/${token}`
      setShareUrl(url)
    } catch (err) {
      console.error('Share error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      {shareUrl ? (
        <>
          <input
            readOnly
            value={shareUrl}
            className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-xs w-48 truncate"
          />
          <button
            onClick={handleCopy}
            className="bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold px-3 py-2 rounded-lg transition shrink-0"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </>
      ) : (
        <button
          onClick={handleShare}
          disabled={loading}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Sharing...</>
          ) : (
            <>🔗 Share Roadmap</>
          )}
        </button>
      )}
    </div>
  )
}
