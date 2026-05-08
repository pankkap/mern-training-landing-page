import { Video, FileText, Download, Smartphone, Trophy, RefreshCcw } from 'lucide-react'

const includes = [
  { icon: Video, text: '100 hours on-demand video' },
  { icon: FileText, text: '25 articles and reading materials' },
  { icon: Download, text: 'Downloadable source code for every project' },
  { icon: Smartphone, text: 'Access on mobile, tablet, and desktop' },
  { icon: RefreshCcw, text: 'Full lifetime access' },
  { icon: Trophy, text: 'Shareable certificate of completion' },
]

function Benefits() {
  return (
    <section id="benefits" className="bg-gray-50 py-16">
      <div className="page-shell">
        <h2 className="section-heading">This Course Includes</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {includes.map((item) => (
            <div key={item.text} className="flex items-center gap-3 card card-shadow px-5 py-4">
              <item.icon className="h-5 w-5 shrink-0 text-indigo-500" />
              <p className="text-sm font-medium text-gray-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits
