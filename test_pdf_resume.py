from services.pdf_resume_service import (
    PDFResumeService
)

service = (
    PDFResumeService()
)

filepath = input(
    "PDF Path: "
)

text = service.extract_text(
    filepath
)

print(
    "\n===== PDF CONTENT =====\n"
)

print(text)

print(
    "\n======================\n"
)