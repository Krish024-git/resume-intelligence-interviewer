import uuid

from services.evaluation_service import (
    EvaluationService
)

from services.report_service import (
    ReportService
)

from services.persistence_service import (
    PersistenceService
)


class InterviewRunner:

    def run(
        self,
        questions,
        role,
        experience
    ):

        evaluation_service = (
            EvaluationService()
        )

        report_service = (
            ReportService()
        )

        persistence_service = (
            PersistenceService()
        )

        answers = []

        evaluations = []

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
                f"\nScore: {result['score']}"
            )

        class Session:

            def __init__(self):

                self.session_id = (
                    str(uuid.uuid4())
                )

                self.role = role

                self.experience = (
                    experience
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

        session = Session()

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