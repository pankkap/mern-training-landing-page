import { useEffect, useMemo, useState } from 'react'

function UrgencySection() {
  const target = useMemo(() => Date.now() + 1000 * 60 * 60 * 11 + 1000 * 60 * 47, [])
  const [timeLeft, setTimeLeft] = useState(target - Date.now())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(Math.max(target - Date.now(), 0)), 1000)
    return () => clearInterval(timer)
  }, [target])

  const totalSeconds = Math.floor(timeLeft / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <section className="border-y border-red-200 bg-red-50 py-4">
      <div className="page-shell">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-red-700">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
            <strong>79% discount ends in:</strong>
          </span>
          <span className="font-mono text-base font-bold tracking-wider">
            {pad(hours)}h {pad(minutes)}m {pad(seconds)}s
          </span>
          <span className="text-red-600">— Only 23 seats left at this price</span>
        </div>
      </div>
    </section>
  )
}

export default UrgencySection
