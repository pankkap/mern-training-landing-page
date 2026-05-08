import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const PAYMENT_AMOUNT = 7500
const initialForm = { name: '', email: '', phone: '' }
const PENDING_REGISTRATION_KEY = 'pending_registration_id'
// Razorpay test payment-link reference: https://rzp.io/rzp/ebTYN8xo
const RAZORPAY_CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

const loadRazorpayScript = () => new Promise((resolve) => {
  if (window.Razorpay) {
    resolve(true)
    return
  }

  const script = document.createElement('script')
  script.src = RAZORPAY_CHECKOUT_SCRIPT
  script.async = true
  script.onload = () => resolve(true)
  script.onerror = () => resolve(false)
  document.body.appendChild(script)
})

function ModalForm({ open, onClose, resumePayment }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)          // 1 = form, 2 = payment
  const [registrationId, setRegistrationId] = useState(null)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) {
      return
    }

    // Only auto-resume to Step 2 if explicitly redirected back (e.g. after page reload)
    if (resumePayment?.registrationId) {
      setStep(2)
      setRegistrationId(resumePayment.registrationId)
      return
    }

    // Always show the form (Step 1) so student info is always collected fresh
    setStep(1)
    setForm(initialForm)
    setErrors({})
    setRegistrationId(null)
  }, [open, resumePayment])

  if (!open) return null

  const handleClose = () => {
    setStep(1)
    setForm(initialForm)
    setErrors({})
    setRegistrationId(null)
    setVerifyingPayment(false)
    onClose()
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!/^[0-9]{10}$/.test(form.phone)) next.phone = 'Enter a valid 10-digit phone number'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return
    try {
      setLoading(true)
      const newRegistrationId = crypto.randomUUID()
      const { error } = await supabase
        .from('registrations')
        .insert({
          id: newRegistrationId,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.trim(),
          amount: PAYMENT_AMOUNT,
          payment_status: 'pending',
        })

      if (error) throw error

      localStorage.setItem(PENDING_REGISTRATION_KEY, newRegistrationId)
      setRegistrationId(newRegistrationId)
      setStep(2)
    } catch (error) {
      setErrors({
        submit: error.message || 'Failed to save details. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenRazorpayCheckout = async () => {
    if (!registrationId) {
      setErrors((prev) => ({
        ...prev,
        payment: 'Payment session not found. Please submit the form again.',
      }))
      setStep(1)
      return
    }

    if (!RAZORPAY_KEY_ID) {
      setErrors((prev) => ({
        ...prev,
        payment: 'Razorpay key is missing. Please set VITE_RAZORPAY_KEY_ID in frontend .env.',
      }))
      return
    }

    setVerifyingPayment(true)
    setErrors((prev) => ({ ...prev, payment: undefined }))

    const isCheckoutLoaded = await loadRazorpayScript()

    if (!isCheckoutLoaded || !window.Razorpay) {
      setErrors((prev) => ({
        ...prev,
        payment: 'Unable to load Razorpay checkout. Please check your internet and try again.',
      }))
      setVerifyingPayment(false)
      return
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: PAYMENT_AMOUNT * 100,
      currency: 'INR',
      name: 'MERN Stack Training',
      description: 'Course Registration Fee',
      prefill: {
        name: form.name || undefined,
        email: form.email || undefined,
        contact: form.phone || undefined,
      },
      notes: {
        registration_id: registrationId,
      },
      theme: {
        color: '#4F46E5',
      },
      modal: {
        ondismiss: () => {
          setVerifyingPayment(false)
        },
      },
      handler: async (response) => {
        try {
          console.log('[Payment] Handler fired. registrationId:', registrationId, 'response:', response)
          const { data, error } = await supabase
            .from('registrations')
            .update({
              payment_status: 'paid',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id || null,
              razorpay_signature: response.razorpay_signature || null,
              paid_at: new Date().toISOString(),
            })
            .eq('id', registrationId)
            .select()

          console.log('[Payment] Supabase update result — data:', data, 'error:', error)

          if (error) throw error
          if (!data || data.length === 0) throw new Error(`RLS blocked the update. Registration ID: ${registrationId}. Payment ID: ${response.razorpay_payment_id}. Please contact support.`)

          localStorage.removeItem(PENDING_REGISTRATION_KEY)
          navigate('/success', {
            state: {
              paymentUpdated: true,
              registrationId,
              transactionId: response.razorpay_payment_id,
            },
          })
        } catch (error) {
          setErrors((prev) => ({
            ...prev,
            payment: error.message || 'Payment succeeded, but saving payment details failed. Please contact support.',
          }))
        } finally {
          setVerifyingPayment(false)
        }
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.on('payment.failed', (event) => {
      setErrors((prev) => ({
        ...prev,
        payment: event.error?.description || 'Payment failed. Please try again.',
      }))
      setVerifyingPayment(false)
    })

    razorpay.open()
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-gray-950/70 px-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* header */}
        <div className="bg-indigo-600 px-6 py-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
                {step === 1 ? `Registration — Rs ${PAYMENT_AMOUNT}` : 'Complete Payment'}
              </p>
              <h3 className="mt-1 text-xl font-extrabold text-white">
                {step === 1 ? 'Register Now' : `Scan & Pay Rs ${PAYMENT_AMOUNT}`}
              </h3>
              <div className="mt-3 inline-flex max-w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                <p className="text-sm font-semibold leading-6 text-white">
                  Pay Rs {PAYMENT_AMOUNT} now · Fee increases to Rs 10,500 from 1st June 2026
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* STEP 1 — registration form */}
        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter Your Name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="10-digit mobile number"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {errors.submit && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Continue to Payment →'}
            </button>
          </form>
        )}

        {/* STEP 2 — Razorpay checkout */}
        {step === 2 && (
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            <p className="text-sm text-gray-600">
              Click the button below to open Razorpay checkout and complete payment securely.
            </p>

            <button
              type="button"
              onClick={handleOpenRazorpayCheckout}
              disabled={verifyingPayment}
              className="w-full rounded-lg bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifyingPayment ? 'Opening Razorpay...' : `Pay Rs ${PAYMENT_AMOUNT} with Razorpay`}
            </button>

            {errors.payment && <p className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.payment}</p>}

            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg border border-gray-300 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <p className="text-xs text-gray-400">
              Transaction ID will be captured automatically after successful payment.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

export default ModalForm
