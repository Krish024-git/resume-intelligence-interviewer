from services.pdf_resume_service import (
    PDFResumeService
)

from services.skill_extraction_service import (
    SkillExtractionService
)

pdf_service = (
    PDFResumeService()
)

skill_service = (
    SkillExtractionService()
)

text = pdf_service.extract_text(
    "resume.pdf"
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