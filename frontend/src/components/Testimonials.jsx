import { Star } from 'lucide-react'

function Stars({ n = 5 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={12} className={i <= n ? 'fill-amber-400 text-amber-400' : 'text-gray-300'} />
      ))}
    </span>
  )
}

const reviews = [
  { name: 'Aarav S.', role: 'Frontend Developer', rating: 5, date: 'April 2026',
    text: 'Best MERN course I\'ve taken. Went from knowing nothing to shipping a real full-stack app in 10 weeks.' },
  { name: 'Megha R.', role: 'Software Intern', rating: 5, date: 'March 2026',
    text: 'The curriculum is structured beautifully. The JWT auth and Stripe modules are exceptional.' },
  { name: 'Nikhil K.', role: 'Full Stack Developer', rating: 4, date: 'February 2026',
    text: 'Very practical. Every concept has a real-world code example. Rahul explains complex topics clearly.' },
]

const breakdown = [
  { stars: 5, pct: 72 },
  { stars: 4, pct: 19 },
  { stars: 3, pct: 6 },
  { stars: 2, pct: 2 },
  { stars: 1, pct: 1 },
]

function Testimonials() {
  return (
    <section id="reviews" className="py-16">
      <div className="page-shell">
        <h2 className="section-heading">Student Reviews</h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Rating summary */}
          <div className="card card-shadow flex flex-col items-center gap-4 p-6">
            <p className="text-6xl font-extrabold text-gray-900">4.8</p>
            <Stars n={5} />
            <p className="text-sm font-semibold text-amber-600">Course Rating</p>
            <div className="w-full space-y-1.5">
              {breakdown.map(({ stars, pct }) => (
                <div key={stars} className="flex items-center gap-2">
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <Stars n={stars} />
                  <span className="w-8 text-right text-xs text-gray-500">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="space-y-4">
            {reviews.map((r) => (
              <article key={r.name} className="card card-shadow p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <Stars n={r.rating} />
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">{r.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
