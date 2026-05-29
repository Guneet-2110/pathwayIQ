export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { roadmap } = await req.json()

    const prompt = `You are a world-class college admissions counselor. Based on this student's career roadmap and profile, generate 5 highly specific, compelling college essay angles unique to their story.

STUDENT ROADMAP:
Career: ${roadmap.selected_career}
Location: from their quiz answers
Career matches: ${JSON.stringify(roadmap.career_matches?.slice(0, 1))}

Return ONLY valid JSON, no markdown, no backticks.

{
  "essays": [
    {
      "angle": "Short title for this essay angle",
      "prompt_match": "Which Common App prompt this fits best (1-7)",
      "hook": "Opening sentence that would grab an admissions officer",
      "core_story": "2-3 sentences describing what this essay would be about",
      "why_powerful": "1-2 sentences on why this angle is compelling for this student",
      "what_to_include": ["specific detail 1", "specific detail 2", "specific detail 3"],
      "avoid": "One thing to avoid in this essay"
    }
  ]
}`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'HTTP-Referer': 'https://pathwayiq-guneet.vercel.app',
        'X-Title': 'PathwayIQ',
      },
      body: JSON.stringify({
        model: 'openrouter/auto',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('OpenRouter error:', err)
      return NextResponse.json({ success: false, error: 'AI API failed' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices[0].message.content
    let clean = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const firstBrace = clean.indexOf('{')
    const lastBrace = clean.lastIndexOf('}')
    clean = clean.slice(firstBrace, lastBrace + 1)
    const parsed = JSON.parse(clean)

    return NextResponse.json({ success: true, data: parsed })
  } catch (error: any) {
    console.error('Essay generation error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
