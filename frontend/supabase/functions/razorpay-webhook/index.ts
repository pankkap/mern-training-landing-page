import { createClient } from 'npm:@supabase/supabase-js@2.49.1'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RAZORPAY_WEBHOOK_SECRET) {
  throw new Error('Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RAZORPAY_WEBHOOK_SECRET')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const hex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

const timingSafeEqual = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return out === 0
}

const hmacSha256Hex = async (payload: string, secret: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return hex(sig)
}

type RazorpayWebhookPayload = {
  event?: string
  payload?: {
    payment?: {
      entity?: {
        id?: string
        order_id?: string | null
        status?: string
        notes?: { registration_id?: string }
        created_at?: number
        captured_at?: number
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'GET') {
    return Response.json({ ok: true, service: 'razorpay-webhook' }, { status: 200 })
  }

  if (req.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 })
  }

  const signature = req.headers.get('x-razorpay-signature') || ''
  if (!signature) {
    return Response.json({ ok: false, error: 'Missing x-razorpay-signature header' }, { status: 401 })
  }

  const rawBody = await req.text()
  const expectedSignature = await hmacSha256Hex(rawBody, RAZORPAY_WEBHOOK_SECRET)

  if (!timingSafeEqual(signature, expectedSignature)) {
    return Response.json({ ok: false, error: 'Invalid webhook signature' }, { status: 401 })
  }

  let body: RazorpayWebhookPayload
  try {
    body = JSON.parse(rawBody) as RazorpayWebhookPayload
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON payload' }, { status: 400 })
  }

  const event = body.event || ''
  const payment = body.payload?.payment?.entity
  const paymentId = payment?.id || null
  const orderId = payment?.order_id || null
  const registrationId = payment?.notes?.registration_id || null

  if (!paymentId) {
    return Response.json({ ok: false, error: 'Missing payment id in webhook payload' }, { status: 400 })
  }

  const updateValues: Record<string, string | null> = {
    razorpay_payment_id: paymentId,
    razorpay_order_id: orderId,
  }

  if (event === 'payment.captured') {
    const paidAtEpoch = payment?.captured_at || payment?.created_at || Math.floor(Date.now() / 1000)
    updateValues.payment_status = 'paid'
    updateValues.paid_at = new Date(paidAtEpoch * 1000).toISOString()
  } else if (event === 'payment.failed') {
    updateValues.payment_status = 'failed'
  } else if (event === 'payment.authorized') {
    // Do not mark paid on authorization; wait for capture.
  } else {
    return Response.json({ ok: true, ignored: true, event }, { status: 200 })
  }

  let query = supabase.from('registrations').update(updateValues)

  if (registrationId) {
    query = query.eq('id', registrationId)
  } else {
    query = query.eq('razorpay_payment_id', paymentId)
  }

  const { data, error } = await query.select('id')

  if (error) {
    return Response.json(
      { ok: false, error: 'Database update failed', detail: error.message, event, paymentId, registrationId },
      { status: 500 },
    )
  }

  if (!data || data.length === 0) {
    return Response.json(
      {
        ok: true,
        warning: 'No matching registration row found',
        event,
        paymentId,
        registrationId,
      },
      { status: 202 },
    )
  }

  return Response.json(
    {
      ok: true,
      event,
      paymentId,
      registrationId,
      updatedRegistrationIds: data.map((row) => row.id),
    },
    { status: 200 },
  )
})
