from services.resume_service import (
    ResumeService
)

service = ResumeService()

skills = service.extract_skills(
    "resume.txt"
)

print(skills)