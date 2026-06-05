class Evaluation:

    def __init__(
        self,
        question_id,
        score,
        feedback
    ):
        self.question_id = question_id
        self.score = score
        self.feedback = feedback

    def to_dict(self):
        return {
            "question_id": self.question_id,
            "score": self.score,
            "feedback": self.feedback
        }