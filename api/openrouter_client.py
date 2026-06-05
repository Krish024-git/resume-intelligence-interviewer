import requests

from config.settings import OPENROUTER_API_KEY


class OpenRouterClient:

    BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

    def generate(self, prompt):

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        try:

            response = requests.post(
                self.BASE_URL,
                headers=headers,
                json=payload,
                timeout=30
            )

            response.raise_for_status()

            return response.json()

        except requests.exceptions.Timeout:
            raise Exception(
                "OpenRouter request timed out."
            )

        except requests.exceptions.HTTPError as e:
            raise Exception(
                f"OpenRouter HTTP Error: {e}"
            )

        except requests.exceptions.RequestException as e:
            raise Exception(
                f"Network Error: {e}"
            )