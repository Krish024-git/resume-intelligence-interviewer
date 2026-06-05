class ResumeService:

    def extract_skills(
        self,
        filepath
    ):

        with open(
            filepath,
            "r",
            encoding="utf-8"
        ) as file:

            skills = [
                line.strip()
                for line in file.readlines()
                if line.strip()
            ]

        return skills