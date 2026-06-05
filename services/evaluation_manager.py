from models.evaluation import Evaluation


class EvaluationManager:

    def add_evaluation(
        self,
        session,
        question_id,
        result
    ):

        evaluation = Evaluation(
            question_id=question_id,
            score=result["score"],
            feedback=result["feedback"]
        )

        session.add_evaluation(
            evaluation
        )