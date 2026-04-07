# GitHub Handoff

## 1. Final clean file tree

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

## 2. Final README

Use the repository `README.md` exactly as committed.

## 3. Short deployment checklist

- push repository to GitHub
- create project on Vercel or Manus
- set `RESEND_API_KEY`
- set `RESEND_FROM_EMAIL`
- set `NOTIFICATION_EMAIL`
- optionally set `OPENAI_API_KEY`
- set `ALLOWED_ORIGIN` to the production URL
- deploy
- submit a live test form
- confirm notification email delivery

## 4. Short environment variable checklist

Required:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `NOTIFICATION_EMAIL`

Optional:

- `OPENAI_API_KEY`
- `ALLOWED_ORIGIN`
- `OPENAI_TIMEOUT_MS`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX_REQUESTS`

## 5. Manual QA checklist for testing the form

### Basic flow

- open the form page on desktop
- open the form page on mobile width
- verify layout is centered and readable
- submit valid data
- verify loading state appears
- verify success state appears
- verify notification email arrives

### Validation

- submit with empty required fields
- verify client validation blocks submission
- enter an invalid email
- verify email validation message appears
- paste very long text into textarea fields
- verify length validation behaves correctly

### Server behavior

- disable `OPENAI_API_KEY`
- submit valid form
- verify success still appears
- verify email still arrives with raw answers only
- enable `OPENAI_API_KEY`
- submit valid form
- verify email includes AI output

### Error behavior

- break `RESEND_API_KEY`
- submit valid form
- verify the frontend shows an error state
- restore correct value and retest

### Anti-abuse checks

- fill the hidden honeypot manually through devtools
- verify the request fails
- submit repeatedly past the rate limit
- verify `429` behavior

## 6. Exact files you must commit

Commit these files:

- `.env.example`
- `.gitignore`
- `README.md`
- `GITHUB_HANDOFF.md`
- `app/layout.tsx`
- `app/globals.css`
- `app/page.tsx`
- `app/api/submit/route.ts`
- `components/fields/select-field.tsx`
- `components/fields/text-field.tsx`
- `components/fields/textarea-field.tsx`
- `components/form/form-card.tsx`
- `components/form/intake-form.tsx`
- `components/form/submit-button.tsx`
- `components/states/error-state.tsx`
- `components/states/success-state.tsx`
- `components/ui/alert.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/select.tsx`
- `components/ui/textarea.tsx`
- `emails/submission-email.ts`
- `lib/constants/form-options.ts`
- `lib/env.ts`
- `lib/errors.ts`
- `lib/rate-limit.ts`
- `lib/services/email.ts`
- `lib/services/openai.ts`
- `lib/services/submission.ts`
- `lib/types/ai-result.ts`
- `lib/types/form.ts`
- `lib/types/submission-result.ts`
- `lib/utils.ts`
- `lib/validations/intake-schema.ts`
- `next-env.d.ts`
- `next.config.js`
- `package.json`
- `postcss.config.js`
- `tailwind.config.ts`
- `tsconfig.json`

Do not commit:

- `.env.local`
- `node_modules/`
- `.next/`
- `.vercel/`
- log files

## 7. Files that must never contain secrets

These files must never contain real secrets:

- `README.md`
- `GITHUB_HANDOFF.md`
- `.env.example`
- `package.json`
- all files under `app/`
- all files under `components/`
- all files under `emails/`
- all files under `lib/`
- any committed config file

Secrets must exist only in runtime environment variables such as:

- `.env.local` locally
- Vercel environment variable settings
- Manus environment variable settings

## Commit messages

Initial project:

`feat: build SaaS intake form with Next.js App Router`

Review/fix pass:

`fix: harden submission flow and deployment config`

## GitHub project description

Production-ready SaaS-style intake form built with Next.js 14, TypeScript, Tailwind, Resend, and optional OpenAI enrichment.
