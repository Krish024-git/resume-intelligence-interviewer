def build_skill_extraction_prompt(
    resume_text
):

    return f"""
Extract concrete skills, tools, frameworks, languages, platforms, databases,
and technical concepts from the resume.

Rules:
- Include skills even when they appear in projects, experience, summaries, or coursework.
- Normalize common names, for example JS -> JavaScript and ReactJS -> React.
- Do not include job titles, company names, soft skills, or full sentences.
- Return unique skills only.

Resume:

{resume_text}

Return ONLY valid JSON.

Format:

[
    "Python",
    "SQL",
    "Machine Learning"
]

No markdown.
No explanation.
"""
