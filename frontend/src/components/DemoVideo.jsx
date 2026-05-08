function DemoVideo() {
  return (
    <section id="demo" className="bg-gray-50 py-16">
      <div className="page-shell">
        <div className="card card-shadow p-6 sm:p-8">
          <h2 className="section-heading text-center">Preview the Course</h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Watch a free lecture before you enroll
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 shadow-lg">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="MERN Stack Training — Free Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DemoVideo
