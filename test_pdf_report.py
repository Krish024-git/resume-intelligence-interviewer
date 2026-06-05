from services.pdf_report_service import (
    PDFReportService
)

report = {
    "total_score": 30,
    "average_score": 7.5,
    "recommendation":
        "Strong Candidate"
}

service = (
    PDFReportService()
)

path = (
    service.generate_pdf(
        report,
        "sample_report.pdf"
    )
)

print(path)