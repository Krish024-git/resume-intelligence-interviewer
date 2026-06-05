import json


def parse_assessment(content):

    try:
        return json.loads(content)

    except json.JSONDecodeError:
        raise ValueError(
            "Invalid assessment JSON."
        )