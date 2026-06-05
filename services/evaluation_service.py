from api.openrouter_client import OpenRouterClient

from prompts.evaluation_prompt import (
    build_evaluation_prompt
)

from parsers.evaluation_parser import (
    parse_evaluation
)


class EvaluationService:

    def __init__(self):
        self.client = OpenRouterClient()

    def evaluate(
        self,
        question,
        answer
    ):

        prompt = build_evaluation_prompt(
            question,
            answer
        )

        try:
            result = self.client.generate(prompt)

            content = result[
                "choices"
            ][0]["message"]["content"]

            return parse_evaluation(
                content
            )
        except Exception:
            answer_text = (answer or "").strip()
            score = 6 if len(answer_text) >= 80 else 4

            return {
                "score": score,
                "feedback": "Basic evaluation generated because the AI evaluator was unavailable.",
                "strengths": ["Answer submitted with relevant intent."],
                "weaknesses": ["Add more specific examples and technical detail."],
                "recommendations": ["Use a clear structure and include measurable impact."],
            }
