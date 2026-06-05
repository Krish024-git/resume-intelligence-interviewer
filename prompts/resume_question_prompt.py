def build_resume_question_prompt(
    skills,
    difficulty
):

    return f"""
Generate 5 {difficulty} level interview questions
based on these skills:

{", ".join(skills)}

Return ONLY valid JSON.

Format:

[
    {{
        "text": "..."
    }}
]

No markdown.
No explanation.
"""
