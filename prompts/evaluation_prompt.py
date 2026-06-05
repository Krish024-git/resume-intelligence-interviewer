def build_evaluation_prompt(
    question,
    answer
):
    return f"""
You are a senior technical interviewer.

Evaluate the candidate answer.

Question:
{question}

Answer:
{answer}

Return ONLY valid JSON.

Format:

{{
    "score": 0,
    "feedback": "",
    "strengths": ["Specific strength"],
    "weaknesses": ["Specific weakness"],
    "recommendations": ["Specific recommendation"]
}}

Rules:
- Score between 0 and 10
- Feedback max 2 sentences
- Strengths, weaknesses, and recommendations must each contain 1 to 3 concise items
- Return JSON only
"""
