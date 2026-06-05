from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)


class PDFReportService:

    def generate_pdf(
        self,
        report,
        filepath
    ):

        document = (
            SimpleDocTemplate(
                filepath
            )
        )

        styles = (
            getSampleStyleSheet()
        )

        content = []

        content.append(
            Paragraph(
                "AI Interview Report",
                styles["Title"]
            )
        )

        content.append(
            Spacer(1, 20)
        )

        for key, value in report.items():

            content.append(
                Paragraph(
                    f"{key}: {value}",
                    styles["BodyText"]
                )
            )

        document.build(
            content
        )

        return filepath