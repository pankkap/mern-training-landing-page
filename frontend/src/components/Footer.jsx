function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 px-4 py-12 text-gray-400 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-start">
        {/* brand */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-extrabold text-white">
              M
            </span>
            <p className="text-base font-bold text-white">MERN Stack Training</p>
          </div>
          <p className="mt-3 text-sm">betalabsindia@gmail.com</p>
          <p className="mt-1 text-xs text-gray-500">
            © {new Date().getFullYear()} MERN Stack Training. All rights reserved.
          </p>
        </div>

        {/* nav */}
        <nav className="flex flex-col gap-2 text-sm font-medium sm:items-end">
          {[
            { href: '#learn', label: "What You'll Learn" },
            { href: '#curriculum', label: 'Curriculum' },
            { href: '#instructor', label: 'Instructor' },
            { href: '#faq', label: 'FAQ' },
          ].map(({ href, label }) => (
            <a key={href} href={href} className="transition hover:text-white">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
