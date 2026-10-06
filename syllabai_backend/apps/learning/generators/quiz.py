import re
from collections.abc import Mapping

from ..models import LearningResource
from .base import BasePreparationGenerator


def sentences(text: str) -> list[str]:
    return [part.strip() for part in re.split(r"(?<=[.!?])\s+|\n+", text) if len(part.strip()) >= 35]


class QuizGenerator(BasePreparationGenerator):
    def generate(self, resource: LearningResource, options: Mapping[str, object]) -> dict:
        source = self.require_source_text(resource)
        source_sentences = list(dict.fromkeys(sentences(source)))
        topic = str(options.get("topic", "")).strip().casefold()
        if topic:
            source_sentences = [sentence for sentence in source_sentences if topic in sentence.casefold()]
        count = min(int(options.get("count", 10)), len(source_sentences))
        question_types = options.get("question_types", ["fill_in_blank"])
        other_terms = list(dict.fromkeys(re.findall(r"\b[A-Z][a-zA-Z-]{3,}\b", source)))
        questions = []
        for index, sentence in enumerate(source_sentences[:count]):
            words = re.findall(r"\b[A-Z][a-zA-Z-]{3,}\b", sentence)
            key = words[-1] if words else next((word for word in sentence.split() if len(word) > 7), "this concept")
            prompt = sentence.replace(key, "_____", 1)
            question_type = question_types[index % len(question_types)]
            question = {
                "id": index + 1,
                "type": question_type,
                "answer": key,
                "explanation": sentence,
                "source_chunk": index,
            }
            if question_type == "true_false":
                question["question"] = f"True or false: {sentence}"
                question["answer"] = "true"
            elif question_type == "mcq":
                choices = [key, *[term for term in other_terms if term.casefold() != key.casefold()][:3]]
                if len(choices) >= 2:
                    question["question"] = f"Which term completes this statement? {prompt}"
                    question["choices"] = choices
                else:
                    question["type"] = "fill_in_blank"
                    question["question"] = f"Complete the statement: {prompt}"
            else:
                question["question"] = f"Complete the statement: {prompt}"
            questions.append(question)
        return self.validate_result({
            "title": f"{resource.title} Quiz",
            "count": len(questions),
            "difficulty": options.get("difficulty", "medium"),
            "language": options.get("language", "en"),
            "questions": questions,
            "grounding": "Questions are generated directly from extracted source sentences.",
        })
