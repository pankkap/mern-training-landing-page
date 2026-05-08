import { useState } from 'react'

const technologies = [
  { name: 'React', src: 'https://cdn.simpleicons.org/react' },
  { name: 'Node.js', src: 'https://cdn.simpleicons.org/nodedotjs' },
  { name: 'Express', src: 'https://cdn.simpleicons.org/express' },
  { name: 'MongoDB', src: 'https://cdn.simpleicons.org/mongodb' },
  { name: 'Git', src: 'https://cdn.simpleicons.org/git' },
  { name: 'GitHub', src: 'https://cdn.simpleicons.org/github' },
  { name: 'Postman', src: 'https://cdn.simpleicons.org/postman' },
  { name: 'AWS', src: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazonwebservices.svg' },
  { name: 'Docker', src: 'https://cdn.simpleicons.org/docker' },
  { name: 'Vercel', src: 'https://cdn.simpleicons.org/vercel' },
  { name: 'Netlify', src: 'https://cdn.simpleicons.org/netlify' },
  { name: 'Render', src: 'https://cdn.simpleicons.org/render' },
  { name: 'Firebase', src: 'https://cdn.simpleicons.org/firebase' },
  { name: 'VS Code', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { name: 'Nginx', src: 'https://cdn.simpleicons.org/nginx' },
  { name: 'Linux', src: 'https://cdn.simpleicons.org/linux' },
  { name: 'Bash', src: 'https://cdn.simpleicons.org/gnubash' },
  { name: 'Gemini', src: 'https://cdn.simpleicons.org/googlegemini' },
  { name: 'EC2', src: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazonec2.svg' },
  { name: 'S3', src: 'https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/amazons3.svg' },
]

const firstRow = technologies.slice(0, 10)
const secondRow = technologies.slice(10)

function TechnologyLogo({ item }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className="tech-logo-chip" aria-label={item.name} title={item.name}>
      {failed ? (
        <span className="tech-logo-fallback">{item.name}</span>
      ) : (
        <img
          src={item.src}
          alt={`${item.name} logo`}
          className="tech-logo-image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}

function TechnologiesSection() {
  return (
    <section aria-labelledby="technologies-used" className="py-10 sm:py-12">
      <div className="page-shell">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white px-5 py-8 shadow-[0_18px_60px_-42px_rgba(15,23,42,0.24)] sm:px-8 sm:py-10">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">Technologies Used</p>
            <h2 id="technologies-used" className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Learn with the tools used in real projects
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            <div className="tech-marquee">
              <div className="tech-marquee-track">
                {[...firstRow, ...firstRow].map((item, index) => (
                  <TechnologyLogo key={`${item.name}-${index}`} item={item} />
                ))}
              </div>
            </div>

            <div className="tech-marquee tech-marquee-reverse">
              <div className="tech-marquee-track">
                {[...secondRow, ...secondRow].map((item, index) => (
                  <TechnologyLogo key={`${item.name}-${index}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TechnologiesSection