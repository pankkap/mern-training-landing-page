import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, RotateCcw, Trash2 } from 'lucide-react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from '../lib/firebaseClient'

const toDate = (value) => {
  if (!value) return null
  if (value?.toDate) return value.toDate()
  return new Date(value)
}

function AdminPage() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [authError, setAuthError] = useState('')
  const [paidRegistrations, setPaidRegistrations] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [exporting, setExporting] = useState(false)

  const loadPaidRegistrations = useCallback(async () => {
    try {
      setTableLoading(true)
      setAuthError('')

      const registrationsQuery = query(
        collection(db, 'registrations'),
        orderBy('created_at', 'desc'),
      )

      const unsubscribe = onSnapshot(
        registrationsQuery,
        (snapshot) => {
          const registrations = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }))
          setPaidRegistrations(registrations)
          setTableLoading(false)
        },
        (error) => {
          setAuthError(error.message || 'Failed to load registrations.')
          setPaidRegistrations([])
          setTableLoading(false)
        },
      )

      return unsubscribe
    } catch (error) {
      setAuthError(error.message || 'Failed to load registrations.')
      setPaidRegistrations([])
      setTableLoading(false)
      return () => {}
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSession(user ? { user } : null)
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    let unsubscribeRegistrations

    const checkAdminAndLoadData = async () => {
      if (!session?.user?.uid) {
        setIsAdmin(false)
        setPaidRegistrations([])
        return
      }

      setAuthError('')

      const profileRef = doc(db, 'profiles', session.user.uid)
      const profileSnapshot = await getDoc(profileRef)
      const profile = profileSnapshot.exists() ? profileSnapshot.data() : null

      if (!profile || profile.role !== 'admin') {
        setIsAdmin(false)
        setAuthError('You are signed in, but this account does not have admin access.')
        return
      }

      setIsAdmin(true)
      unsubscribeRegistrations = await loadPaidRegistrations()
    }

    checkAdminAndLoadData().catch((error) => {
      setAuthError(error.message || 'Unable to load admin data right now.')
      setIsAdmin(false)
      setTableLoading(false)
    })

    return () => {
      if (unsubscribeRegistrations) {
        unsubscribeRegistrations()
      }
    }
  }, [loadPaidRegistrations, session])

  const handleLogin = async (event) => {
    event.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setAuthError(error.message || 'Unable to sign in right now.')
    }

    setAuthLoading(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    setIsAdmin(false)
    setPaidRegistrations([])
  }

  const handleToggleReviewStatus = async (row) => {
    const nextStatus = row.payment_review_status === 'checked' ? 'pending' : 'checked'
    setActionLoadingId(row.id)
    setAuthError('')

    try {
      await updateDoc(doc(db, 'registrations', row.id), {
        payment_review_status: nextStatus,
        updated_at: serverTimestamp(),
      })
      setPaidRegistrations((current) => current.map((r) => (
        r.id === row.id ? { ...r, payment_review_status: nextStatus } : r
      )))
    } catch (error) {
      setAuthError(error.message || 'Failed to update payment review status.')
    }

    setActionLoadingId(null)
  }

  const handleDeleteRegistration = async (registrationId) => {
    setActionLoadingId(registrationId)
    setAuthError('')

    try {
      await deleteDoc(doc(db, 'registrations', registrationId))
      setPaidRegistrations((current) => current.filter((row) => row.id !== registrationId))
    } catch (error) {
      setAuthError(error.message || 'Failed to delete registration record.')
    }

    setActionLoadingId(null)
    setDeleteTarget(null)
  }

  const handleExportExcel = async () => {
    if (!paidRegistrations.length) {
      return
    }

    try {
      setExporting(true)
      const XLSX = await import('xlsx')
      const exportRows = paidRegistrations.map((row) => ({
        Name: row.name,
        Email: row.email,
        Phone: row.phone,
        Amount: row.amount,
        TransactionId: row.razorpay_payment_id || '',
        Status: row.payment_status === 'paid' ? 'Paid' : 'Pending',
        PaidAt: row.paid_at ? toDate(row.paid_at)?.toLocaleString() : '',
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportRows)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'All Registrations')
      XLSX.writeFile(workbook, 'all-registrations.xlsx')
    } catch (error) {
      setAuthError(error.message || 'Failed to export Excel file.')
    } finally {
      setExporting(false)
    }
  }

  if (!session) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Admin Access</p>
          <h1 className="mt-2 text-2xl font-extrabold text-gray-900">Sign in to Admin Panel</h1>
          <p className="mt-2 text-sm text-gray-500">Only admin users can view registrations.</p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Enter your password"
                required
              />
            </div>

            {authError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{authError}</p>}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <Link to="/" className="mt-5 inline-block text-sm font-medium text-indigo-600 underline underline-offset-2">
            Back to Landing Page
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <section className="page-shell">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Admin Panel</p>
              <h1 className="mt-1 text-2xl font-extrabold text-gray-900">All Registrations</h1>
              <p className="mt-1 text-sm text-gray-500">View all users and their payment progress.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={!paidRegistrations.length || exporting}
                className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting ? 'Exporting...' : 'Export Excel'}
              </button>
              <Link to="/" className="text-sm font-medium text-indigo-600 underline underline-offset-2">Go to Landing</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>

          {authError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{authError}</p>}

          {!isAdmin ? (
            <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
              This user is not configured as admin in the profiles collection.
            </p>
          ) : tableLoading ? (
            <p className="mt-6 text-sm text-gray-500">Loading registrations...</p>
          ) : paidRegistrations.length === 0 ? (
            <p className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">No registrations found yet.</p>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3">Paid At</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white text-gray-700">
                  {paidRegistrations.map((row) => (
                    <tr key={row.id}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.name}</td>
                      <td className="px-4 py-3">{row.email}</td>
                      <td className="px-4 py-3">{row.phone}</td>
                      <td className="px-4 py-3">Rs {row.amount}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.razorpay_payment_id || '-'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : row.payment_status === 'failed'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {row.payment_status === 'paid' ? 'Paid' : row.payment_status === 'failed' ? 'Failed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{row.paid_at ? toDate(row.paid_at)?.toLocaleString() : '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title={row.payment_review_status === 'checked' ? 'Mark as Pending' : 'Mark as Checked'}
                            disabled={actionLoadingId === row.id}
                            onClick={() => handleToggleReviewStatus(row)}
                            className={`grid h-8 w-8 place-items-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              row.payment_review_status === 'checked'
                                ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                : 'border-green-200 text-green-600 hover:bg-green-50'
                            }`}
                          >
                            {row.payment_review_status === 'checked'
                              ? <RotateCcw size={14} />
                              : <CheckCircle2 size={14} />}
                          </button>
                          <button
                            type="button"
                            title="Delete Record"
                            disabled={actionLoadingId === row.id}
                            onClick={() => setDeleteTarget(row)}
                            className="grid h-8 w-8 place-items-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Delete Confirmation</p>
            <h2 className="mt-2 text-xl font-extrabold text-gray-900">Delete this registration record?</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              This will permanently remove <span className="font-semibold text-gray-900">{deleteTarget.name}</span> from the admin table,
              including payment and transaction details.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRegistration(deleteTarget.id)}
                disabled={actionLoadingId === deleteTarget.id}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoadingId === deleteTarget.id ? 'Deleting...' : 'Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminPage
