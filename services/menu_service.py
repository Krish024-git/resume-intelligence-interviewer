from services.interview_service import (
    InterviewService
)

from services.history_service import (
    HistoryService
)

from services.resume_interview_service import (
    ResumeInterviewService
)


class MenuService:

    def __init__(self):

        self.interview_service = (
            InterviewService()
        )

        self.history_service = (
            HistoryService()
        )

        self.resume_interview_service = (
            ResumeInterviewService()
        )

    def start(self):

        while True:

            print("\n========================")
            print("AI Interview Simulator")
            print("========================")

            print("1. Start Interview")
            print("2. Resume-Based Interview")
            print("3. View History")
            print("4. Exit")

            choice = input(
                "\nChoose Option: "
            )

            if choice == "1":

                self.interview_service.start()

            elif choice == "2":

                self.resume_interview_service.start()

            elif choice == "3":

                history = (
                    self.history_service
                    .get_history()
                )

                print(
                    "\nInterview History\n"
                )

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

            elif choice == "3":

                print(
                    "\nGoodbye!"
                )

                break

            else:

                print(
                    "\nInvalid Option"
                )