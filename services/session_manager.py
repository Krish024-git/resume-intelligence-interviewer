import uuid

from models.interview_session import InterviewSession
from services.question_generator import QuestionGenerator


class SessionManager:

    def __init__(self):
        self.generator = QuestionGenerator()

    def create_session(
        self,
        role,
        experience,
        question_count,
        mode
    ):

        questions = self.generator.generate_questions(
            role,
            experience,
            question_count,
            mode
        )

        session = InterviewSession(
            session_id=str(uuid.uuid4()),
            role=role,
            experience=experience,
            questions=questions
        )

        return session