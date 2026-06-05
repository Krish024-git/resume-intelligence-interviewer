def build_question_prompt(
    role,
    experience,
    num_questions,
    mode
):

    mode_instructions = {
        "technical":
            "Generate technical interview questions specific to the target field and role.",

        "hr":
            "Generate HR and behavioral interview questions focused on the target field and role.",

        "resume":
            "Generate resume-based interview questions tailored to the target field and role.",

        "mixed":
            "Generate a mix of technical, HR, and resume-related questions tailored to the target field and role.",

        "behavioral":
            "Generate behavioral interview questions focused on the target field and role.",

        "system_design":
            "Generate system design interview questions specific to the target field and role."
    }

    instruction = mode_instructions.get(
        mode.lower(),
        "Generate interview questions specific to the target field and role."
    )

    return f"""
You are an expert interviewer.

{instruction}

Field / Role:
{role}

Experience:
{experience}

Generate exactly {num_questions} questions.

Return ONLY valid JSON.

Format:

[
    {{
        "text": "Question text"
    }}
]

No markdown.
No explanation.
No extra text.
"""
