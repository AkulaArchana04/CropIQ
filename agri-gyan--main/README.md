# AgriAI – Smart Farming Platform

An intelligent platform that helps farmers make data-driven decisions with crop recommendations, disease detection, weather insights, and market data.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | 18 or higher |
| npm | 9 or higher (bundled with Node.js) |

Verify:

```bash
node -v
npm -v
```

---

## Project location (read this first)

If you extracted a ZIP file, your folder may look like this:

```
Downloads/agri-gyan--main/          ← outer folder (no package.json here)
└── agri-gyan--main/                ← THIS is the project root
    ├── backend/
    ├── src/
    └── package.json
```

**All commands below must be run from this inner `agri-gyan--main` folder**, unless you use the outer wrapper scripts described in the parent `README.md`.

---

## Step-by-step setup (Windows)

### Step 1 – Open terminal in the correct folder

**Command Prompt / PowerShell:**

```bash
cd C:\Users\praha\Downloads\agri-gyan--main\agri-gyan--main
```

> Replace the path above with wherever you saved the project.

### Step 2 – Install dependencies

```bash
npm install
```

```bash
cd backend
npm install
cd ..
```

### Step 3 – Environment file

A `.env` file is already included. Default settings work out of the box:

```env
VITE_API_URL=/api
```

Optional keys for extra features:

```env
VITE_OPENWEATHER_API_KEY=your_key_here
VITE_OPENAI_API_KEY=your_key_here
```

### Step 4 – Start the application

**Recommended – one command (frontend + backend):**

```bash
npm run dev:all
```

**Or use two terminals:**

Terminal 1 (backend – port 3001):

```bash
npm run dev:backend
```

Terminal 2 (frontend – port 8080):

```bash
npm run dev
```

### Step 5 – Open in browser

Go to: **http://localhost:8080**

### Step 6 – Sign up

1. Click **Sign In**
2. Click **Don't have an account? Sign up**
3. Fill in Full Name, Email, Password (minimum 6 characters)
4. Click **Create Account**
5. You are signed in and redirected to the dashboard

---

## Available npm scripts

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start backend + frontend together |
| `npm run dev` | Start frontend only (port 8080) |
| `npm run dev:backend` | Start backend only (port 3001) |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |

---

## Verify backend is running

Open in browser or run in terminal:

```
http://localhost:3001/api/health
```

Expected response:

```json
{ "status": "ok", "service": "agri-gyan-backend" }
```

If this fails, the backend is not running. Start it with `npm run dev:backend`.

---

## Troubleshooting

### `ENOENT: no such file or directory, open 'package.json'`

You are in the **wrong folder**. Run:

```bash
cd agri-gyan--main
```

Or from the outer folder:

```bash
npm run install:all
npm run dev
```

### `The system cannot find the path backend`

Same issue – `cd` into the inner `agri-gyan--main` folder first.

### `EADDRINUSE: address already in use :::3001` or `:::8080`

A server is already running on that port.

- Close other terminal windows running the project, or
- Find and stop the process using that port

### Sign-up shows "Request failed" or network error

1. Confirm backend is running (`http://localhost:3001/api/health`)
2. Confirm frontend is running (`http://localhost:8080`)
3. Restart both: `Ctrl+C` in each terminal, then `npm run dev:all`

### `npm` is not recognized

Node.js is not installed or not in PATH. Install from https://nodejs.org/ and restart your terminal.

---

## Features

- User authentication (local JWT backend – no Supabase required)
- AI crop recommendations
- Plant disease scanner
- Weather and market insights
- Multilingual UI support

## Tech stack

- **Frontend:** React, Vite, TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express, JSON file database
- **Auth:** JWT + bcrypt

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/signin` | Sign in |
| GET | `/api/auth/session` | Current session |
| GET | `/api/profiles/me` | Get profile |
| PUT | `/api/profiles/me` | Update profile |
| GET | `/api/crops` | List crops |
| GET/POST | `/api/recommendations` | Crop recommendations |
| GET/POST | `/api/disease-detections` | Disease scans |

## Project structure

```
agri-gyan--main/
├── backend/
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── db.js         # JSON database
│   │   └── index.js      # Server entry
│   └── data/             # Auto-created database file
├── src/
│   ├── components/       # UI components
│   ├── contexts/         # Auth & language
│   ├── pages/            # App pages
│   └── services/         # API client
├── .env                  # Environment variables
└── package.json
```

---

*Empowering every farmer with AI-driven insights to grow better, earn more, and farm sustainably.*
