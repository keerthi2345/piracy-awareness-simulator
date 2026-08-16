# What Actually Happens If You Get Caught — Digital Risk Awareness Simulator

A MERN-stack interactive simulator that walks a user through three common risky
actions — a scam pop-up, a piracy/streaming site, and a fake "free Netflix" APK —
and shows a realistic (simulated, non-executing) chain of consequences, followed
by plain-language legal context and a "what to actually do" remediation flow.

**Nothing in this app runs real malicious code, requests real browser
permissions, opens real tabs/windows, or references a real APK file.**
Every "attack" is a scripted UI animation. This is explicitly stated on
screen at the start of every scenario.

## Stack

- **Frontend**: React 18 + Vite, React Router, Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas or local) via Mongoose
- **External API**: Google Safe Browsing v4 (called server-side only — the
  key never reaches the browser)
- **PDF**: PDFKit (server-side report generation)

## Project layout

```
backend/
  server.js              entry point
  config/db.js            Mongo connection
  models/                 Session, Event, LegalFact schemas
  routes/, controllers/   REST API
  utils/riskScore.js      server-side scoring logic
  utils/pdfGenerator.js   PDF report builder
  data/legalFacts.json    seed data for the LegalFacts collection
  seed.js                 run once to populate legal facts

frontend/
  src/scenarios/          the three scenario flows
  src/components/         reusable pieces (reveal animation, fake dialogs,
                           consequence screen, remediation reveal)
  src/pages/               Home, UrlChecker, SummaryReport
  src/context/             session state shared across scenarios
  src/styles/               three visual "registers" — shady / terminal / authority
```

## Design concept (for your report)

The app deliberately shifts between three visual registers as the user
moves through a scenario, and this *is* the pedagogical device:

1. **Shady register** — the mock piracy site / fake APK screen. Intentionally
   cluttered, clashing colors, fake urgency — this is what real sketchy sites
   look like.
2. **Terminal register** — the reveal sequence. Black background, monospace,
   phosphor-green text typed line by line — this is the "behind the scenes"
   moment.
3. **Authority register** — the consequence screen and remediation flow. Calm,
   clean, single accent color — deliberately the opposite of the first two,
   signaling "this is the trustworthy, considered information."

The transition between registers is the app's signature interaction.

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and SAFE_BROWSING_API_KEY
npm run seed      # populates the LegalFacts collection
npm run dev       # starts on http://localhost:5000
```

Get a free Safe Browsing API key: console.cloud.google.com → enable
"Safe Browsing API" → create an API key. The URL-checker feature will
show a clear "not configured" message if you skip this — it's optional
for the rest of the app to work.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

The frontend expects the backend at `http://localhost:5000` — change
`VITE_API_URL` in a `.env` file inside `frontend/` if different.

## API summary

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/session` | start a new session, returns `sessionId` |
| POST | `/api/session/:id/event` | log a choice the user made |
| GET  | `/api/session/:id/score` | compute risk score from logged events |
| GET  | `/api/session/:id/report` | stream a PDF report |
| POST | `/api/check-url` | proxy a URL through Safe Browsing |
| GET  | `/api/legal-facts?category=` | fetch legal context by category |

## Notes on the loophole fixes discussed in planning

- Fake browser permission prompts (notifications, APK permissions) are
  styled `<div>`s — the real `Notification` API and real app installs are
  never invoked.
- The "multiple tabs opening" effect is a CSS/Framer Motion animation of
  icon elements — `window.open()` is never called.
- The Safe Browsing API key lives only in `backend/.env` and is read via
  `process.env` inside the Express route — it is never sent to the client.
- The risk score is computed **server-side** from logged events, not in
  the browser, so it can't be trivially edited via devtools.
