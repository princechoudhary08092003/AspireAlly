# MentorPath

A full-stack Mentor-Mentee platform built with React + Node.js + SQLite (local) / MySQL (production).

## Local Development

### Prerequisites
- Node.js v18+
- No database installation needed (SQLite auto-created)

### Start the App
```bash
# Option 1: Double-click start.bat

# Option 2: Manual
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173**

### Default Admin
- Email: `admin@mentorpath.com`
- Password: `Admin@123`

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — from Razorpay dashboard
- JWT_SECRET — change before production

## Deploy to Hostinger

1. Set `DB_DIALECT=mysql` in `.env`
2. Fill in MySQL credentials from Hostinger panel
3. Change `NODE_ENV=production`
4. Upload `/server` to Hostinger Node.js app
5. Build frontend: `cd client && npm run build`
6. Upload `client/dist` as static files

## Color Scheme
- Primary Blue: `#1D4ED8`
- Secondary Maroon: `#881337`
- Gold Accent: `#F59E0B`
- Font: Poppins

## Pages & Features
- `/` — Landing page
- `/mentors` — Browse all mentors
- `/mentors/:id` — Mentor profile + booking
- `/pricing` — Subscription plans (Razorpay)
- `/login` / `/register` — Auth
- `/mentee/dashboard` — Booking management
- `/mentor/dashboard` — Slot management + meeting links
- `/mentor/profile` — Edit mentor profile
- `/admin` — Admin dashboard
- `/admin/mentors` — Approve / manage mentors
- `/admin/mentees` — Manage mentees
- `/admin/bookings` — All bookings
- `/admin/subscriptions` — Revenue reports
