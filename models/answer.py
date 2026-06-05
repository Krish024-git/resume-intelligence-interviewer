class Answer:

    def __init__(
        self,
        question_id,
        answer_text
    ):
        self.question_id = question_id
        self.answer_text = answer_text

    def to_dict(self):
        return {
            "question_id": self.question_id,
            "answer": self.answer_text
        }