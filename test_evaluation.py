from services.evaluation_service import (
    EvaluationService
)

service = EvaluationService()

result = service.evaluate(
    "What is Python?",
    "Python is a programming language."
)

print(result)