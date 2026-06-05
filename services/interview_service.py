from services.session_manager import SessionManager
from services.answer_manager import AnswerManager
from services.evaluation_service import EvaluationService
from services.evaluation_manager import EvaluationManager
from services.report_service import ReportService
from services.persistence_service import PersistenceService

import json


class InterviewService:

    def __init__(self):

        self.session_manager = (
            SessionManager()
        )

        self.answer_manager = (
            AnswerManager()
        )

        self.evaluation_service = (
            EvaluationService()
        )

        self.evaluation_manager = (
            EvaluationManager()
        )

        self.report_service = (
            ReportService()
        )

        self.persistence_service = (
            PersistenceService()
        )

    def start(self):

        role = input("Role: ")

        experience = input(
            "Experience: "
        )

        count = int(
            input(
                "Questions Count: "
            )
        )

        print("\nModes:")
        print("1. Technical")
        print("2. HR")
        print("3. Behavioral")
        print("4. System Design")

        mode_choice = input(
            "Select Mode: "
        )

        mode_map = {
            "1": "technical",
            "2": "hr",
            "3": "behavioral",
            "4": "system_design"
        }

        mode = mode_map.get(
            mode_choice,
            "technical"
        )

        session = (
            self.session_manager
            .create_session(
                role,
                experience,
                count,
                mode
            )
        )

        for question in session.questions:

            print("\n")
            print(
                f"Question {question['id']}:"
            )

            print(
                question["question"]
            )

            answer = input(
                "\nYour Answer: "
            )

            self.answer_manager.capture_answer(
                session,
                question["id"],
                answer
            )

            result = (
                self.evaluation_service
                .evaluate(
                    question["question"],
                    answer
                )
            )

            self.evaluation_manager.add_evaluation(
                session,
                question["id"],
                result
            )

        report = (
            self.report_service
            .generate_report(
                session
            )
        )

        print("\nFinal Report:\n")

        print(
            json.dumps(
                report,
                indent=4
            )
        )

        saved_path = (
            self.persistence_service
            .save_session(
                session
            )
        )

        print(
            f"\nSession saved to: "
            f"{saved_path}"
        )