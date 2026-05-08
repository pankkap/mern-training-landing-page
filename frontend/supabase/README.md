# Supabase Setup

## 1) Run Schema

Open Supabase SQL editor and run:

- `frontend/supabase/schema.sql`

This creates:

- `profiles` table (role-based access)
- `registrations` table (payment + transaction details)
- RLS policies for anon registration and admin read access

## 2) Create Admin User

1. Sign up once from `/admin` with your email/password.
2. In Supabase SQL editor, run:

```sql
insert into public.profiles (id, role, full_name)
values ('<auth_user_uuid>', 'admin', 'Admin User')
on conflict (id) do update set role = 'admin';
```

Replace `<auth_user_uuid>` with the user id from `auth.users`.

## 3) Frontend Environment Variables

Set these in frontend environment:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_RAZORPAY_KEY_ID` (optional for UI usage)

## 4) Admin Panel

Go to `/admin`.

- Admin can view paid users and transaction ids.
- Non-admin users are blocked by role check + RLS.

## 5) Razorpay Webhook (Recommended for Production)

Use webhook updates so your database status stays correct even if frontend callbacks fail.

### Function file

- `frontend/supabase/functions/razorpay-webhook/index.ts`

### Deploy steps

1. Install/login to Supabase CLI.
2. From `frontend/` folder run:

```bash
supabase functions deploy razorpay-webhook
```

3. Set function secrets (same project where your tables exist):

```bash
supabase secrets set SUPABASE_URL=https://xaokffsutcrhwroscupk.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
supabase secrets set RAZORPAY_WEBHOOK_SECRET=<your_random_webhook_secret>
```

4. Webhook URL to configure in Razorpay dashboard:

```text
https://xaokffsutcrhwroscupk.functions.supabase.co/razorpay-webhook
```

### Razorpay dashboard settings

Create webhook in Razorpay with:

- Webhook URL: `https://xaokffsutcrhwroscupk.functions.supabase.co/razorpay-webhook`
- Secret: same value as `RAZORPAY_WEBHOOK_SECRET`
- Active events:
	- `payment.captured` (mandatory)
	- `payment.failed` (recommended)
	- `payment.authorized` (optional)

### What this webhook updates

- `payment.captured` -> sets `payment_status = paid`, saves `paid_at`, `razorpay_payment_id`, `razorpay_order_id`
- `payment.failed` -> sets `payment_status = failed`, saves Razorpay IDs
- `payment.authorized` -> stores IDs but does not mark `paid`

### Important

- Keep payment status finalization on webhook events for production reliability.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.
