from services.session_manager import (
    SessionManager
)

from services.pdf_service import (
    PDFService
)

session_manager = SessionManager()

session = session_manager.create_session(
    "Python Developer",
    "2 Years",
    1,
    "technical"
)

session.evaluations = [
    {
        "question_id": 1,
        "score": 8,
        "feedback": "Good answer."
    }
]

pdf_service = PDFService()

path = pdf_service.export_session(
    session
)

print(path)