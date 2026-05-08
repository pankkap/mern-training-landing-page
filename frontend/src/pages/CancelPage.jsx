import { Link } from 'react-router-dom'

function CancelPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-indigo-50 px-4">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">✕</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>
        <p className="mt-3 text-sm text-gray-600">
          You haven't been charged. Your enrollment is not yet complete.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Back to Course — Try Again
        </Link>
      </section>
    </main>
  )
}

export default CancelPage
