from pydantic import BaseModel
from typing import List


# -------------------------
# OPTION
# -------------------------
class OptionSchema(BaseModel):
    letter: str
    option: str
    explanation: str | None = None

    class Config:
        from_attributes = True
        

class OptionResponse(BaseModel):
    option_code: str
    question_code: str
    option: str
    explanation: str | None = None

    class Config:
        from_attributes = True


# -------------------------
# QUESTION
# -------------------------
class QuestionSchema(BaseModel):
    enunciado: str
    opciones: List[OptionSchema]
    respuesta_correcta: str

    class Config:
        from_attributes = True


# -------------------------
# FLASHCARD
# -------------------------
class FlashcardSchema(BaseModel):
    titulo: str
    explicacion: str
    preguntas: List[QuestionSchema]

    class Config:
        from_attributes = True


# -------------------------
# SUBTOPIC
# -------------------------
class SubtopicSchema(BaseModel):
    titulo: str
    descripcion: str
    flashcards: List[FlashcardSchema]

    class Config:
        from_attributes = True


# -------------------------
# TOPIC (root)
# -------------------------
class TopicSchema(BaseModel):
    titulo: str
    descripcion: str
    subtemas: List[SubtopicSchema]

    class Config:
        from_attributes = True
