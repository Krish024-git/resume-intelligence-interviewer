from models.answer import Answer


class AnswerManager:

    def capture_answer(
        self,
        session,
        question_id,
        answer_text
    ):

        answer = Answer(
            question_id,
            answer_text
        )

        session.add_answer(answer)