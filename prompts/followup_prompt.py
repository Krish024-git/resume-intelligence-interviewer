def build_followup_prompt(
    question,
    answer
):

    return f"""
You are an expert technical interviewer.

Original Question:
{question}

Candidate Answer:
{answer}

Generate ONE follow-up interview question.

Return only the question.
"""