# AgriAI – Project Setup

> **Important:** After extracting the ZIP, the real project is inside the **inner** `agri-gyan--main` folder.

```
agri-gyan--main/              ← you are here (outer folder)
└── agri-gyan--main/          ← actual project (frontend + backend)
    ├── backend/
    ├── src/
    ├── package.json
    └── README.md
```

---

## Prerequisites

- **Node.js 18+** — download from https://nodejs.org/
- **npm** (comes with Node.js)

Check installation:

```bash
node -v
npm -v
```

---

## Option 1 – Run from outer folder (easiest)

Open terminal in `C:\Users\praha\Downloads\agri-gyan--main` and run:

```bash
npm run install:all
npm run dev
```

Then open **http://localhost:8080**

---

## Option 2 – Run from inner project folder

```bash
cd agri-gyan--main
npm install
cd backend
npm install
cd ..
npm run dev:all
```

Then open **http://localhost:8080**

---

## Option 3 – Two separate terminals (for debugging)

**Terminal 1 – Backend (port 3001):**

```bash
cd agri-gyan--main
npm run dev:backend
```

**Terminal 2 – Frontend (port 8080):**

```bash
cd agri-gyan--main
npm run dev
```

---

## Common errors & fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Could not read package.json` | Running commands in the **outer** folder without `cd agri-gyan--main` | Use `npm run install:all` from outer folder, or `cd agri-gyan--main` first |
| `The system cannot find the path backend` | Same – wrong folder | `cd agri-gyan--main` then run backend commands |
| `Port 3001 already in use` | Backend already running | Close the other terminal or restart your PC |
| `Port 8080 already in use` | Frontend already running | Close the other terminal |
| Sign-up fails / API error | Backend not running | Start backend first (`npm run dev:backend`) |

---

## Create an account

1. Open http://localhost:8080
2. Click **Sign In** → **Sign up**
3. Enter name, email, password (min 6 characters)
4. You are redirected to the dashboard

---

## Full documentation

See [agri-gyan--main/README.md](./agri-gyan--main/README.md) for API endpoints, project structure, and optional API keys.
