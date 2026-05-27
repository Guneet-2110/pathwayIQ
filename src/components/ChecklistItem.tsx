'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

interface Props {
  label: string
  itemKey: string
  roadmapId: string
  userId: string
  initialChecked?: boolean
}

export default function ChecklistItem({ label, itemKey, roadmapId, userId, initialChecked = false }: Props) {
  const supabase = createClient()
  const [checked, setChecked] = useState(initialChecked)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    setSaving(true)
    const newValue = !checked
    setChecked(newValue)

    const { data: existing } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', userId)
      .eq('roadmap_id', roadmapId)
      .eq('item_key', itemKey)
      .single()

    if (existing) {
      await supabase
        .from('progress')
        .update({ completed: newValue })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('progress')
        .insert({
          user_id: userId,
          roadmap_id: roadmapId,
          item_key: itemKey,
          completed: newValue,
        })
    }
    setSaving(false)
  }

  return (
    <li
      onClick={toggle}
      className={`flex gap-3 items-start text-sm cursor-pointer group transition ${
        saving ? 'opacity-50' : ''
      }`}
    >
      <div
        className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition ${
          checked
            ? 'bg-indigo-500 border-indigo-400'
            : 'border-white/30 group-hover:border-indigo-400'
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={`leading-relaxed ${checked ? 'line-through text-white/30' : 'text-white/70'}`}>
        {label}
      </span>
    </li>
  )
}
