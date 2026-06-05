from services.resume_service import (
    ResumeService
)

from services.resume_question_service import (
    ResumeQuestionService
)

resume_service = ResumeService()

skills = resume_service.extract_skills(
    "resume.txt"
)

question_service = (
    ResumeQuestionService()
)

questions = (
    question_service.generate_questions(
        skills
    )
)

print("\nGenerated Questions:\n")

for question in questions:

    print(
        f"{question['id']}. "
        f"{question['question']}"
    )