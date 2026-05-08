import { Award, BriefcaseBusiness, CheckCircle2, GraduationCap } from 'lucide-react'

const profileImage =
  'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhhDGpdbvfWrwt_5c_YIraqaxGEfIxTZ_9ggHQH5jUa_vf6MAZoABt8V3sCgFq6xbS_4OEGdreglfjDNVkJOITvfGwLgQS0UiQ4m4gAX6HsXwJGVOtX9CDpaYlLxQ8MKYs98WJt_DShjdeys5daRfVwpGStWtO8d46WS31a8HaQua91W_rYzXXw8d8qnS75/w182-h182/Pankaj%20Kapoor-modified.png'

const expertise = [
  'Frontend: HTML5, CSS3, JavaScript, React',
  'Backend: Node.js, Express.js, REST API architecture',
  'Databases: MongoDB, MySQL',
  'Cloud/DevOps: AWS, Docker, CI/CD, Linux, GitHub',
  'Mobile: React Native, Flutter',
]

const credentials = [
  'Full Stack Technology Expert',
  'Mobile Technology Expert',
  'Java Technology Expert',
  'Python Certified Professional',
  'Microsoft Power Platform Certified',
]

function Instructor() {
  return (
    <section id="instructor" className="bg-gray-50 py-16">
      <div className="page-shell">
        <h2 className="section-heading">Your Instructor</h2>

        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_70px_-48px_rgba(15,23,42,0.32)] sm:p-8">
          <div className="grid gap-7 lg:grid-cols-[220px_1fr] lg:items-start">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-center shadow-sm">
              <div className="mx-auto w-fit overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50 p-1.5">
                <img
                  src={profileImage}
                  alt="Pankaj Kapoor"
                  className="h-36 w-36 rounded-xl object-cover"
                  loading="lazy"
                />
              </div>

              <h3 className="mt-4 text-xl font-extrabold text-gray-900">Pankaj Kapoor</h3>
              <p className="mt-1 text-sm text-indigo-700">Director, Beta-Labs</p>

              <div className="mt-5 space-y-2 text-left text-xs sm:text-sm">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                  <BriefcaseBusiness className="h-4 w-4 text-indigo-600" />
                  <span>15+ years experience</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                  <span>Industry-ready mentoring</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700">
                  <Award className="h-4 w-4 text-indigo-600" />
                  <span>Hands-on practical training</span>
                </div>
              </div>
            </div>

            <div>
              <p className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-700">
                About Instructor
              </p>

              <h3 className="mt-3 text-2xl font-extrabold text-gray-900">Pankaj Kapoor</h3>
              <p className="mt-1 text-sm font-medium text-indigo-700">Director, Beta-Labs</p>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
                Pankaj brings over 15 years of experience training freshers and working professionals in Information
                Systems and Technology. His teaching approach is practical and project-driven, focused on real-world
                implementation, clean coding habits, and job-ready execution.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    Project-first teaching style
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                    Strong interview-oriented guidance
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 sm:col-span-2">
                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <Award className="h-4 w-4 text-indigo-600" />
                    Certified trainer across Full Stack, Mobile, Java, Python, and Microsoft Power Platform domains
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold text-gray-900">Key Expertise</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {expertise.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 sm:text-sm"
                    >
                      {item}
                    </span>
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

export default Instructor
