import json
import os


class PersistenceService:

    def __init__(self):

        self.storage_dir = (
            "data/sessions"
        )

        os.makedirs(
            self.storage_dir,
            exist_ok=True
        )

    def save_session(
        self,
        session
    ):

        filename = (
            f"{session.session_id}.json"
        )

        filepath = os.path.join(
            self.storage_dir,
            filename
        )

        with open(
            filepath,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                session.to_dict(),
                file,
                indent=4
            )

        return filepath
    
    def list_sessions(self):

        return [
            file
            for file in os.listdir(
                self.storage_dir
            )
            if file.endswith(".json")
        ]
    def load_session(
        self,
        filename
    ):
    
        filepath = os.path.join(
            self.storage_dir,
            filename
        )
    
        with open(
            filepath,
            "r",
            encoding="utf-8"
        ) as file:
    
            return json.load(file)