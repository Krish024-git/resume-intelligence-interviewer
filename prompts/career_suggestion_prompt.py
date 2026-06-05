def build_career_suggestion_prompt(
    report
):

    return f"""
You are a career coach.

Based on this interview report:

{report}

Provide:

1. Strengths
2. Weaknesses
3. Recommended Skills
4. Learning Roadmap

Keep the response concise.
"""