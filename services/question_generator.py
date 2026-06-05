from api.openrouter_client import OpenRouterClient
from prompts.question_prompt import build_question_prompt
from parsers.question_parser import parse_questions


class QuestionGenerator:

    def __init__(self):
        self.client = OpenRouterClient()

    def generate_questions(
        self,
        role,
        experience,
        num_questions,
        mode
    ):

        prompt = build_question_prompt(
            role,
            experience,
            num_questions,
            mode
        )          
        
        try:
            result = self.client.generate(prompt)    

            content = result["choices"][0]["message"]["content"]        

            questions = parse_questions(content)
                  
            if questions:
                return questions[:int(num_questions)]
        except Exception:
            pass

        return self._fallback_questions(
            role,
            num_questions,
            mode
        )

    def _fallback_questions(
        self,
        role,
        num_questions,
        mode
    ):
        templates = [
            f"Tell me about a recent project you built for a {role} role and the impact it created.",
            f"What are the most important skills for a {role}, and how have you used them?",
            f"Describe a time you solved a difficult problem in a {role} context. What was your approach?",
            f"How do you make trade-offs between speed, quality, and maintainability for a {role}?",
            f"Explain a system or feature you designed or supported that is relevant to a {role}.",
            "How do you validate and test your work before delivery?",
            "Tell me about a time you received feedback and improved your approach.",
            "How would you explain a complex idea to a non-technical stakeholder?",
            "What would you improve in one of your past projects if you rebuilt it today?",
            f"What makes you a strong fit for this {mode} interview?"
        ]

        return templates[:int(num_questions)]
