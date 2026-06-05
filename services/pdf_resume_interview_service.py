from services.pdf_resume_service import (
    PDFResumeService
)

from services.skill_extraction_service import (
    SkillExtractionService
)

from services.resume_question_service import (
    ResumeQuestionService
)

from services.interview_runner import (
    InterviewRunner
)


class PDFResumeInterviewService:

    def start(self):

        filepath = input(
            "PDF Resume Path: "
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

        runner = (
            InterviewRunner()
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
            "\nStarting PDF Resume Interview...\n"
        )

        runner.run(
            questions,
            "PDF Resume Interview",
            "N/A"
        )