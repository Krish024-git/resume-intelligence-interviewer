from PyPDF2 import PdfReader


class PDFResumeService:

    def extract_text(
        self,
        filepath
    ):

        reader = PdfReader(
            filepath
        )

        text = ""

        for page in reader.pages:

            page_text = (
                page.extract_text()
            )

            if page_text:

                text += page_text

        return text