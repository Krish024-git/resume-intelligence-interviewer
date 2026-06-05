from api.openrouter_client import (
    OpenRouterClient
)

from prompts.followup_prompt import (
    build_followup_prompt
)


class FollowupService:

    def __init__(self):

        self.client = (
            OpenRouterClient()
        )

    def generate_followup(
        self,
        question,
        answer
    ):

        prompt = (
            build_followup_prompt(
                question,
                answer
            )
        )

        try:
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
            ].strip()
        except Exception:
            return (
                "Can you add a specific example, explain the trade-offs, "
                "and describe the measurable result of your approach?"
            )
