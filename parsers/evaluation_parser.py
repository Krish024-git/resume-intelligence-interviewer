import json
import re


def parse_evaluation(content):
    parsed = None

    for candidate in _json_candidates(str(content or "")):
        try:
            parsed = json.loads(candidate)
            break
        except json.JSONDecodeError:
            continue

    if not isinstance(parsed, dict):
        raise ValueError("Invalid evaluation JSON.")

    score = parsed.get("score", 0)

    try:
        score = int(round(float(score)))
    except (TypeError, ValueError):
        score = 0

    return {
        "score": max(0, min(score, 10)),
        "feedback": str(parsed.get("feedback") or "No feedback returned."),
        "strengths": _string_list(parsed.get("strengths")),
        "weaknesses": _string_list(parsed.get("weaknesses")),
        "recommendations": _string_list(parsed.get("recommendations")),
    }


def _json_candidates(text):
    text = text.strip()
    if text:
        yield text

    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if fenced:
        yield fenced.group(1).strip()

    object_match = re.search(r"\{[\s\S]*\}", text)
    if object_match:
        yield object_match.group(0)


def _string_list(value):
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]

    if isinstance(value, str) and value.strip():
        return [value.strip()]

    return []
