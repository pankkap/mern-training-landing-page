import CTAButton from './CTAButton'

function Navbar({ onReserve }) {
  const links = [
    { href: '#learn', label: "What You'll Learn" },
    { href: '#curriculum', label: 'Curriculum' },
    { href: '#instructor', label: 'Instructor' },
    { href: '#reviews', label: 'Reviews' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <nav className="page-shell flex items-center justify-between py-3">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            M
          </span>
          <span className="text-base font-bold text-gray-900">MERN Stack Bootcamp</span>
        </a>
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition hover:text-indigo-600"
            >
              {link.label}
            </a>
          ))}
        </div>
        <CTAButton label="Enroll Now" onClick={onReserve} className="py-2.5 px-5 text-xs sm:text-sm" />
      </nav>
    </header>
  )
}

export default Navbar
