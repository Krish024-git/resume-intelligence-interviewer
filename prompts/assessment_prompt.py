import json


def build_assessment_prompt(session):

    return f"""
You are a senior technical interviewer.

Analyze the interview session.

Session Data:

{json.dumps(session.to_dict(), indent=2)}

Return ONLY valid JSON.

Format:

{{
    "overall_score": 0,
    "strengths": [],
    "weaknesses": [],
    "recommendation": "",
    "improvement_plan": []
}}
"""