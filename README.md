# SaaS Form App

A production-oriented SaaS-style intake form built with Next.js 14, App Router, TypeScript, Tailwind CSS, Zod, React Hook Form, Resend, and optional OpenAI enrichment.

## Overview

This project provides a clean public-facing business intake form with a strict server-side processing pipeline.

Submission flow:

1. the user opens the form page
2. the client validates required fields
3. the form submits to a server Route Handler
4. the server validates the payload again with Zod
5. the server optionally enriches the submission with OpenAI
6. the server sends the result to `NOTIFICATION_EMAIL` via Resend
7. the frontend shows a success or error state

If `OPENAI_API_KEY` is not configured, the application still works and sends the original answers only.

## Tech stack

- Next.js 14
- App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Resend
- OpenAI Responses API (optional)

## Features

- client-side and server-side validation
- strict frontend/backend separation
- secrets kept server-side only
- optional OpenAI enrichment with graceful fallback
- Resend notification email delivery
- loading, success, and error states
- basic anti-abuse hardening:
  - origin check
  - honeypot field
  - lightweight rate limiting
  - idempotent email send key

## Project structure

```text
.
├── .env.example
├── .gitignore
├── README.md
├── GITHUB_HANDOFF.md
├── app
│   ├── api
│   │   └── submit
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── fields
│   │   ├── select-field.tsx
│   │   ├── text-field.tsx
│   │   └── textarea-field.tsx
│   ├── form
│   │   ├── form-card.tsx
│   │   ├── intake-form.tsx
│   │   └── submit-button.tsx
│   ├── states
│   │   ├── error-state.tsx
│   │   └── success-state.tsx
│   └── ui
│       ├── alert.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── textarea.tsx
├── emails
│   └── submission-email.ts
├── lib
│   ├── constants
│   │   └── form-options.ts
│   ├── env.ts
│   ├── errors.ts
│   ├── rate-limit.ts
│   ├── services
│   │   ├── email.ts
│   │   ├── openai.ts
│   │   └── submission.ts
│   ├── types
│   │   ├── ai-result.ts
│   │   ├── form.ts
│   │   └── submission-result.ts
│   ├── utils.ts
│   └── validations
│       └── intake-schema.ts
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Environment variables

Create `.env.local` from `.env.example` and set the following values:

```bash
OPENAI_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=Acme Forms <forms@yourdomain.com>
NOTIFICATION_EMAIL=you@example.com
ALLOWED_ORIGIN=http://localhost:3000
OPENAI_TIMEOUT_MS=8000
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=5
```

### Required

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NOTIFICATION_EMAIL`

### Optional

- `OPENAI_API_KEY`
- `ALLOWED_ORIGIN`
- `OPENAI_TIMEOUT_MS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create local environment file

```bash
cp .env.example .env.local
```

Then fill in your real values.

### 3. Start development server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

### 4. Type-check the project

```bash
npm run typecheck
```

### 5. Test a production build locally

```bash
npm run build
npm run start
```

## Request flow

1. `app/page.tsx` renders the form shell and card layout
2. `components/form/intake-form.tsx` manages the client form state
3. the client submits JSON to `app/api/submit/route.ts`
4. `lib/services/submission.ts` validates and orchestrates the backend flow
5. `lib/services/openai.ts` optionally enriches the payload
6. `lib/services/email.ts` sends the final result to Resend
7. the frontend shows success or error feedback

## OpenAI behavior

When `OPENAI_API_KEY` is present, the server attempts to create this structured output:

- `summary`
- `business_context`
- `urgency`
- `opportunities`
- `risks`
- `prompt_final`
- `recommended_next_step`
- `raw_answers`

When `OPENAI_API_KEY` is missing or the OpenAI request fails:

- the app skips AI enrichment
- the raw form answers are still emailed
- the user still receives a success response if email delivery succeeds

## Resend behavior

The server sends one notification email to `NOTIFICATION_EMAIL`.

The email contains:

- submission timestamp
- raw form answers
- AI output when available

Production note:

- `RESEND_FROM_EMAIL` must be a verified sender on your Resend account
- verify the sending domain before launch

## Deployment

### Vercel

1. push the repository to GitHub
2. import the repository into Vercel
3. set all required environment variables in Vercel project settings
4. deploy
5. run a live submission test

### Manus

Use the same repository and environment variables.

Recommended commands:

- build: `npm run build`
- start: `npm run start`

Important:

This is not a static-export project. It requires a server runtime because it uses:

- Route Handlers
- server-side email sending
- optional server-side OpenAI calls

## Production recommendations

Before launch, verify the following:

- Resend domain and sender are verified
- `NOTIFICATION_EMAIL` is correct
- `ALLOWED_ORIGIN` matches the deployed URL
- the form successfully submits with and without OpenAI configured
- the notification email is delivered correctly
- error states are understandable on mobile and desktop

## GitHub handoff

See `GITHUB_HANDOFF.md` for:

- final file tree
- deployment checklist
- environment checklist
- QA checklist
- exact files to commit
- files that must never contain secrets
- suggested commit messages
- project description text
