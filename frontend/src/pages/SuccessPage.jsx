import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebaseClient'

const PENDING_PAYMENT_UPDATE_KEY = 'pending_payment_update'
const PENDING_REGISTRATION_KEY = 'pending_registration_id'

function SuccessPage() {
  const location = useLocation()
  const paymentUpdated = location.state?.paymentUpdated === true || Boolean(location.state?.transactionId)
  const [synced, setSynced] = useState(location.state?.paymentSynced !== false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (synced) return

    const pending = localStorage.getItem(PENDING_PAYMENT_UPDATE_KEY)
    if (!pending) return

    let parsed
    try { parsed = JSON.parse(pending) } catch { return }

    const { registrationId, updateData } = parsed
    if (!registrationId || !updateData) return

    setSyncing(true)

    const tryUpdate = async () => {
      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          await updateDoc(doc(db, 'registrations', registrationId), {
            ...updateData,
            updated_at: serverTimestamp(),
          })
          localStorage.removeItem(PENDING_PAYMENT_UPDATE_KEY)
          localStorage.removeItem(PENDING_REGISTRATION_KEY)
          setSynced(true)
          setSyncing(false)
          return
        } catch { /* retry */ }
        await new Promise((r) => setTimeout(r, 1500 * attempt))
      }
      setSyncing(false)
    }

    tryUpdate()
  }, [synced])

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
        {!synced && (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {syncing ? 'Syncing payment to database...' : 'Payment recorded. Dashboard will update shortly.'}
          </p>
        )}
        {synced && location.state?.paymentSynced === false && (
          <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
            Payment synced successfully.
          </p>
        )}
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
