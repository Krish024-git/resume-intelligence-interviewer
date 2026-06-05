# API Contracts

Base URL: `http://localhost:4000/api`

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Authentication

### POST /auth/register

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2026-06-05T00:00:00.000Z"
  }
}
```

### POST /auth/login

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):** Same as register.

---

## Resume

### POST /upload-resume

**Request:** `multipart/form-data` with field `resume` (PDF file)

**Response (201):**
```json
{
  "resume": {
    "id": "uuid",
    "userId": "uuid",
    "fileName": "resume.pdf",
    "fileUrl": "/uploads/uuid.pdf",
    "extractedText": "...",
    "skills": ["JavaScript", "React", "Node.js"],
    "createdAt": "2026-06-05T00:00:00.000Z"
  },
  "skills": ["JavaScript", "React", "Node.js"]
}
```

---

## Interview

### POST /generate-questions

**Request:**
```json
{
  "role": "Senior Software Engineer",
  "experience": "5 years",
  "type": "technical",
  "difficulty": "medium",
  "questionCount": 5,
  "resumeId": "uuid (optional)",
  "skills": ["React", "Node.js"]
}
```

**Response (201):**
```json
{
  "sessionId": "uuid",
  "questions": [
    {
      "id": "uuid",
      "text": "Explain the CAP theorem...",
      "type": "technical",
      "difficulty": "medium",
      "order": 1
    }
  ]
}
```

### POST /evaluate-answer

**Request:**
```json
{
  "sessionId": "uuid",
  "questionId": "uuid",
  "answer": "The CAP theorem states..."
}
```

**Response (200):**
```json
{
  "evaluation": {
    "id": "uuid",
    "questionId": "uuid",
    "score": 8.5,
    "feedback": "Strong understanding demonstrated...",
    "strengths": ["Clear explanation", "Good examples"],
    "weaknesses": ["Missing edge cases"],
    "recommendations": ["Study distributed systems patterns"]
  },
  "averageScore": 8.5
}
```

### POST /followup

**Request:**
```json
{
  "sessionId": "uuid",
  "questionId": "uuid",
  "answer": "My answer text..."
}
```

**Response (200):**
```json
{
  "followupQuestion": {
    "id": "uuid",
    "text": "Can you elaborate on...",
    "type": "technical",
    "difficulty": "medium",
    "order": 2
  }
}
```

---

## Career

### POST /career-suggestions

**Request:**
```json
{
  "sessionId": "uuid"
}
```

**Response (200):**
```json
{
  "insights": {
    "skillGaps": [
      { "skill": "System Design", "current": 6, "required": 9 }
    ],
    "learningRoadmap": [
      { "phase": "Foundation", "skills": ["Data Structures"], "duration": "4 weeks" }
    ],
    "recommendedTechnologies": ["Kubernetes", "GraphQL"],
    "careerSuggestions": "Based on your performance..."
  }
}
```

---

## Analytics

### GET /history

**Response (200):**
```json
[
  {
    "id": "uuid",
    "role": "Software Engineer",
    "experience": "3 years",
    "type": "technical",
    "averageScore": 7.8,
    "questionCount": 5,
    "completedAt": "2026-06-05T00:00:00.000Z"
  }
]
```

### GET /analytics

**Response (200):**
```json
{
  "totalInterviews": 12,
  "averageScore": 7.8,
  "bestScore": 9.2,
  "worstScore": 5.1,
  "improvementTrend": 1.4,
  "scores": [{ "date": "2026-05-01", "score": 8.2 }],
  "performanceByType": [{ "type": "technical", "score": 8.1 }],
  "heatmap": [{ "day": "Mon", "hour": 14, "count": 2 }]
}
```

### GET /dashboard

**Response (200):**
```json
{
  "totalInterviews": 12,
  "averageScore": 7.8,
  "bestScore": 9.2,
  "improvementTrend": 1.4,
  "recentActivity": []
}
```

---

## Reports

### GET /reports/:sessionId/download

**Response:** PDF file (application/pdf)

### POST /reports/:sessionId/share

**Response (200):**
```json
{
  "shareUrl": "http://localhost:3000/shared/uuid"
}
```
