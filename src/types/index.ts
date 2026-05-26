export type Profile = {
  id: string
  user_id: string
  name: string
  grade: string
  created_at: string
}

export type QuizAnswers = {
  1: string[]  // subjects
  2: string    // free time
  3: string    // work environment
  4: string    // problem type
  5: string    // math/science comfort
  6: string    // creative vs structured
  7: string    // GPA
  8: string    // location
  9: string    // career in mind
  10: string[] // career values
  11: string[] // constraints
  12: string   // work style
}

export type CareerMatch = {
  title: string
  fit_score: number
  description: string
  salary_range: string
  growth_outlook: string
}

export type YearPlan = {
  courses: string[]
  ap_classes: string[]
  extracurriculars: string[]
  passion_projects: string[]
  summer: {
    activities: string[]
    programs: string[]
    books: string[]
  }
  goals: string[]
  monthly_focus: string
}

export type University = {
  name: string
  program: string
  location: string
  admit_likelihood: string
  why_fit: string
  avg_gpa: string
  avg_sat: string
}

export type Scholarship = {
  name: string
  amount: string
  deadline: string
  eligibility: string
  link: string
}

export type Internship = {
  name: string
  type: string
  grade_level: string
  description: string
  link: string
}

export type StandardizedTest = {
  test: string
  when_to_take: string
  target_score: string
  why: string
}

export type FullPlan = {
  career_matches: CareerMatch[]
  roadmap: {
    freshman: YearPlan
    sophomore: YearPlan
    junior: YearPlan
    senior: YearPlan
  }
  universities: University[]
  scholarships: Scholarship[]
  internships: Internship[]
  resources: {
    books: string[]
    youtube_channels: string[]
    online_courses: string[]
  }
  life_skills: {
    time_management: string
    stress_management: string
    money_management: string
  }
  standardized_tests: StandardizedTest[]
}

export type Roadmap = {
  id: string
  user_id: string
  career_matches: CareerMatch[]
  selected_career: string
  full_plan: FullPlan
  created_at: string
  updated_at: string
}