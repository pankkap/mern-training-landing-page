import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    q: 'Is this course suitable for complete beginners?',
    a: 'Yes! The course starts from the fundamentals of JavaScript and progresses to advanced full-stack development. No prior web dev experience is required.',
  },
  {
    q: 'Do I get lifetime access after purchasing?',
    a: 'Absolutely. Once enrolled, you have lifetime access to all course videos, downloadable resources, and any future updates — on any device.',
  },
  {
    q: 'Is Rs 4,999 the full course price?',
    a: 'Yes, Rs 4,999 is the current limited price for the first 50 students. After 1st June, 2026, the fee will be Rs 10,500.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We offer a 5-day money-back guarantee. If you\'re not satisfied for any reason within 5 days of enrollment, contact support for a full refund.',
  },
  {
    q: 'Will I receive a certificate upon completion?',
    a: 'Yes. After completing all course content, you\'ll receive a shareable certificate of completion you can add to your LinkedIn profile and resume.',
  },
]

function FAQ() {
  const [active, setActive] = useState(null)

  return (
    <section id="faq" className="py-16">
      <div className="page-shell max-w-3xl">
        <h2 className="section-heading">Frequently Asked Questions</h2>
        <div className="mt-6 divide-y divide-gray-200 card card-shadow">
          {faqs.map((item, idx) => {
            const isOpen = active === idx
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setActive(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-gray-50"
                >
                  <span className="pr-4 text-sm font-semibold text-gray-900">{item.q}</span>
                  {isOpen
                    ? <ChevronUp size={17} className="shrink-0 text-indigo-500" />
                    : <ChevronDown size={17} className="shrink-0 text-gray-400" />
                  }
                </button>
                {isOpen && (
                  <p className="border-t border-gray-100 px-6 py-4 text-sm leading-relaxed text-gray-600">
                    {item.a}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
