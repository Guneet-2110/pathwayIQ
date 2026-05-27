interface Props {
  completed: number
  total: number
}

export default function ProgressBar({ completed, total }: Props) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">Overall Progress</h3>
        <span className="text-indigo-300 font-bold text-lg">{pct}%</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-3">
        <div
          className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-white/40 text-xs mt-2">
        {completed} of {total} items completed
      </p>
    </div>
  )
}
