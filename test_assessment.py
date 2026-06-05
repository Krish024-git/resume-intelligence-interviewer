from services.session_manager import (
    SessionManager
)

from services.assessment_service import (
    AssessmentService
)

session_manager = SessionManager()

session = session_manager.create_session(
    "Python Developer",
    "2 Years",
    2
)

session.answers = [
    {
        "question_id": 1,
        "answer": "Good answer"
    }
]

session.evaluations = [
    {
        "question_id": 1,
        "score": 8,
        "feedback": "Good"
    }
]

service = AssessmentService()

result = service.generate_assessment(
    session
)

print(result)