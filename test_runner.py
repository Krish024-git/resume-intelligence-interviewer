from services.interview_runner import (
    InterviewRunner
)

questions = [
    {
        "id": 1,
        "question": "What is Python?"
    }
]

runner = (
    InterviewRunner()
)

runner.run(
    questions,
    "Test Role",
    "0"
)