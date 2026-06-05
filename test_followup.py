from services.followup_service import (
    FollowupService
)

service = (
    FollowupService()
)

result = (
    service.generate_followup(
        "What is a Python decorator?",
        "Decorators modify functions."
    )
)

print(result)