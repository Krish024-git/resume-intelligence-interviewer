from api.openrouter_client import (
    OpenRouterClient
)

from prompts.skill_extraction_prompt import (
    build_skill_extraction_prompt
)

from parsers.skill_parser import (
    parse_skills
)

import re


SKILL_ALIASES = {
    "JavaScript": ["javascript", "js", "ecmascript"],
    "TypeScript": ["typescript", "ts"],
    "React": ["react", "react.js", "reactjs"],
    "Next.js": ["next.js", "nextjs", "next js"],
    "Node.js": ["node.js", "nodejs", "node js"],
    "Express.js": ["express", "express.js"],
    "Python": ["python"],
    "Flask": ["flask"],
    "Django": ["django"],
    "FastAPI": ["fastapi", "fast api"],
    "Java": ["java"],
    "C++": ["c++", "cpp"],
    "C#": ["c#", "c sharp"],
    "SQL": ["sql"],
    "MySQL": ["mysql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "MongoDB": ["mongodb", "mongo db"],
    "Redis": ["redis"],
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure"],
    "Google Cloud": ["google cloud", "gcp"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "Git": ["git"],
    "GitHub": ["github"],
    "REST API": ["rest api", "restful", "rest"],
    "GraphQL": ["graphql"],
    "HTML": ["html", "html5"],
    "CSS": ["css", "css3"],
    "Tailwind CSS": ["tailwind", "tailwind css"],
    "Machine Learning": ["machine learning", "ml"],
    "Deep Learning": ["deep learning"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Data Structures": ["data structures", "dsa"],
    "Algorithms": ["algorithms"],
    "System Design": ["system design"],
    "Microservices": ["microservices"],
    "CI/CD": ["ci/cd", "cicd", "continuous integration"],
}


class SkillExtractionService:

    def __init__(self):

        self.client = (
            OpenRouterClient()
        )

    def extract_skills(
        self,
        resume_text
    ):
        resume_text = resume_text or ""

        prompt = (
            build_skill_extraction_prompt(
                resume_text
            )
        )

        try:
            result = (
                self.client.generate(
                    prompt
                )
            )

            content = result[
                "choices"
            ][0]["message"]["content"]

            skills = parse_skills(
                content
            )

            if skills:
                return skills

        except Exception:
            pass

        return self._extract_known_skills(
            resume_text
        )

    def _extract_known_skills(
        self,
        resume_text
    ):
        normalized = (
            resume_text
            .replace("/", " / ")
            .replace("-", " ")
            .casefold()
        )

        found = []

        for skill, aliases in SKILL_ALIASES.items():
            for alias in aliases:
                pattern = r"(?<![a-z0-9+#.])" + re.escape(alias.casefold()) + r"(?![a-z0-9+#.])"
                if re.search(pattern, normalized):
                    found.append(skill)
                    break

        return found
