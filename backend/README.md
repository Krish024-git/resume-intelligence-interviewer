# Backend (Node + Express + Prisma)

This is the backend API for the AI Interview Simulator.

## Requirements
- Node.js 18+ (or latest LTS)
- npm
- Prisma (for DB schema and migrations)

## Install

```bash
cd backend
npm install
```

## Environment
Create a `.env` file at `backend/.env` with variables used in `backend/src/server.ts` or `backend/src/config` (e.g. `DATABASE_URL`, `REPORTS_DIR`).

## Run (development)

```bash
cd backend
npm run dev
```

The backend exposes APIs under `/api` and communicates with the Python AI service (if configured) for PDF and AI features.

## Database
Prisma is used for persistence. To initialize or migrate the database:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

## Notes
- If you don't want to run the backend, the frontend will fallback to browser `localStorage` for session history and dashboard data.
- Report generation and sharing require the Python AI service and the backend to be both running.
