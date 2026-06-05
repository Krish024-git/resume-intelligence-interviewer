from api.openrouter_client import (
    OpenRouterClient
)

from prompts.career_suggestion_prompt import (
    build_career_suggestion_prompt
)


class CareerSuggestionService:

    def __init__(self):

        self.client = (
            OpenRouterClient()
        )

    def generate_suggestions(
        self,
        report
    ):

        prompt = (
            build_career_suggestion_prompt(
                report
            )
        )

        result = (
            self.client.generate(
                prompt
            )
        )

        return result[
            "choices"
        ][0][
            "message"
        ][
            "content"
        ]