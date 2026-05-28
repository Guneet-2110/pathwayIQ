export const dynamic = 'force-dynamic'
// v2 openrouter

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { answers } = body

    if (!answers) {
      return NextResponse.json({ success: false, error: 'No answers provided' }, { status: 400 })
    }

    const prompt = `You are a world-class high school career counselor and college advisor. Based on the following student quiz answers, generate an extremely detailed, personalized career roadmap. CRITICAL RULES:
- Every piece of advice must be specific to THIS student's grade, location, interests, GPA, and career goals
- LOCATION IS CRITICAL: The student's country and region must determine universities, scholarships, and internships. If the student is in China, recommend Chinese universities (Tsinghua, Peking University, Fudan etc), Chinese scholarships, and opportunities available in China. If in India, recommend Indian universities (IITs, NITs etc). If in Canada, recommend Canadian universities. If in UK, recommend UK universities. NEVER recommend US-specific scholarships or universities to students outside the USA unless they explicitly want to study abroad.
- SCHOLARSHIPS must match the student's nationality and location. Never recommend Hispanic scholarships to non-Hispanic students. Never recommend US federal aid to non-US students.
- For internship and scholarship links, ONLY use real well-known URLs that definitely exist for that country. Do NOT make up specific URLs.
- Life skills advice must directly reference the student's specific career path
- Every year of the roadmap must have at least 4 items in each array
- If the student mentions wanting to study abroad, include international options alongside local ones

STUDENT ANSWERS:
${JSON.stringify(answers, null, 2)}

Return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation. Just raw JSON starting with { and ending with }.

{
  "career_matches": [
    {
      "title": "Career Title",
      "fit_score": 92,
      "description": "3-4 sentence description",
      "salary_range": "$X - $Y per year",
      "growth_outlook": "High",
      "day_in_life": "2-3 sentences describing a typical day",
      "top_skills_needed": ["skill1", "skill2", "skill3"],
      "biggest_challenges": "2 sentences on the hardest parts"
    }
  ],
  "roadmap": {
    "freshman": {
      "courses": ["course1", "course2", "course3", "course4"],
      "ap_classes": ["AP class1", "AP class2"],
      "extracurriculars": ["activity1", "activity2", "activity3", "activity4"],
      "passion_projects": ["project1", "project2"],
      "summer": { "activities": ["activity1", "activity2"], "programs": ["program1"], "books": ["Book by Author"] },
      "goals": ["goal1", "goal2", "goal3"],
      "monthly_focus": "Detailed paragraph on what to prioritize",
      "gpa_target": "Target GPA and why",
      "networking_tips": "Specific networking advice"
    },
    "sophomore": {
      "courses": ["course1", "course2", "course3", "course4"],
      "ap_classes": ["AP class1", "AP class2"],
      "extracurriculars": ["activity1", "activity2", "activity3", "activity4"],
      "passion_projects": ["project1", "project2"],
      "summer": { "activities": ["activity1", "activity2"], "programs": ["program1"], "books": ["Book by Author"] },
      "goals": ["goal1", "goal2", "goal3"],
      "monthly_focus": "",
      "gpa_target": "",
      "networking_tips": ""
    },
    "junior": {
      "courses": ["course1", "course2", "course3", "course4"],
      "ap_classes": ["AP class1", "AP class2"],
      "extracurriculars": ["activity1", "activity2", "activity3", "activity4"],
      "passion_projects": ["project1", "project2"],
      "summer": { "activities": ["activity1", "activity2"], "programs": ["program1"], "books": ["Book by Author"] },
      "goals": ["goal1", "goal2", "goal3"],
      "monthly_focus": "",
      "gpa_target": "",
      "networking_tips": ""
    },
    "senior": {
      "courses": ["course1", "course2", "course3", "course4"],
      "ap_classes": ["AP class1", "AP class2"],
      "extracurriculars": ["activity1", "activity2", "activity3", "activity4"],
      "passion_projects": ["project1", "project2"],
      "summer": { "activities": ["activity1", "activity2"], "programs": ["program1"], "books": ["Book by Author"] },
      "goals": ["goal1", "goal2", "goal3"],
      "monthly_focus": "",
      "gpa_target": "",
      "networking_tips": ""
    }
  },
  "universities": [
    {
      "name": "University Name",
      "program": "Program name",
      "location": "City, State",
      "admit_likelihood": "72%",
      "why_fit": "3-4 sentences",
      "avg_gpa": "3.7",
      "avg_sat": "1350",
      "notable_programs": "What makes this school special",
      "application_tip": "Specific tip"
    }
  ],
  "scholarships": [
    {
      "name": "Scholarship Name",
      "amount": "$X,000",
      "deadline": "Month YYYY",
      "eligibility": "Requirements",
      "link": "https://fastweb.com",
      "how_to_stand_out": "Specific advice"
    }
  ],
  "internships": [
    {
      "name": "Program Name",
      "type": "Internship",
      "grade_level": "Junior",
      "description": "2-3 sentence description",
      "link": "https://indeed.com",
      "how_to_apply": "Specific steps"
    }
  ],
  "resources": {
    "books": ["Book Title by Author - why it matters"],
    "youtube_channels": ["Channel Name - what they teach"],
    "online_courses": ["Course on Platform - skills learned"]
  },
  "life_skills": {
    "time_management": "5-6 sentences specific to this student and career path",
    "stress_management": "5-6 sentences specific to this student",
    "money_management": "5-6 sentences specific to this student"
  },
  "standardized_tests": [
    {
      "test": "SAT",
      "when_to_take": "Junior year spring",
      "target_score": "1400+",
      "why": "2-3 sentences",
      "prep_resources": "Specific free resources"
    }
  ],
  "college_application_timeline": {
    "junior_year": ["Task with month"],
    "summer_before_senior": ["Task"],
    "september": ["Task"],
    "october": ["Task"],
    "november": ["Task"],
    "december": ["Task"],
    "january": ["Task"],
    "february_march": ["Task"],
    "april_may": ["Task including May 1 decision day"]
  }
}

Generate 3 career matches, 6 universities, 5 scholarships, 4 internships. Make everything specific to this student.`

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
        max_tokens: 8000,
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
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No valid JSON found in response')
    }
    clean = clean.slice(firstBrace, lastBrace + 1)
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
