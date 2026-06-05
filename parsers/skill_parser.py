import json
import re


def parse_skills(
    content
):
    if isinstance(content, list):
        return _clean_skills(content)

    if not content:
        return []

    text = str(content).strip()

    for candidate in _json_candidates(text):
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, list):
                return _clean_skills(parsed)
            if isinstance(parsed, dict):
                for key in ("skills", "technical_skills", "technologies"):
                    value = parsed.get(key)
                    if isinstance(value, list):
                        return _clean_skills(value)
        except json.JSONDecodeError:
            continue

    lines = re.split(r"[\n,;]+", text)
    skills = [
        re.sub(r"^[\s\-*\d.)]+", "", line).strip(" \"'")
        for line in lines
    ]

    return _clean_skills(skills)


def _json_candidates(text):
    yield text

    fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL | re.IGNORECASE)
    if fenced:
        yield fenced.group(1).strip()

    array_match = re.search(r"\[[\s\S]*\]", text)
    if array_match:
        yield array_match.group(0)

    object_match = re.search(r"\{[\s\S]*\}", text)
    if object_match:
        yield object_match.group(0)


def _clean_skills(skills):
    cleaned = []
    seen = set()

    for skill in skills:
        if not isinstance(skill, str):
            continue

        value = re.sub(r"\s+", " ", skill).strip(" .,:;\"'")
        if not value:
            continue

        key = value.casefold()
        if key not in seen:
            seen.add(key)
            cleaned.append(value)

    return cleaned
