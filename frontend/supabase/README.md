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
