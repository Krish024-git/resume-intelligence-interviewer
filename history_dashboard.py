from services.history_service import (
    HistoryService
)

service = HistoryService()

history = service.get_history()

print("\nInterview History\n")

for index, item in enumerate(
    history,
    start=1
):

    print(
        f"{index}. "
        f"{item['role']} | "
        f"{item['experience']} | "
        f"Avg Score: "
        f"{item['average_score']}"
    )