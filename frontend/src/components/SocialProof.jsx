import { Users, Star, Clock, PlayCircle } from 'lucide-react'

function SocialProof() {
  const stats = [
    { icon: Users, value: '1500+', label: 'Students Enrolled' },
    { icon: Star, value: '4.8 / 5', label: 'Course Rating' },
    { icon: Clock, value: '100+ hrs', label: 'On-demand Video' },
    { icon: PlayCircle, value: '50', label: 'Total Lectures' },
  ]

  return (
    <section className="border-b border-gray-200 bg-gray-50">
      <div className="page-shell">
        <div className="grid grid-cols-2 divide-x divide-y divide-gray-200 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 px-6 py-5">
              <stat.icon className="h-5 w-5 shrink-0 text-indigo-500" />
              <div>
                <p className="text-lg font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SocialProof
