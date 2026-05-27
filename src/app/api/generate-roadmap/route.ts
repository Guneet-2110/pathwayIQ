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
You are a world-class high school career counselor, college advisor, and life coach. Based on the following student quiz answers, generate an extremely detailed, personalized career roadmap.

STUDENT ANSWERS:
${JSON.stringify(answers, null, 2)}

Return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation. Just raw JSON.

CRITICAL RULES:
- Every piece of advice must be specific to THIS student's grade, location, interests, GPA, and career goals
- For internship and scholarship links, ONLY use real, well-known URLs that definitely exist (e.g. https://www.usajobs.gov, https://www.indeed.com/q-internship-l-remote.html, https://www.fastweb.com, https://www.scholarships.com). Do NOT make up specific company URLs. If unsure, use the organization's main homepage only.
- Life skills advice must directly reference the student's specific career path and situation
- Every year of the roadmap must have at least 4 items in each array
- Be extremely specific — not "join a club" but "join the robotics club or start a coding club if your school doesn't have one"

{
  "career_matches": [
    {
      "title": "Career Title",
      "fit_score": 92,
      "description": "3-4 sentence description of this career and exactly why it fits this specific student based on their answers",
      "salary_range": "$X - $Y per year",
      "growth_outlook": "High / Medium / Low",
      "day_in_life": "2-3 sentences describing a typical day in this career",
      "top_skills_needed": ["skill1", "skill2", "skill3"],
      "biggest_challenges": "2 sentences on the hardest parts of this career"
    }
  ],
  "roadmap": {
    "freshman": {
      "courses": ["Specific course name and why it matters for this career"],
      "ap_classes": ["Specific AP class — take in sophomore or junior year to prepare"],
      "extracurriculars": ["Specific activity with exact reason it helps this career path"],
      "passion_projects": ["Detailed project idea with specific steps to start"],
      "summer": {
        "activities": ["Specific activity with provider name if applicable"],
        "programs": ["Real program name, who runs it, and approximate cost/free status"],
        "books": ["Book Title by Author — one sentence on why this book matters for this career"]
      },
      "goals": ["Specific measurable goal for this year"],
      "monthly_focus": "Detailed paragraph on exactly what to prioritize month by month this year",
      "gpa_target": "Target GPA and why it matters for this career path",
      "networking_tips": "Specific advice on who to connect with and how this year"
    },
    "sophomore": {
      "courses": [], "ap_classes": [], "extracurriculars": [], "passion_projects": [],
      "summer": { "activities": [], "programs": [], "books": [] },
      "goals": [], "monthly_focus": "", "gpa_target": "", "networking_tips": ""
    },
    "junior": {
      "courses": [], "ap_classes": [], "extracurriculars": [], "passion_projects": [],
      "summer": { "activities": [], "programs": [], "books": [] },
      "goals": [], "monthly_focus": "", "gpa_target": "", "networking_tips": ""
    },
    "senior": {
      "courses": [], "ap_classes": [], "extracurriculars": [], "passion_projects": [],
      "summer": { "activities": [], "programs": [], "books": [] },
      "goals": [], "monthly_focus": "", "gpa_target": "", "networking_tips": ""
    }
  },
  "universities": [
    {
      "name": "University Name",
      "program": "Specific program name",
      "location": "City, State",
      "admit_likelihood": "72%",
      "why_fit": "3-4 sentences on exactly why this university fits this student's career goals, location preference, and financial situation",
      "avg_gpa": "3.7",
      "avg_sat": "1350",
      "notable_programs": "What makes this school's program special for this career",
      "application_tip": "Specific tip for this student applying to this school"
    }
  ],
  "scholarships": [
    {
      "name": "Scholarship Name",
      "amount": "$X,000",
      "deadline": "Month YYYY or Rolling",
      "eligibility": "Specific eligibility requirements",
      "link": "https://real-main-homepage-only.org",
      "how_to_stand_out": "Specific advice for this student to win this scholarship"
    }
  ],
  "internships": [
    {
      "name": "Program or Company Name",
      "type": "Internship / Fellowship / Volunteer",
      "grade_level": "Junior / Senior / Any",
      "description": "2-3 sentence description of what you do and what you learn",
      "link": "https://real-main-homepage-only.org",
      "how_to_apply": "Specific steps this student should take to apply and stand out"
    }
  ],
  "resources": {
    "books": ["Book Title by Author — specific reason this book helps for this exact career"],
    "youtube_channels": ["Channel Name — specific description of what they teach and which videos to watch first"],
    "online_courses": ["Course Name on Platform — specific skills learned and why relevant to this career path"]
  },
  "life_skills": {
    "time_management": "Write 5-6 sentences of highly specific advice for THIS student. Reference their grade, their career path, and their specific challenges. Include a concrete daily/weekly schedule suggestion, specific tools or apps to use, and how to balance academics with extracurriculars for their career goals.",
    "stress_management": "Write 5-6 sentences of highly specific advice for THIS student. Reference the specific stressors of pursuing their chosen career path. Include concrete techniques, when to use them, and how to maintain mental health while being ambitious in high school.",
    "money_management": "Write 5-6 sentences of highly specific advice for THIS student. Reference the financial realities of their chosen career path, college costs for their target universities, specific ways to save and earn money in high school, and how to think about scholarships vs loans for their situation."
  },
  "standardized_tests": [
    {
      "test": "SAT / ACT / AP Exam Name",
      "when_to_take": "Specific month and year recommendation based on student grade",
      "target_score": "Specific score target based on their university list",
      "why": "2-3 sentences on exactly why this test matters for their specific career and university goals",
      "prep_resources": "Specific free or low-cost prep resources for this test"
    }
  ],
  "college_application_timeline": {
    "junior_year": ["Specific task with exact month — e.g. March Junior Year: Register for SAT"],
    "summer_before_senior": ["Specific task with timeline"],
    "september": ["Specific college app task for September senior year"],
    "october": ["Specific tasks"],
    "november": ["Specific tasks including Early Decision deadlines"],
    "december": ["Specific tasks"],
    "january": ["Specific tasks including Regular Decision deadlines"],
    "february_march": ["Specific tasks"],
    "april_may": ["Specific tasks including decision day May 1"]
  }
}

Make everything specific to this sudden. Generate 3 career matches, 6 universities, 5 scholarships, 4 internships. Fill every single array with detailed specific items. The life_skills fields must be detailed paragraphs not short sentences.
`
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
        max_tokens: 8000,
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
