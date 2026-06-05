class InterviewSession:

    def __init__(
        self,
        session_id,
        role,
        experience,
        questions
    ):
        self.session_id = session_id
        self.role = role
        self.experience = experience
        self.questions = questions

        self.answers = []
        self.evaluations = []

    def to_dict(self):

        return {
            "session_id": self.session_id,
            "role": self.role,
            "experience": self.experience,
            "questions": self.questions,
            "answers": self.answers,
            "evaluations": self.evaluations
        }
    def add_answer(self, answer):
        self.answers.append(
             answer.to_dict()
        )

    def add_evaluation(
        self,
        evaluation
    ):
     
        self.evaluations.append(
            evaluation.to_dict()
        )