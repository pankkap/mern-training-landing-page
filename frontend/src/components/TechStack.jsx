import { CheckCircle2 } from 'lucide-react'

const outcomes = [
  'Build and deploy complete full-stack MERN applications',
  'Master React hooks, Context API, and React Router',
  'Design RESTful APIs with Node.js and Express',
  'Model and query data with MongoDB and Mongoose',
  'Implement JWT-based authentication and authorization',
  'Integrate payments into real projects',
  'Write clean, scalable, production-ready code',
  'Deploy applications to the cloud (Vercel, Render, AWS, EC2, S3)',
  'Learn Linux, Docker, Firebase, Nginx, Postman & Modern Dev Tools',
  'Work with Git, GitHub, and collaborative workflows',
]

function TechStack() {
  return (
    <section id="learn" className="py-16">
      <div className="page-shell">
        <div className="card card-shadow p-7 sm:p-9">
          <h2 className="section-heading">What You'll Learn</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {outcomes.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <p className="text-sm leading-relaxed text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechStack
