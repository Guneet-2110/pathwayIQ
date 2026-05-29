export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { universities, career, location } = await req.json()

    const prompt = `You are a financial aid expert helping a high school student understand college costs and aid for someone pursuing ${career} from ${location}.

Universities they are considering: ${JSON.stringify(universities?.slice(0, 4))}

Return ONLY valid JSON, no markdown, no backticks.

{
  "overview": "3-4 sentences on the financial reality of pursuing this career path including typical education costs",
  "universities": [
    {
      "name": "University name",
      "estimated_annual_cost": "$X,000 - $Y,000",
      "typical_aid": "What kind of aid is typically available",
      "net_cost_estimate": "Estimated net cost after typical aid",
      "financial_tip": "Specific tip for this university"
    }
  ],
  "aid_types": [
    {
      "type": "Type of aid (Merit / Need-based / Scholarships / Loans / Work-study)",
      "description": "What it is and how to get it",
      "how_to_maximize": "Specific actionable advice"
    }
  ],
  "timeline": [
    {
      "when": "When to do this (e.g. Junior year fall)",
      "action": "Specific financial aid action to take",
      "why": "Why this timing matters"
    }
  ],
  "tips": ["specific money saving tip 1", "specific tip 2", "specific tip 3", "specific tip 4"],
  "roi": "2-3 sentences on the return on investment of this career path — typical starting salary vs education cost"
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
    console.error('Financial generation error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
