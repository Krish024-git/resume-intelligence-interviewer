import os
import pandas as pd
from services.career_suggestion_service import CareerSuggestionService
import streamlit as st

from services.history_service import (
    HistoryService
)

from services.analytics_service import (
    AnalyticsService
)

from services.pdf_resume_service import (
    PDFResumeService
)

from services.skill_extraction_service import (
    SkillExtractionService
)

from services.resume_question_service import (
    ResumeQuestionService
)

from services.evaluation_service import (
    EvaluationService
)

from services.report_service import (
    ReportService
)

from services.persistence_service import (
    PersistenceService
)

from services.pdf_report_service import (
    PDFReportService
)

from services.followup_service import (
    FollowupService
)

st.set_page_config(
    page_title="AI Interview Simulator",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown(
    """
    <style>

    .stApp {
        background: linear-gradient(
            135deg,
            #0B1020,
            #111827
        );
    }

    .main-title {
        text-align:center;
        font-size:48px;
        font-weight:800;
        color:white;
        margin-bottom:10px;
    }

    .subtitle {
        text-align:center;
        color:#B0B8C5;
        font-size:18px;
        margin-bottom:30px;
    }

    .metric-card {
        background: rgba(255,255,255,0.05);
        backdrop-filter: blur(12px);
        border-radius:16px;
        padding:20px;
        border:1px solid rgba(255,255,255,0.1);
    }

    .section-card {
        background: rgba(255,255,255,0.04);
        border-radius:18px;
        padding:25px;
        margin-top:15px;
        margin-bottom:15px;
        border:1px solid rgba(255,255,255,0.08);
    }

    </style>
    """,
    unsafe_allow_html=True
)

st.markdown(
    """
    <div class="main-title">
        🤖 AI Interview Simulator
    </div>

    <div class="subtitle">
        Resume-Based AI Interviews • Evaluation • Analytics • Career Insights
    </div>
    """,
    unsafe_allow_html=True
)

st.sidebar.title(
    "🤖 Navigation"
)

page = st.sidebar.radio(
    "Select Section",
    [
        "Interview",
        "History",
        "Analytics"
    ]
)


st.markdown(
    """
    ## 📄 Upload Resume

    Upload your PDF resume and let AI analyze
    your skills and generate personalized
    interview questions.
    """
)
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        "Interviews",
        "12"
    )

with col2:
    st.metric(
        "Avg Score",
        "7.8"
    )

with col3:
    st.metric(
        "Best Score",
        "9.5"
    )

with col4:
    st.metric(
        "Trend",
        "+15%"
    )







if page == "Interview":

    uploaded_file = st.file_uploader(
        "Upload Resume PDF",
        type=["pdf"]
    )

    if uploaded_file:

        os.makedirs(
            "uploads",
            exist_ok=True
        )

        file_path = os.path.join(
            "uploads",
            uploaded_file.name
        )

        with open(
            file_path,
            "wb"
        ) as file:

            file.write(
                uploaded_file.getbuffer()
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

        text = (
            pdf_service.extract_text(
                file_path
            )
        )

        skills = (
            skill_service.extract_skills(
                text
            )
        )

        st.subheader(
            "Extracted Skills"
        )

        st.write(
            skills
        )

        difficulty = st.selectbox(
            "Select Difficulty",
            [
                "easy",
                "medium",
                "hard"
            ]
        )

        questions = (
            question_service.generate_questions(
                skills,
                difficulty
            )
        )

        st.subheader(
            "Generated Interview Questions"
        )

        answers = {}

        for question in questions:

            progress = (
                question["id"] /
                len(questions)
            )

            st.progress(
                progress
            )

            st.write(
                f"{question['id']}. "
                f"{question['question']}"
            )

            answers[
                question["id"]
            ] = st.text_area(
                "Your Answer",
                key=f"answer_{question['id']}"
            )

        if st.button(
            "Submit Interview"
        ):

            followup_service = (
                FollowupService()
            )

            evaluation_service = (
                EvaluationService()
            )

            evaluations = []

            st.success(
                "Interview Submitted"
            )

            for question in questions:

                answer = answers.get(
                    question["id"],
                    ""
                )

                result = (
                    evaluation_service.evaluate(
                        question["question"],
                        answer
                    )
                )

                followup = (
                    followup_service.generate_followup(
                        question["question"],
                        answer
                    )
                )

                evaluations.append(
                    {
                        "question_id":
                            question["id"],
                        "score":
                            result["score"],
                        "feedback":
                            result["feedback"]
                    }
                )

                st.info(
                    f"Follow-Up Question: {followup}"
                )

                st.subheader(
                    f"Question {question['id']}"
                )

                st.write(
                    f"Score: {result['score']}"
                )

                st.write(
                    result["feedback"]
                )

                st.divider()



        import uuid

        class StreamlitSession:
        
            def __init__(self):
        
                self.session_id = str(
                    uuid.uuid4()
                )
        
                self.role = (
                    "PDF Resume Interview"
                )
        
                self.experience = (
                    "N/A"
                )
        
                self.questions = (
                    questions
                )
        
                self.answers = (
                    answers
                )
        
                self.evaluations = (
                    evaluations
                )
        
            def to_dict(self):
        
                return {
                    "session_id":
                        self.session_id,
        
                    "role":
                        self.role,
        
                    "experience":
                        self.experience,
        
                    "questions":
                        self.questions,
        
                    "answers":
                        self.answers,
        
                    "evaluations":
                        self.evaluations
                }
        
        
        session = (
            StreamlitSession()
        )

        report_service = (
            ReportService()
        )

        report = (
            report_service.generate_report(
                session
            )
        )
        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric(
                "Average Score",
                report["average_score"]
            )
        
        with col2:
            st.metric(
                "Best Score",
                report["best_score"]
            )
        
        with col3:
            st.metric(
                "Questions",
                len(questions)
            )
        st.header(
            "Final Report"
        )

        st.json(
            report
        )

        career_service = (
            CareerSuggestionService()
        )
        
        suggestions = (
            career_service.generate_suggestions(
                report
            )
        )
        
        st.header(
            "AI Career Suggestions"
        )
        
        st.markdown(
            "## 🚀 AI Career Suggestions"
        )
        
        st.success(
            suggestions
        )



        pdf_service = (
            PDFReportService()
        )
        
        pdf_path = (
            pdf_service.generate_pdf(
                report,
                "interview_report.pdf"
            )
        )
        
        with open(
            pdf_path,
            "rb"
        ) as file:
        
            st.download_button(
                label="Download PDF Report",
                data=file,
                file_name="interview_report.pdf",
                mime="application/pdf"
            )

        persistence_service = (
            PersistenceService()
        )
        
        saved_path = (
            persistence_service.save_session(
                session
            )
        )

        st.success(
            f"Session saved to: {saved_path}"
        )



    history_service = (
        HistoryService()
    )

    history = (
        history_service.get_history()
    )

    st.subheader(
        "Interview History"
    )

    for item in history:

        st.write(
            f"Role: {item['role']}"
        )

        st.write(
            f"Experience: {item['experience']}"
        )

        st.write(
            f"Average Score: "
            f"{item['average_score']}"
        )

        st.divider()




    analytics_service = (
        AnalyticsService()
    )

    analytics = (
        analytics_service
        .generate_analytics()
    )

    st.subheader(
        "Performance Analytics"
    )

    data = {
        "Metric": [
            "Average Score",
            "Best Score",
            "Worst Score"
        ],
        "Value": [
            analytics["average_score"],
            analytics["best_score"],
            analytics["worst_score"]
        ]
    }

    df = pd.DataFrame(
        data
    )

    st.bar_chart(
        df.set_index(
            "Metric"
        )
    )

    st.write(
        "Debug Analytics:"
    )

    st.json(
        analytics
    )

    scores = analytics.get(
        "scores",
        []
    )

    if len(scores) > 0:

        trend_data = pd.DataFrame(
            {
                "Interview": list(
                    range(
                        1,
                        len(scores) + 1
                    )
                ),
                "Score": scores
            }
        )

        st.subheader(
            "Score Trend"
        )

        st.line_chart(
            trend_data.set_index(
                "Interview"
            )
        )

    else:

        st.warning(
            "No score history found."
        )

elif page == "History":

    history_service = (
        HistoryService()
    )

    history = (
        history_service.get_history()
    )

    st.header(
        "📂 Interview History"
    )

    for item in history:

        st.write(
            f"Role: {item['role']}"
        )

        st.write(
            f"Experience: {item['experience']}"
        )

        st.write(
            f"Average Score: "
            f"{item['average_score']}"
        )

        st.divider()


elif page == "Analytics":

    analytics_service = (
        AnalyticsService()
    )

    analytics = (
        analytics_service
        .generate_analytics()
    )

    st.header(
        "📊 Performance Analytics"
    )

    data = {
        "Metric": [
            "Average Score",
            "Best Score",
            "Worst Score"
        ],
        "Value": [
            analytics["average_score"],
            analytics["best_score"],
            analytics["worst_score"]
        ]
    }

    df = pd.DataFrame(
        data
    )

    st.bar_chart(
        df.set_index(
            "Metric"
        )
    )

    scores = analytics.get(
        "scores",
        []
    )

    if len(scores) > 0:

        trend_data = pd.DataFrame(
            {
                "Interview": list(
                    range(
                        1,
                        len(scores) + 1
                    )
                ),
                "Score": scores
            }
        )

        st.subheader(
            "Score Trend"
        )

        st.line_chart(
            trend_data.set_index(
                "Interview"
            )
        )

    st.json(
        analytics
    )