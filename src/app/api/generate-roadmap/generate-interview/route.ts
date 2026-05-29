export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { career } = await req.json()

    const prompt = `You are a career coach preparing a high school student for interviews in their target field. Generate interview prep material for someone pursuing a career as a ${career}.

Return ONLY valid JSON, no markdown, no backticks.

{
  "intro": "2-3 sentences on what interviews look like for this career path at the entry/internship level",
  "questions": [
    {
      "question": "Interview question",
      "category": "Behavioral / Technical / Situational / Motivational",
      "why_asked": "Why interviewers ask this",
      "sample_answer": "A strong sample answer a high schooler could adapt",
      "tips": "Specific tip for answering this question well"
    }
  ],
  "dos": ["specific do 1", "specific do 2", "specific do 3", "specific do 4"],
  "donts": ["specific dont 1", "specific dont 2", "specific dont 3"],
  "prep_checklist": ["action item 1", "action item 2", "action item 3", "action item 4", "action item 5"]
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
        temperature: 0.7,
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
    console.error('Interview generation error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
