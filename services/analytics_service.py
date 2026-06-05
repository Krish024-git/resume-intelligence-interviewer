from services.history_service import (
    HistoryService
)


class AnalyticsService:

    def __init__(self):

        self.history_service = (
            HistoryService()
        )

    def generate_analytics(self):

        history = (
            self.history_service
            .get_history()
        )

        if not history:

            return {
                "total_interviews": 0,
                "average_score": 0,
                "best_score": 0,
                "worst_score": 0,
                "first_score": 0,
                "latest_score": 0,
                "trend": 0,
                "scores": []
            }

        scores = [
            item["average_score"]
            for item in history
        ]

        print("\nDEBUG SCORES:")
        print(scores)

        first_score = scores[0]

        latest_score = scores[-1]

        trend = round(
            latest_score - first_score,
            2
        )

        return {

            "total_interviews":
                len(scores),

            "average_score":
                round(
                    sum(scores)
                    / len(scores),
                    2
                ),

            "best_score":
                max(scores),

            "worst_score":
                min(scores),

            "first_score":
                first_score,

            "latest_score":
                latest_score,

            "trend":
                trend,

            "scores":
                scores,
            "scores": []
            
        }