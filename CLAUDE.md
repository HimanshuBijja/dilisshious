# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dilisshious — e-commerce platform for gourmet food products. Built with Next.js 16 (App Router), React 19, TypeScript, MongoDB/Mongoose, and Tailwind CSS 4.

## Commands

```bash
npm run dev      # Dev server on localhost:3000
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint
```

## Architecture

### Data Flow
Products use a hybrid loading strategy (`lib/products.ts`): static JSON (`public/data/products.json`) → MongoDB fallback → hardcoded fallback. Products are synced from an external admin panel via `/api/sync-products` (authenticated with `SYNC_SECRET` header).

### State Management
Three React contexts in `lib/`, wrapped by `components/client-layout.tsx`:
- **CartContext** (`cart-context.tsx`) — cart items + drawer UI state, persisted to localStorage
- **CheckoutContext** (`checkout-context.tsx`) — address, delivery, payment, coupon state, persisted to sessionStorage
- **AuthContext** (`auth-context.tsx`) — auth modal visibility, wraps NextAuth SessionProvider

### Authentication
NextAuth.js with JWT strategy (30-day sessions). Two providers:
- Google OAuth
- Phone OTP via Twilio SMS (`/api/auth/otp/send` and `/api/auth/otp/verify`)

Config in `app/api/auth/[...nextauth]/route.ts`. No middleware — auth is checked per-route.

### Database (MongoDB/Mongoose)
Connection cached in `lib/db/mongoose.ts`. Models in `lib/db/models/`:
- **User** — name, email, phone, provider, embedded addresses array with geolocation
- **Product** — slug (unique index), volumes array (label/price/originalPrice), availability
- **Order** — orderId ("DLS" + timestamp), status enum (pending→confirmed→preparing→dispatched→delivered/cancelled), embedded items and address
- **Coupon** — discount rules, usage limits, first-order-only flag
- **QuizResult** — userId (unique), quiz answers object, recommended bundle ID, timestamps
- **Subscription** — userId, bundleId/Name, planId/Name, frequency, bundlePrice, addOns array, total, status (active/paused/cancelled)

Server actions in `lib/db/actions/` (user-actions.ts, order-actions.ts).

### Checkout Flow
Cart → Address selection → Delivery method (standard/express) → UPI payment + optional coupon → Order confirmation + invoice email (Nodemailer).

Payments are UPI-only with manual screenshot verification (no payment gateway).

### Health Quiz (Root Cause Protocol)
6-question onboarding quiz at `/quiz` that recommends a personalised subscription bundle. Self-contained component in `components/root-cause-quiz.tsx` — all questions, bundles, pricing, routing logic, and the result screen live inside it. Four bundles: GRV (gut), HHB (hormones), GFW (skin), PVP (energy). Three plans: 1-Week Trial, Bi-Weekly, Monthly. Optional add-ons.

First-visit redirect: `FirstVisitRedirect` in `client-layout.tsx` checks `localStorage("dilisshious-quiz-seen")` — if absent, redirects to `/quiz`. Guest results stored in `localStorage("dilisshious-quiz-result")`; logged-in results saved to DB via `/api/quiz-result`. `QuizResultSyncer` in `auth-context.tsx` copies localStorage result to DB on login.

Quiz checkout flow: "Continue" requires auth (opens sign-in modal if guest), adds bundle + add-ons to cart silently (no drawer), saves subscription to DB via `/api/subscriptions`, then navigates to `/checkout`. Subscriptions viewable at `/subscriptions` (linked from profile dropdown).

### Styling
Tailwind CSS 4 with shadcn/ui (New York style, `components/ui/`). Fonts: Inter (body), Playfair Display (headings). Brand colors: browns (#2d2016, #5a4635), gold (#c8956c), cream (#fdf8f3).

### Images
Product images hosted on Cloudinary CDN. Remote patterns configured in `next.config.ts`. Local images in `public/images/` as fallback.

### Key API Routes
- `/api/products/[slug]` — single product
- `/api/addresses` — GET/POST user addresses
- `/api/orders` — POST create order
- `/api/orders/invoice` — POST generate & email invoice
- `/api/user/orders` — GET user's orders
- `/api/user/first-order` — GET check if first order (for coupon eligibility)
- `/api/coupons/validate` — POST validate coupon code
- `/api/quiz-result` — GET/POST quiz results (authenticated)
- `/api/subscriptions` — GET/POST user subscriptions (authenticated)

## Environment Variables

Required in `.env.local`: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SYNC_SECRET`, `NEXT_PUBLIC_UPI_ID`, `NEXT_PUBLIC_UPI_NAME`.

## Path Alias

`@/*` maps to project root (tsconfig.json).
