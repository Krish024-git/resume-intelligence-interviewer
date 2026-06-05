import json
import re


def parse_questions(response_text):
    parsed = None

    for candidate in _json_candidates(str(response_text or "")):
        try:
            parsed = json.loads(candidate)
            break
        except json.JSONDecodeError:
            continue

    if parsed is None:
        questions = [
            _clean_question(line)
            for line in str(response_text or "").splitlines()
        ]
        return [q for q in questions if q]

    if isinstance(parsed, dict):
        parsed = parsed.get("questions", [])

    if not isinstance(parsed, list):
        raise ValueError("Model returned invalid questions.")

    questions = []

    for item in parsed:
        if isinstance(item, str):
            text = item
        elif isinstance(item, dict):
            text = (
                item.get("text")
                or item.get("question")
                or item.get("prompt")
                or ""
            )
        else:
            text = str(item)

        text = _clean_question(text)
        if text:
            questions.append(text)

    return questions


def _json_candidates(text):
    text = text.strip()
    if text:
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


def _clean_question(text):
    text = re.sub(r"\s+", " ", str(text or "")).strip()
    text = re.sub(r"^(?:question\s*)?\d+\s*[\).:-]\s*", "", text, flags=re.IGNORECASE)
    return text.strip(" \"'")
