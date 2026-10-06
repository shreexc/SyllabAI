from ..models import LearningResource, PreparationRequest


def normalize(value: str) -> str:
    return " ".join(value.casefold().split())


def validate_preparation_output(kind: str, result: dict, resource: LearningResource) -> dict:
    """Apply type-specific schema, duplicate, and source-grounding checks before persistence."""
    if not isinstance(result.get("title"), str) or not result["title"].strip():
        raise ValueError("Generated result is missing its title.")
    source = normalize(" ".join(resource.chunks.filter(resource_version=resource.resource_version).values_list("text", flat=True)))

    if kind == PreparationRequest.PreparationType.QUIZ:
        questions = result.get("questions")
        if not isinstance(questions, list) or not questions:
            raise ValueError("No valid quiz questions could be generated from this source.")
        seen_questions: set[str] = set()
        for question in questions:
            if not isinstance(question, dict) or not all(isinstance(question.get(key), str) and question[key].strip() for key in ("question", "answer", "explanation", "type")):
                raise ValueError("A quiz question failed structured validation.")
            identity = normalize(question["question"])
            if identity in seen_questions:
                raise ValueError("Duplicate quiz questions were generated.")
            seen_questions.add(identity)
            explanation = normalize(question["explanation"])
            answer = normalize(question["answer"])
            answer_is_grounded = answer in explanation if question["type"] != "true_false" else answer in {"true", "false"}
            if not explanation or explanation not in source or not answer_is_grounded:
                raise ValueError("A quiz question failed source-grounding validation.")
            choices = question.get("choices")
            if question["type"] == "mcq":
                if not isinstance(choices, list) or len(choices) < 2 or question["answer"] not in choices:
                    raise ValueError("A multiple-choice question failed answer-choice validation.")
                normalized_choices = [normalize(choice) for choice in choices if isinstance(choice, str)]
                if len(normalized_choices) != len(choices) or len(normalized_choices) != len(set(normalized_choices)):
                    raise ValueError("A multiple-choice question contains duplicate or invalid choices.")
    elif kind == PreparationRequest.PreparationType.SHORT_NOTE:
        points = result.get("key_points")
        if not isinstance(points, list) or not points:
            raise ValueError("No short-note key points could be prepared from this source.")
        normalized_points = [normalize(point) for point in points if isinstance(point, str)]
        if len(normalized_points) != len(points) or len(normalized_points) != len(set(normalized_points)):
            raise ValueError("Short notes failed duplicate or structure validation.")
        if any(point not in source for point in normalized_points):
            raise ValueError("A short-note point failed source-grounding validation.")
    elif kind == PreparationRequest.PreparationType.FLASHCARD:
        cards = result.get("cards")
        if not isinstance(cards, list) or not cards:
            raise ValueError("No flashcards could be prepared from this source.")
        fronts: set[str] = set()
        for card in cards:
            if not isinstance(card, dict) or not isinstance(card.get("front"), str) or not isinstance(card.get("back"), str):
                raise ValueError("A flashcard failed structured validation.")
            front = normalize(card["front"])
            back = normalize(card["back"])
            if not front or front in fronts or not back:
                raise ValueError("Flashcards failed duplicate or structure validation.")
            fronts.add(front)
            if back not in source:
                raise ValueError("A flashcard answer failed source-grounding validation.")
    elif kind == PreparationRequest.PreparationType.IMAGE:
        if not isinstance(result.get("mime_type"), str) or not isinstance(result.get("alt"), str):
            raise ValueError("Image output failed metadata validation.")
        if not (isinstance(result.get("svg"), str) or result.get("image_mode") in {"source_image", "extracted_image"}):
            raise ValueError("Image output did not contain a supported image asset.")
    elif kind == PreparationRequest.PreparationType.ANIMATION:
        scenes = result.get("scenes")
        duration = result.get("duration")
        if not isinstance(scenes, list) or not scenes or isinstance(duration, bool) or not isinstance(duration, int):
            raise ValueError("Storyboard failed structured validation.")
        if any(not isinstance(scene, dict) or not isinstance(scene.get("narration"), str) for scene in scenes):
            raise ValueError("A storyboard scene failed structured validation.")
        narrations = [normalize(scene["narration"]) for scene in scenes]
        if any(narration not in source for narration in narrations):
            raise ValueError("A storyboard scene failed source-grounding validation.")
        if sum(int(scene.get("duration", 0)) for scene in scenes) != duration:
            raise ValueError("Storyboard scene durations do not match the requested duration.")
    elif kind == PreparationRequest.PreparationType.OTHER:
        request = result.get("requested_material")
        sections = result.get("sections")
        if not isinstance(request, str) or not request.strip() or not isinstance(sections, list) or not sections:
            raise ValueError("Custom material failed structured validation.")
        for section in sections:
            if not isinstance(section, dict) or not isinstance(section.get("heading"), str) or not isinstance(section.get("content"), str):
                raise ValueError("A custom material section failed structured validation.")
            content = normalize(section["content"])
            if not content or content not in source:
                raise ValueError("A custom material section failed source-grounding validation.")
    return result
