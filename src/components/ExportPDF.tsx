'use client'

import { useState } from 'react'

interface Props {
  roadmapTitle: string
}

export default function ExportPDF({ roadmapTitle }: Props) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')

      const element = document.getElementById('roadmap-content')
      if (!element) return

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1e1b4b',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const totalPages = Math.ceil((imgHeight * ratio) / pdfHeight)

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', imgX, -(page * pdfHeight), imgWidth * ratio, imgHeight * ratio)
      }

      pdf.save(`${roadmapTitle.replace(/\s+/g, '-')}-PathwayIQ.pdf`)
    } catch (err) {
      console.error('PDF export error:', err)
    } finally {
      setExporting(false)
    }
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
