# MERN Stack Training — Landing Page

Production-ready course landing page with registration form and Razorpay payment integration. Serverless architecture using Supabase as the backend.

## Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + React Router
- **Database & Auth:** Supabase (PostgreSQL + Row Level Security)
- **Payment:** Razorpay Checkout SDK (auto-captures Transaction ID)
- **Icons:** Lucide React
- **Export:** SheetJS (xlsx)

## Project Structure

```
frontend/
├── src/
│   ├── components/       # UI components (Hero, Pricing, ModalForm, etc.)
│   ├── pages/            # LandingPage, AdminPage, SuccessPage, CancelPage
│   ├── lib/
│   │   └── supabaseClient.js   # Supabase client singleton
│   └── api.js
├── .env                  # Environment variables (see below)
└── supabase/
    └── schema.sql        # Supabase table definitions + RLS policies
```

## Setup

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure environment variables

Create `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxx
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
```

### 3) Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `frontend/supabase/schema.sql`
3. This creates the `registrations` table and all RLS policies

### 4) Run development server

```bash
cd frontend
npm run dev
```

## Payment Flow

1. User fills in **Name, Email, Phone** → saved to Supabase (`payment_status: pending`)
2. Razorpay Checkout SDK popup opens inside the app
3. User completes payment → SDK callback fires
4. **Transaction ID (`razorpay_payment_id`)** auto-saved to Supabase (`payment_status: paid`)
5. User redirected to `/success` page

## Admin Panel

- Route: `/admin`
- Login with Supabase Auth (admin email set in `profiles` table)
- Features: view all registrations, toggle review status, delete, export Excel

## Supabase Tables

### `registrations`
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Student name |
| email | text | Student email |
| phone | text | Phone number |
| amount | int | Amount paid (paise) |
| payment_status | text | `pending` / `paid` |
| razorpay_payment_id | text | Transaction ID (auto-captured) |
| paid_at | timestamptz | Payment timestamp |
| created_at | timestamptz | Registration timestamp |

## No Backend Required

This app is fully serverless. There is no Node.js/Express backend. All data operations go directly from the React frontend to Supabase via the `@supabase/supabase-js` client with RLS policies for security.
}
```

## Payment Flow

1. User opens modal and submits contact details.
2. Frontend calls `/api/register` to create pending registration.
3. Frontend calls `/api/create-checkout-session`.
4. User is redirected to Stripe Checkout.
5. Stripe redirects to `/success` page.
6. Success page calls `/api/payment-success`.
7. Backend verifies Stripe session and marks payment as `paid`.

## Validation

- Frontend build tested with `npm run build`
- Backend syntax checked with `node --check`
