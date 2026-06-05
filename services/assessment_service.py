from api.openrouter_client import OpenRouterClient

from prompts.assessment_prompt import (
    build_assessment_prompt
)

from parsers.assessment_parser import (
    parse_assessment
)


class AssessmentService:

    def __init__(self):
        self.client = OpenRouterClient()

    def generate_assessment(
        self,
        session
    ):

        prompt = build_assessment_prompt(
            session
        )

        result = self.client.generate(
            prompt
        )

        content = result[
            "choices"
        ][0]["message"]["content"]

        return parse_assessment(
            content
        )