import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PathwayIQ — Your Personalized 4-Year Roadmap',
  description:
    'Answer 12 questions and get a fully personalized high school roadmap — courses, APs, universities, scholarships, internships, and more.',
  openGraph: {
    title: 'PathwayIQ',
    description: 'Your personalized 4-year high school roadmap.',
    url: 'https://pathwayiq.vercel.app',
    siteName: 'PathwayIQ',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}