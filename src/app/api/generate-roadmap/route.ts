export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ success: false, error: 'No answers provided' }, { status: 400 })
    }

    const prompt = `
You are a world-class high school career counselor and college advisor. Based on the following student quiz answers, generate a detailed, personalized career roadmap.

STUDENT ANSWERS:
${JSON.stringify(answers, null, 2)}

Return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation. Just raw JSON.

The JSON must follow this exact structure:
{
  "career_matches": [
    {
      "title": "Career Title",
      "fit_score": 92,
      "description": "2-3 sentence description of this career and why it fits this student",
      "salary_range": "$X - $Y per year",
      "growth_outlook": "High / Medium / Low"
    }
  ],
  "roadmap": {
    "freshman": {
      "courses": ["course1", "course2"],
      "ap_classes": ["AP class if relevant"],
      "extracurriculars": ["activity1", "activity2"],
      "passion_projects": ["project idea 1"],
      "summer": {
        "activities": ["activity1", "activity2"],
        "programs": ["program name"],
        "books": ["Book Title by Author"]
      },
      "goals": ["goal1", "goal2"],
      "monthly_focus": "One sentence on what to prioritize this year"
    },
    "sophomore": {
      "courses": [], "ap_classes": [], "extracurriculars": [], "passion_projects": [],
      "summer": { "activities": [], "programs": [], "books": [] },
      "goals": [], "monthly_focus": ""
    },
    "junior": {
      "courses": [], "ap_classes": [], "extracurriculars": [], "passion_projects": [],
      "summer": { "activities": [], "programs": [], "books": [] },
      "goals": [], "monthly_focus": ""
    },
    "senior": {
      "courses": [], "ap_classes": [], "extracurriculars": [], "passion_projects": [],
      "summer": { "activities": [], "programs": [], "books": [] },
      "goals": [], "monthly_focus": ""
    }
  },
  "universities": [
    {
      "name": "University Name",
      "program": "Specific program name",
      "location": "City, State",
      "admit_likelihood": "72%",
      "why_fit": "1-2 sentences on why this university fits the student",
      "avg_gpa": "3.7",
      "avg_sat": "1350"
    }
  ],
  "scholarships": [
    {
      "name": "Scholarship Name",
      "amount": "$X,000",
      "deadline": "Month YYYY or Rolling",
      "eligibility": "Who qualifies",
      "link": "URL if known"
    }
  ],
  "internships": [
    {
      "name": "Program or Company Name",
      "type": "Internship / Fellowship / Volunteer",
      "grade_level": "Junior / Senior / Any",
      "description": "1 sentence description",
      "link": "URL if known"
    }
  ],
  "resources": {
    "books": ["Book Title by Author"],
    "youtube_channels": ["Channel Name - what it covers"],
    "online_courses": ["Course Name on Platform - brief description"]
  },
  "life_skills": {
    "time_management": "3-4 sentence personalized advice",
    "stress_management": "3-4 sentence personalized advice",
    "money_management": "3-4 sentence personalized advice"
  },
  "standardized_tests": [
    {
      "test": "SAT / ACT / AP Exam Name",
      "when_to_take": "e.g. Junior year spring",
      "target_score": "e.g. 1400+",
      "why": "1 sentence on why this test matters"
    }
  ]
}

Make everything specific to this student. Generate 3 career matches, 6 universities, 4 scholarships, 3 internships, and fill every year of the roadmap in detail.
`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Groq error:', err)
      return NextResponse.json({ success: false, error: 'Groq API failed' }, { status: 500 })
    }

    const data = await response.json()
    const text = data.choices[0].message.content
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json({ success: true, data: parsed })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate roadmap' },
      { status: 500 }
    )
  }
}
