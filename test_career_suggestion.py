from services.career_suggestion_service import (
    CareerSuggestionService
)

service = (
    CareerSuggestionService()
)

report = {
    "average_score": 5,
    "best_score": 8,
    "worst_score": 3
}

result = (
    service.generate_suggestions(
        report
    )
)

print(result)