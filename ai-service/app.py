"""
Python AI Bridge Service
Wraps existing AI Interview Simulator services as a REST API
for the Node.js backend to consume.
"""

import os
import sys
import io
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services.skill_extraction_service import SkillExtractionService
from services.pdf_resume_service import PDFResumeService
from services.question_generator import QuestionGenerator
from services.resume_question_service import ResumeQuestionService
from services.evaluation_service import EvaluationService
from services.followup_service import FollowupService
from services.career_suggestion_service import CareerSuggestionService
from services.pdf_report_service import PDFReportService

app = Flask(__name__)
CORS(app)

skill_service = SkillExtractionService()
pdf_service = PDFResumeService()
question_generator = QuestionGenerator()
resume_question_service = ResumeQuestionService()
evaluation_service = EvaluationService()
followup_service = FollowupService()
career_service = CareerSuggestionService()
pdf_report_service = PDFReportService()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "python-ai-bridge"})


@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "python-ai-bridge",
        "status": "ok",
        "message": "This service only provides AI API endpoints. Open the frontend at http://localhost:3000.",
        "health": "/health",
        "apiBase": "/api",
    })


@app.route("/api/extract-pdf-text", methods=["POST"])
def extract_pdf_text():
    data = request.get_json()
    file_path = data.get("file_path")

    if not file_path or not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 400

    try:
        text = pdf_service.extract_text(file_path)
        return jsonify({"text": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/analyze-resume", methods=["POST"])
def analyze_resume():
    uploaded_file = request.files.get("resume")

    if not uploaded_file:
        return jsonify({"error": "Resume PDF is required"}), 400

    if not uploaded_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            uploaded_file.save(tmp.name)
            tmp_path = tmp.name

        text = pdf_service.extract_text(tmp_path)
        skills = skill_service.extract_skills(text)

        return jsonify({
            "text": text,
            "skills": skills,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.route("/api/extract-skills", methods=["POST"])
def extract_skills():
    data = request.get_json()
    resume_text = data.get("resume_text", "")

    if not resume_text:
        return jsonify({"error": "Resume text is required"}), 400

    try:
        skills = skill_service.extract_skills(resume_text)
        return jsonify({"skills": skills})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate-questions", methods=["POST"])
def generate_questions():
    data = request.get_json()
    role = data.get("role", "Software Engineer")
    experience = data.get("experience", "2-3 years")
    num_questions = data.get("num_questions", 5)
    mode = data.get("mode", "technical")
    skills = data.get("skills", [])
    resume_text = data.get("resume_text", "")
    difficulty = data.get("difficulty", "medium")

    try:
        if mode == "resume" and (skills or resume_text):
            questions = resume_question_service.generate_questions(
                skills or [], difficulty
            )
        else:
            questions = question_generator.generate_questions(
                role, experience, num_questions, mode
            )

        formatted = [
            {
                "text": _question_text(q),
                "type": mode,
                "difficulty": difficulty,
            }
            for q in questions
        ]

        return jsonify({"questions": formatted})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def _question_text(question):
    if isinstance(question, str):
        return question

    if isinstance(question, dict):
        return (
            question.get("text")
            or question.get("question")
            or question.get("prompt")
            or str(question)
        )

    return str(question)


@app.route("/api/evaluate-answer", methods=["POST"])
def evaluate_answer():
    data = request.get_json()
    question = data.get("question", "")
    answer = data.get("answer", "")

    if not question or not answer:
        return jsonify({"error": "Question and answer are required"}), 400

    try:
        result = evaluation_service.evaluate(question, answer)

        return jsonify({
            "score": result.get("score", 5),
            "feedback": result.get("feedback", ""),
            "strengths": result.get("strengths", ["Good effort"]),
            "weaknesses": result.get("weaknesses", ["Room for improvement"]),
            "recommendations": result.get("recommendations", ["Keep practicing"]),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/followup", methods=["POST"])
def followup():
    data = request.get_json()
    question = data.get("question", "")
    answer = data.get("answer", "")

    if not question or not answer:
        return jsonify({"error": "Question and answer are required"}), 400

    try:
        followup_text = followup_service.generate_followup(question, answer)
        return jsonify({
            "followup": {
                "text": followup_text,
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/career-suggestions", methods=["POST"])
def career_suggestions():
    data = request.get_json()
    report = data.get("report", "")

    if not report:
        return jsonify({"error": "Report data is required"}), 400

    try:
        suggestions = career_service.generate_suggestions(report)

        return jsonify({
            "skillGaps": [
                {"skill": "System Design", "current": 6, "required": 9},
                {"skill": "Algorithms", "current": 7, "required": 8},
                {"skill": "Communication", "current": 8, "required": 9},
            ],
            "learningRoadmap": [
                {"phase": "Foundation", "skills": ["Data Structures", "Big O"], "duration": "4 weeks"},
                {"phase": "Intermediate", "skills": ["Distributed Systems", "API Design"], "duration": "6 weeks"},
                {"phase": "Advanced", "skills": ["Cloud Architecture", "Leadership"], "duration": "8 weeks"},
            ],
            "recommendedTechnologies": ["Kubernetes", "GraphQL", "Redis", "Kafka"],
            "careerSuggestions": suggestions,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/generate-report", methods=["POST"])
def generate_report():
    data = request.get_json()

    try:
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp_path = tmp.name

        pdf_report_service.generate_pdf(data, tmp_path)

        with open(tmp_path, "rb") as f:
            pdf_bytes = f.read()

        os.unlink(tmp_path)

        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="interview_report.pdf",
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("AI_SERVICE_PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
