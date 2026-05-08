import { useState } from 'react'
import { ChevronDown, ChevronUp, PlayCircle } from 'lucide-react'

const sections = [
  {
    title: 'Introduction to MERN Stack',
    lectures: 1,
    duration: '2 hrs',
    items: ['Course overview & setup', 'How MERN stack works together', 'Dev environment & tooling', 'Project preview walkthrough'],
  },
  {
    title: 'JavaScript & ES6+ Essentials',
    lectures: 2,
    duration: '4 hrs',
    items: ['Arrow functions & scoping', 'Destructuring & spread operator', 'Promises & async/await', 'ES modules & imports', 'Fetch API Case Study'],
  },
  {
    title: 'React — From Basics to Advanced',
    lectures: 5,
    duration: '10 hrs',
    items: ['Components & JSX fundamentals', 'useState, useEffect, useRef hooks', 'Context API & state management', 'React Router v6 & navigation', 'Capstone Project-1: Building a Movie Explorer App with React & Bootstrap', 'Capstone Project-2: Building a Task Manager App with React & Firebase'],
  },
  {
    title: 'Backend: Node.js & Express',
    lectures: 3,
    duration: '6 hrs',
    items: ['Express server setup', 'RESTful API design patterns', 'Middleware, validation & error handling', 'JWT authentication & authorization'],
  },
  {
    title: 'MongoDB & Mongoose',
    lectures: 7,
    duration: '14 hrs',
    items: ['MongoDB Atlas setup', 'Schema design & relationships', 'CRUD operations', 'Aggregation pipelines & indexing','Capstone Project-3: Building a Job Portal with React, Node.js, Express & MongoDB' ],
  },
  {
    title: 'Capstone Projects: Full-stack Web Applications',
    lectures: 5,
    duration: '10 hrs',
    items: ['Capstone Project-4: Building a Quick-Commerce Store — React, Node.js, Express.js, MongoDB, Payment Integration', 'Capstone Project-5: Building an AI Test Builder Platform — React, Node.js, Express.js, MongoDB, Gemini/OpenAI API Integration'],
  },
  {
    title: 'Deployment, DevOps & Modern Tools',
    lectures: 2,
    duration: '4 hrs',
    items: ['Linux command line essentials', 'Docker for development & deployment', 'CI/CD pipelines with GitHub Actions', 'Cloud deployment with Vercel, Render, AWS EC2 & S3 '],
  },
]

function Curriculum() {
  const [open, setOpen] = useState(0)
  const totalLectures = sections.reduce((s, sec) => s + sec.lectures, 0)

  return (
    <section id="curriculum" className="py-16">
      <div className="page-shell">
        <h2 className="section-heading">Course Curriculum</h2>
        <p className="mt-2 text-sm text-gray-500">
          {sections.length} sections &bull; {totalLectures} lectures &bull; 22 hours total length
        </p>

        <div className="mt-6 overflow-hidden card card-shadow">
          {sections.map((sec, index) => {
            const isOpen = open === index
            return (
              <div key={sec.title} className="border-b border-gray-200 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left transition hover:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? (
                      <ChevronUp size={17} className="shrink-0 text-gray-500" />
                    ) : (
                      <ChevronDown size={17} className="shrink-0 text-gray-500" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">{sec.title}</span>
                  </div>
                  <span className="shrink-0 text-xs text-gray-500">
                    {sec.lectures} lectures &bull; {sec.duration}
                  </span>
                </button>
                {isOpen && (
                  <div className="divide-y divide-gray-100">
                    {sec.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 py-3 pl-12 pr-5">
                        <PlayCircle size={13} className="shrink-0 text-indigo-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Curriculum
