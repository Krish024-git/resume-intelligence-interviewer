from services.persistence_service import (
    PersistenceService
)

import json

service = PersistenceService()

sessions = service.list_sessions()

print("\nSaved Sessions:\n")

for index, session in enumerate(
    sessions,
    start=1
):
    print(
        f"{index}. {session}"
    )

choice = int(
    input(
        "\nSelect session: "
    )
)

selected = sessions[
    choice - 1
]

data = service.load_session(
    selected
)

print(
    json.dumps(
        data,
        indent=4
    )
)