# AI Interview Simulator

AI Interview Simulator is a multi-interface interview preparation platform with AI-driven question generation, resume-based workflow, answer evaluation, history tracking, analytics, and PDF report generation.

## Repository Structure

- `app.py` — console interview application
- `streamlit_app.py` — Streamlit resume interview UI
- `ai-service/` — Python AI bridge service for backend API endpoints
- `backend/` — Node.js / Express API server with Prisma
- `frontend/` — Next.js dashboard UI with Tailwind CSS
- `config/` — environment and settings loader
- `data/sessions/` — saved interview session JSON data
- `uploads/` — uploaded files and generated assets
- `models/`, `parsers/`, `prompts/`, `reports/`, `services/` — core interview logic

## Features

- Generate interview questions by role, experience, mode, and difficulty
- Resume PDF upload and skill extraction
- Resume-based question generation
- AI answer evaluation with scoring and feedback
- Follow-up question generation
- Career suggestion generation
- Interview history and analytics
- PDF report export
- Web UI with centralized dark theme styling

## Requirements

- Python 3.10+
- Node.js 20+ and npm
- OpenRouter API key

## Setup

1. Create a Python virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Install Python dependencies for the root app:

```bash
pip install -r requirements.txt
```

3. Install backend dependencies:

```bash
cd backend
npm install
```

4. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

5. Install Python AI bridge dependencies:

```bash
cd ..\ai-service
pip install -r requirements.txt
```

6. Create a `.env` file in the repository root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Run the console app

```bash
python app.py
```

## Run the Streamlit app

```bash
streamlit run streamlit_app.py
```

## Run the web app

1. Start the Python AI bridge service:

```bash
cd ai-service
python app.py
```

2. Start the backend API service:

```bash
cd backend
npm run dev
```

3. Start the frontend web app:

```bash
cd frontend
npm run dev
```

4. Open the frontend in your browser:

```text
http://localhost:3000
```

## Tests

Run selected Python test files:

```bash
python test_evaluation.py
python test_resume.py
python test_pdf_report.py
```

Or run the full suite with pytest if installed:

```bash
pytest
```

## Notes

- `config/settings.py` loads the `OPENROUTER_API_KEY` from the root `.env` file.
- Saved interview sessions are stored under `data/sessions/`.
- Uploaded and generated artifacts may appear in `uploads/`.
- The frontend is built with Next.js, Tailwind CSS, and Zustand.
- The backend API is a Node.js Express server using Prisma.
- The Python AI bridge service exposes AI endpoints consumed by the backend.
