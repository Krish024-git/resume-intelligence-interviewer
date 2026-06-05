from services.pdf_resume_service import (
    PDFResumeService
)

from services.skill_extraction_service import (
    SkillExtractionService
)

from services.resume_question_service import (
    ResumeQuestionService
)

pdf_service = (
    PDFResumeService()
)

skill_service = (
    SkillExtractionService()
)

question_service = (
    ResumeQuestionService()
)

filepath = input(
    "PDF Path: "
)

text = (
    pdf_service.extract_text(
        filepath
    )
)

skills = (
    skill_service.extract_skills(
        text
    )
)

print(
    "\nExtracted Skills:\n"
)

print(
    skills
)

questions = (
    question_service.generate_questions(
        skills
    )
)

print(
    "\nGenerated Questions:\n"
)

for question in questions:

    print(
        f"{question['id']}. "
        f"{question['question']}"
    )