import { Star, Users, Clock, Award, ChevronRight, CalendarDays } from 'lucide-react'
import CTAButton from './CTAButton'

function StarRow({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-500'}
        />
      ))}
    </span>
  )
}

function Hero({ onReserve }) {
  return (
    <section id="top" className="relative overflow-hidden bg-gray-900 text-white">
      {/* AI + tech wallpaper layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_82%_24%,rgba(168,85,247,0.16),transparent_34%),radial-gradient(circle_at_50%_88%,rgba(16,185,129,0.14),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.09)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.09)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full border border-indigo-400/30" />
        <div className="absolute right-[-5rem] top-10 h-72 w-72 rounded-full border border-cyan-300/25" />
        <div className="absolute bottom-12 left-1/3 h-48 w-48 rounded-full border border-emerald-300/20" />
      </div>

      <div className="relative page-shell py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch">

          {/* LEFT: course information */}
          <div className="flex flex-1 flex-col gap-5 lg:max-w-2xl lg:justify-center">
            {/* breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400">
              <span>Development</span>
              <ChevronRight size={11} />
              <span>Web Development</span>
              <ChevronRight size={11} />
              <span className="text-indigo-400">MERN Stack</span>
            </nav>

            <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              MERN Stack Web Development 
            </h1>
            <p className="text-lg leading-relaxed text-gray-300">
              Master MongoDB, Express.js, React, and Node.js from scratch.
              Build real-world full-stack apps and become job-ready in 4 weeks.
            </p>

            {/* rating row */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-400">
                Bestseller
              </span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">4.8</span>
                <StarRow rating={4.8} />
                <span className="text-gray-400">(341 ratings)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Users size={13} />
                <span>1500+ students enrolled</span>
              </div>
            </div>

            {/* meta */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-300">
              <span>
                Created by{' '}
                <a href="#instructor" className="font-semibold text-indigo-400 underline underline-offset-2">
                  Pankaj Kapoor
                </a>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> Last updated May 2026
              </span>
              <span className="flex items-center gap-1">
                <Award size={13} /> Certificate included
              </span>
            </div>

            {/* tags */}
            <div className="flex flex-wrap gap-2">
              {['Beginner Friendly', 'English, Hindi', '50 lectures', '100 total hours'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-600 px-3 py-1 text-xs font-medium text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* reservation note */}
            <div className="w-full rounded-xl border border-red-400/70 bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3.5 text-left shadow-[0_0_28px_rgba(239,68,68,0.45)] lg:max-w-xl">
              <p className="text-sm leading-relaxed text-white sm:text-[15px]">
                <span className="font-bold text-white">Register now at Rs. 4,999 for first 50 students.</span>{' '}
                Otherwise, the fee will be <span className="rounded bg-amber-400/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-400">Rs. 10,500 from 1st June, 2026.</span> Register now.
              </p>
            </div>

            {/* mobile CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2 lg:hidden">
              <div>
                <p className="text-3xl font-extrabold">Rs 4,999</p>
                <p className="text-sm text-gray-400 line-through">Rs 10,500</p>
              </div>
              <CTAButton label="Register Now — Rs 4,999" onClick={onReserve} className="px-8 py-3.5 text-base" />
            </div>
          </div>

          {/* RIGHT: pricing card — desktop only */}
          <div className="hidden w-full max-w-sm shrink-0 lg:block">
            <div className="overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 card-shadow">
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-3xl font-extrabold text-white">Rs 4,999</p>
                    <p className="mt-0.5 text-sm text-gray-400 line-through">Rs 10,500</p>
                    <span className="mt-1.5 inline-block rounded bg-red-500/20 px-2 py-0.5 text-xs font-bold text-red-400">
                      Limited offer — First 50 students
                    </span>
                  </div>

                  <div className="shrink-0 rounded-xl border border-indigo-300/45 bg-gradient-to-br from-indigo-500/18 via-slate-900/55 to-cyan-400/18 px-3.5 py-2.5 backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.28),inset_0_0_0_1px_rgba(191,219,254,0.12)]">
                    <p className="flex items-center justify-end gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-100">
                      <CalendarDays className="h-3.5 w-3.5 text-cyan-200" />
                      Course Starts
                    </p>
                    <p className="mt-1 text-base font-extrabold leading-none text-white">1st June 2026</p>
                  </div>
                </div>

                {/* reservation note */}
                <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2.5">
                  <p className="text-xs leading-relaxed text-amber-300">
                    <span className="font-bold">Pay Rs. 4,999 now</span> to secure your seat under this limited offer.
                    Fee becomes Rs. 10,500 from{' '}
                    <span className="font-semibold">1st June 2026</span>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onReserve}
                  className="w-full rounded-lg bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Register Now — Rs 4,999
                </button>
                <p className="text-center text-xs text-gray-400">Fee changes to Rs 10,500 from 1st June 2026</p>

                <div className="space-y-2 border-t border-gray-700 pt-4">
                  {[
                    '100 hours of content',
                    '50+ on-demand video lectures',
                    'Downloadable source code',
                    'Lifetime access',
                    'Certificate of completion',
                  ].map((item) => (
                    <p key={item} className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="font-bold text-indigo-400">✓</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
