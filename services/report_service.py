class ReportService:

    def generate_report(self, session):

        evaluations = session.evaluations

        if not evaluations:
            return {
                "total_score": 0,
                "average_score": 0,
                "questions_attempted": 0,
                "highest_score": 0,
                "lowest_score": 0,
                "recommendation": "No evaluation data."
            }

        scores = [
            evaluation["score"]
            for evaluation in evaluations
        ]

        total_score = sum(scores)

        average_score = round(
            total_score / len(scores),
            2
        )

        highest_score = max(scores)

        lowest_score = min(scores)

        questions_attempted = len(scores)

        if average_score >= 8:
            recommendation = (
                "Strong candidate."
            )

        elif average_score >= 6:
            recommendation = (
                "Potential candidate. Needs improvement."
            )

        else:
            recommendation = (
                "Not interview ready."
            )

        return {
            "total_score": total_score,
            "average_score": average_score,
            "questions_attempted": questions_attempted,
            "highest_score": highest_score,
            "lowest_score": lowest_score,
            "recommendation": recommendation
        }