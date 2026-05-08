import { CheckCircle2 } from 'lucide-react'
import CTAButton from './CTAButton'

const perks = [
  '100 hours of on-demand video',
  '50 lectures — beginner to advanced',
  'Downloadable source code for all projects',
  'Payment integration, JWT & MongoDB deep-dives',
  'Lifetime access to course content',
  'Certificate of completion',
]

function Pricing({ onReserve }) {
  return (
    <section id="pricing" className="bg-gray-50 py-16">
      <div className="page-shell">
        <div className="mx-auto max-w-xl overflow-hidden card card-shadow">
          {/* header */}
          <div className="bg-indigo-600 px-7 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">Full Course Access</p>
            <h2 className="mt-1 text-2xl font-extrabold text-white">MERN Stack Training</h2>
          </div>

          <div className="space-y-5 p-7">
            {/* price */}
            <div className="flex items-end gap-3">
              <p className="text-4xl font-extrabold text-gray-900">Rs 7,500</p>
              <p className="mb-1 text-lg font-medium text-gray-400 line-through">Rs 10,500</p>
              <span className="mb-1 rounded bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                First 50 Students Offer
              </span>
            </div>

            {/* checklist */}
            <div className="space-y-2">
              {perks.map((p) => (
                <div key={p} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-indigo-500" />
                  <p className="text-sm text-gray-700">{p}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-amber-400/30 bg-amber-50 px-4 py-3">
              <p className="text-sm leading-relaxed text-amber-800">
                <span className="font-bold">Register now at Rs. 7,500</span> for first 50 students.
                Otherwise, the fee will be Rs. 10,500 from{' '}
                <span className="font-semibold">1st June, 2026</span>.
              </p>
            </div>

            <CTAButton label="Register Now — Rs 7,500" onClick={onReserve} className="w-full py-4 text-base" />
            <p className="text-center text-xs text-gray-500">
              Fee increases to Rs 10,500 from 1st June, 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
