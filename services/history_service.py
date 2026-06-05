from services.persistence_service import (
    PersistenceService
)


class HistoryService:

    def __init__(self):

        self.persistence = (
            PersistenceService()
        )

    def get_history(self):

        history = []

        sessions = (
            self.persistence.list_sessions()
        )

        for filename in sessions:

            session = (
                self.persistence.load_session(
                    filename
                )
            )

            evaluations = session.get(
                "evaluations",
                []
            )

            if evaluations:

                average_score = round(
                    sum(
                        item["score"]
                        for item in evaluations
                    ) / len(evaluations),
                    2
                )

            else:

                average_score = 0

            history.append(
                {
                    "file": filename,
                    "role": session.get(
                        "role",
                        "Unknown"
                    ),
                    "experience": session.get(
                        "experience",
                        "Unknown"
                    ),
                    "average_score":
                        average_score
                }
            )

        return history