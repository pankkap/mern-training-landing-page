    # MERN Stack Bootcamp - Landing Page

Course landing page with registration form, Razorpay payment flow, and admin dashboard.

## Stack

- Frontend: React 19 + Vite + Tailwind CSS + React Router
- Database and Auth: Firebase Authentication + Cloud Firestore
- Payment: Razorpay Checkout SDK
- Export: SheetJS (xlsx)

## Setup

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Configure environment variables in `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
```

3. Run development server:

```bash
cd frontend
npm run dev
```

## Firebase Collections

### registrations

- id
- name
- email
- phone
- amount
- payment_status: pending | paid | failed
- payment_review_status: pending | checked
- razorpay_payment_id
- razorpay_order_id
- razorpay_signature
- paid_at
- created_at
- updated_at

### profiles

- uid as document id
- role: admin | student
- full_name

## Admin Access

- Route: /admin
- Sign in with Firebase email/password auth
- User must have a `profiles/{uid}` document with `role: "admin"`

## Payment Flow

1. User submits name/email/phone.
2. App creates pending registration in Firestore.
3. Razorpay checkout opens.
4. On success, app updates Firestore with payment details.
5. Success page retries the Firestore update if needed.
