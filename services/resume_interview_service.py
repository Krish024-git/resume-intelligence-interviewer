import uuid

from services.resume_service import (
    ResumeService
)

from services.resume_question_service import (
    ResumeQuestionService
)

from services.evaluation_service import (
    EvaluationService
)

from services.report_service import (
    ReportService
)

from services.persistence_service import (
    PersistenceService
)


class ResumeInterviewService:

    def start(self):

        filepath = input(
            "Resume File Path: "
        )

        resume_service = (
            ResumeService()
        )

        skills = (
            resume_service.extract_skills(
                filepath
            )
        )

        question_service = (
            ResumeQuestionService()
        )

        evaluation_service = (
            EvaluationService()
        )

        report_service = (
            ReportService()
        )

        persistence_service = (
            PersistenceService()
        )

        questions = (
            question_service.generate_questions(
                skills
            )
        )

        answers = []

        evaluations = []

        print(
            "\nGenerated Questions:\n"
        )

        for question in questions:

            print(
                f"\nQuestion {question['id']}:"
            )

            print(
                question["question"]
            )

            answer = input(
                "\nYour Answer: "
            )

            answers.append(
                {
                    "question_id":
                        question["id"],
                    "answer":
                        answer
                }
            )

            result = (
                evaluation_service.evaluate(
                    question["question"],
                    answer
                )
            )

            evaluations.append(
                {
                    "question_id":
                        question["id"],

                    "score":
                        result["score"],

                    "feedback":
                        result["feedback"]
                }
            )

            print(
                "\nFeedback:"
            )

            print(
                result["feedback"]
            )

            print(
                f"Score: {result['score']}"
            )

        class ResumeSession:

            def __init__(self):

                self.session_id = str(
                    uuid.uuid4()
                )

                self.role = (
                    "Resume Based Interview"
                )

                self.experience = (
                    "N/A"
                )

                self.questions = (
                    questions
                )

                self.answers = (
                    answers
                )

                self.evaluations = (
                    evaluations
                )

            def to_dict(self):

                return {
                    "session_id":
                        self.session_id,

                    "role":
                        self.role,

                    "experience":
                        self.experience,

                    "questions":
                        self.questions,

                    "answers":
                        self.answers,

                    "evaluations":
                        self.evaluations
                }

        session = ResumeSession()

        report = (
            report_service.generate_report(
                session
            )
        )

        print(
            "\n===== FINAL REPORT =====\n"
        )

        for key, value in report.items():

            print(
                f"{key}: {value}"
            )

        saved_path = (
            persistence_service.save_session(
                session
            )
        )

        print(
            f"\nSession saved to: "
            f"{saved_path}"
        )