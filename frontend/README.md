# Frontend (Next.js)

This is the frontend application for the AI Interview Simulator.

## Requirements
- Node.js 18+ (or latest LTS)
- npm, yarn or pnpm

## Install

```bash
cd frontend
npm install
# or: yarn install
```

## Run (development)

Set the backend API URL if you run the backend separately. By default the frontend expects the Python AI service at `http://localhost:5000` and the backend API at `http://localhost:5000` unless `NEXT_PUBLIC_API_URL` is set.

```bash
# from repository root
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:5000 npm run dev
```

Open http://localhost:3000 in your browser.

## Local session persistence
The frontend stores completed interview sessions in `localStorage` under the key `ai-interview-sessions`. This is used to populate the dashboard and reports when the backend is not connected.

## Notes
- PDF report download and sharing require the backend server to be running and connected.
- If you see empty dashboard data, check `localStorage` for saved sessions or start an interview and complete it to generate local entries.
