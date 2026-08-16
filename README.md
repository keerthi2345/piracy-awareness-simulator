# What Actually Happens If You Get Caught — Digital Risk Awareness Simulator

A MERN-stack interactive simulator that walks users through common digital
risk scenarios — a scam pop-up, a piracy/streaming site, and a fake "free
Netflix" APK — showing a realistic (fully simulated, non-executing) chain of
consequences, followed by research-backed legal context and a guided
"what to actually do" recovery flow. Also includes a reference Threat
Library for attacks that happen outside the browser (calls, SMS, QR
tampering), a live URL Safety Checker using Google Safe Browsing, and a
personal Digital Risk Awareness Score with a downloadable PDF report.

**Nothing in this app runs real malicious code, requests real browser
permissions, opens real tabs/windows, or references a real APK file.**
Every "attack" is a scripted UI animation, stated on screen at the start
of every scenario.

## Live demo

- **App**: https://piracy-awareness-simulator.vercel.app/
- **Backend API**: https://piracy-awareness-simulator.onrender.com

> Note: the backend is hosted on Render's free tier, which sleeps after
> 15 minutes of inactivity. The first request after a period of idleness
> may take 30–50 seconds to respond while it wakes up.

## Features

- **Three interactive scenarios** — pop-up scam, piracy site, fake APK —
  each ending in a terminal-style "reveal" animation, a researched legal
  consequence screen, and a visual recovery-montage remediation sequence
- **Threat Library** — 8 reference entries covering attacks that don't
  happen inside a browser (UPI fraud, screen-sharing scams, digital arrest
  scams, vishing, QR code swaps, and more), each with how-it-works, red
  flags, and what to do
- **Live URL Safety Checker** — real Google Safe Browsing v4 integration,
  proxied server-side so the API key never reaches the client
- **Digital Risk Awareness Score** — computed server-side from logged
  choices during each session, with a downloadable PDF report
- **Aggregate stats** — anonymized cross-session data on what choices
  other users actually made

## Tech stack

- **Frontend**: React 18 + Vite, React Router, Framer Motion — deployed on Vercel
- **Backend**: Node.js + Express — deployed on Render
- **Database**: MongoDB Atlas via Mongoose
- **External API**: Google Safe Browsing v4 (server-side only)
- **PDF generation**: PDFKit

## Project layout

```
backend/
  server.js               entry point
  config/db.js            Mongo connection
  models/                 Session, Event, LegalFact schemas
  routes/, controllers/   REST API
  utils/riskScore.js      server-side scoring logic
  utils/pdfGenerator.js   PDF report builder
  data/ seed data         (legal facts, threat library)
  seed.js                 populates both collections

frontend/
  src/scenarios/           the three scenario flows
  src/components/          reusable pieces (reveal animation, fake dialogs,
                           consequence screen, remediation showcase)
  src/pages/               Home, ThreatLibrary, UrlChecker, SummaryReport
  src/context/             session state shared across scenarios
  src/styles/              cyber-console visual theme (shared) plus a
                           distinct "shady site" register for scenarios
```

## Design concept

The app shifts between three visual registers, and this shift is itself
the pedagogical device:

1. **Cyber-console register** (home, nav, library, reports) — dark,
   grid-lined, neon — the app's default "you are in a security console"
   identity
2. **Shady register** (inside a scenario, before the reveal) —
   deliberately cluttered, clashing colors, fake urgency — what real
   sketchy sites actually look like
3. **Recovery register** (the remediation showcase) — calm teal gradient,
   icon-led story sequence — the "you're safe now, here's what you do"
   moment

## Running it locally

### 1. Clone the repo

```bash
git clone https://github.com/keerthi2345/piracy-awareness-simulator.git
cd piracy-awareness-simulator
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI and SAFE_BROWSING_API_KEY
npm run seed
npm run dev       # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

The frontend expects the backend at `http://localhost:5000` by default —
override with `VITE_API_URL` in `frontend/.env` if different.

## API summary

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/session` | start a new session |
| POST | `/api/session/:id/event` | log a choice |
| GET  | `/api/session/:id/score` | compute risk score |
| GET  | `/api/session/:id/report` | stream a PDF report |
| POST | `/api/check-url` | proxy a URL through Safe Browsing |
| GET  | `/api/legal-facts?category=` | legal/prevention content by scenario |
| GET  | `/api/threats?severity=` | threat library entries |
| GET  | `/api/stats` | aggregate anonymized choice data |

## Deployment

- **Backend**: deployed on Render as a Node web service, root directory
  `backend`, environment variables (`MONGO_URI`, `SAFE_BROWSING_API_KEY`,
  `CORS_ORIGIN`) configured in Render's dashboard
- **Frontend**: deployed on Vercel, root directory `frontend`,
  `VITE_API_URL` pointing to the Render backend URL
- **Database**: MongoDB Atlas, free M0 cluster

## Security notes

- The Safe Browsing API key lives only in the backend's environment
  variables, read server-side — never sent to the client
- Risk scores are computed server-side from logged events, not trusted
  from the browser
- No PII is collected — sessions use a random anonymous token, not any
  real identity
- No real browser permission APIs, remote-access tools, or files are
  invoked anywhere in the codebase — every "attack" is a scripted
  animation
- `.env` files are excluded from version control via `.gitignore`

## Author

## Author

**Bora Keerthi Sri Reddy**
4th Year B.Tech, Computer Science Engineering in
GVP College of Engineering for Women (GVPCEW)

Built as a college project exploring "informed consent, not
fear-mongering" as an approach to digital risk education.
