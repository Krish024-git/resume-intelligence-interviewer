# AI Interview SaaS — Folder Structure

```
AI-Inter/
├── frontend/                          # Next.js 15 SaaS Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (dashboard)/           # Dashboard route group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── resume/page.tsx
│   │   │   │   ├── interview/
│   │   │   │   │   ├── configure/page.tsx
│   │   │   │   │   └── [sessionId]/page.tsx
│   │   │   │   ├── evaluation/[sessionId]/page.tsx
│   │   │   │   ├── analytics/page.tsx
│   │   │   │   ├── career/page.tsx
│   │   │   │   └── reports/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # Landing page
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn-style primitives
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/                # Sidebar, Header, DashboardLayout
│   │   │   ├── dashboard/             # KPI, QuickActions, RecentActivity
│   │   │   ├── resume/                # ResumeUpload
│   │   │   ├── interview/             # ConfigForm, QuestionCard, AnswerEditor
│   │   │   ├── evaluation/            # FeedbackPanel
│   │   │   ├── analytics/             # Charts, Heatmap
│   │   │   ├── career/                # SkillGap, LearningRoadmap
│   │   │   ├── reports/               # ReportCard
│   │   │   └── shared/                # KPICard, ScoreMeter, TypingEffect
│   │   ├── hooks/
│   │   │   ├── use-dashboard.ts
│   │   │   └── use-analytics.ts
│   │   ├── services/
│   │   │   └── api.ts                 # API client
│   │   ├── stores/
│   │   │   ├── auth-store.ts
│   │   │   ├── interview-store.ts
│   │   │   ├── resume-store.ts
│   │   │   └── ui-store.ts
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   ├── tailwind.config.ts
│   └── next.config.ts
│
├── backend/                           # Express.js API Server
│   ├── prisma/
│   │   └── schema.prisma              # PostgreSQL schema
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── resume.controller.ts
│   │   │   ├── interview.controller.ts
│   │   │   ├── analytics.controller.ts
│   │   │   ├── career.controller.ts
│   │   │   └── report.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   └── python-ai.service.ts   # Bridge to Python AI
│   │   ├── lib/
│   │   │   └── prisma.ts
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
│
├── ai-service/                        # Python AI Bridge (Flask)
│   ├── app.py                         # REST API wrapping existing services
│   └── requirements.txt
│
├── services/                          # Existing Python AI services (unchanged)
├── prompts/
├── parsers/
├── models/
├── api/
├── config/
├── docs/
│   ├── API_CONTRACTS.md
│   └── FOLDER_STRUCTURE.md
└── data/sessions/                     # Legacy session storage
```

## Architecture Flow

```
Browser (Next.js) → Express API → Python AI Bridge → OpenRouter API
                         ↓
                    PostgreSQL (Prisma)
```
