import { Link, Navigate, useLocation } from 'react-router-dom'

function SuccessPage() {
  const location = useLocation()
  const paymentUpdated = location.state?.paymentUpdated === true

  if (!paymentUpdated) {
    return <Navigate to="/" replace state={{ openPaymentUpdate: true }} />
  }

  return (
    <main className="grid min-h-screen place-items-center bg-indigo-50 px-4">
      <section className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Seat Reserved!</h1>
        <p className="mt-3 text-sm text-gray-600">
          Thank you for registering for <strong>MERN Stack Training</strong>.<br />
          Your seat will be confirmed within 2 hours after payment verification.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Questions? Email us at{' '}
          <a href="mailto:betalabsindia@gmail.com" className="text-indigo-600 underline">
            betalabsindia@gmail.com
          </a>
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Back to Course Page
        </Link>
      </section>
    </main>
  )
}

export default SuccessPage
