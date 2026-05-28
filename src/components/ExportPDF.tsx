'use client'

import { useState } from 'react'

interface Props {
  roadmapTitle: string
}

export default function ExportPDF({ roadmapTitle }: Props) {
  const [exporting, setExporting] = useState(false)

  function handleExport() {
    setExporting(true)
    const style = document.createElement('style')
    style.id = 'print-style'
    style.innerHTML = `
      @media print {
        body > *:not(#roadmap-print-wrapper) { display: none !important; }
        #roadmap-print-wrapper { display: block !important; }
        nav { display: none !important; }
        button { display: none !important; }
        .no-print { display: none !important; }
        body { background: white !important; color: black !important; }
        * { color: black !important; background: white !important; border-color: #ccc !important; }
      }
    `
    document.head.appendChild(style)
    document.title = `${roadmapTitle} - PathwayIQ`
    window.print()
    setTimeout(() => {
      document.head.removeChild(style)
      setExporting(false)
    }, 1000)
  }

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
    >
      {exporting ? (
        <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Exporting...</>
      ) : (
        <>📄 Export PDF</>
      )}
    </button>
  )
}
