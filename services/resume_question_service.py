from api.openrouter_client import (
    OpenRouterClient
)

from prompts.resume_question_prompt import (
    build_resume_question_prompt
)

from parsers.question_parser import (
    parse_questions
)


class ResumeQuestionService:

    def __init__(self):

        self.client = OpenRouterClient()

    def generate_questions(
        self,
        skills,
        difficulty
    ):

        prompt = (
            build_resume_question_prompt(
                skills,
                difficulty
            )
        )

        try:
            result = self.client.generate(
                prompt
            )

            content = result[
                "choices"
            ][0]["message"]["content"]

            questions = parse_questions(
                content
            )

            if questions:
                return questions[:5]
        except Exception:
            pass

        selected_skills = skills[:5] or ["your resume"]

        return [
            f"How have you applied {skill} in a real project?"
            for skill in selected_skills
        ]
