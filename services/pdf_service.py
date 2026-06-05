import os

from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)

from reportlab.lib.styles import (
    getSampleStyleSheet
)


class PDFService:

    def __init__(self):

        self.output_dir = "reports"

        os.makedirs(
            self.output_dir,
            exist_ok=True
        )

    def export_session(
        self,
        session
    ):

        filename = (
            f"{session.session_id}.pdf"
        )

        filepath = os.path.join(
            self.output_dir,
            filename
        )

        doc = SimpleDocTemplate(
            filepath
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
            Spacer(1, 12)
        )

        content.append(
            Paragraph(
                f"Role: {session.role}",
                styles["Normal"]
            )
        )

        content.append(
            Paragraph(
                f"Experience: {session.experience}",
                styles["Normal"]
            )
        )

        content.append(
            Spacer(1, 12)
        )

        for evaluation in session.evaluations:

            content.append(
                Paragraph(
                    f"Question ID: "
                    f"{evaluation['question_id']}",
                    styles["Heading3"]
                )
            )

            content.append(
                Paragraph(
                    f"Score: "
                    f"{evaluation['score']}",
                    styles["Normal"]
                )
            )

            content.append(
                Paragraph(
                    f"Feedback: "
                    f"{evaluation['feedback']}",
                    styles["Normal"]
                )
            )

            content.append(
                Spacer(1, 10)
            )

        doc.build(content)

        return filepath