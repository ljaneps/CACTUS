from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime


# -------------------------
# OPTION
# -------------------------
class OptionSchema(BaseModel):
    letter: str
    option: str
    explanation: Optional[str]

    class Config:
        from_attributes = True


class OptionResponseSchema(BaseModel):
    letter: str
    option: str
    explanation: Optional[str]
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
        

class QuestionResponseSchema(BaseModel):
    question_code: int
    question: str
    option_correct_letter: Optional[str]
    options: List[OptionResponseSchema] = []

    class Config:
       from_attributes = True


# -------------------------
# FLASHCARD
# -------------------------
class FlashcardSchema(BaseModel):
    titulo: str
    explicacion: str
    preguntas: Optional[str] = None

    class Config:
        from_attributes = True
    

class FlashcardResponseSchema(BaseModel):
    flashcard_code: int
    sentence: str
    explanation: Optional[str]
    questions: List[QuestionResponseSchema] = []

    class Config:
        from_attributes = True


# -------------------------
# SUBTOPIC
# -------------------------
class SubtopicSchema(BaseModel):
    titulo: str
    descripcion: str
    flashcards: List[FlashcardSchema] = []

    class Config:
        from_attributes = True


class SubtopicResponseSchema(BaseModel):
    subtopic_code: int
    subtopic_title: str
    description: Optional[str]
    flashcards: List[FlashcardResponseSchema] = []

    class Config:
        from_attributes = True

# -------------------------
# TOPIC (root)
# -------------------------
class TopicSchema(BaseModel):
    titulo: str
    categoria: str
    descripcion: str
    subtemas: List[SubtopicSchema]

    class Config:
        from_attributes = True
        
class TopicResponseSchema(BaseModel):
    topic_code: int
    topic_title: str
    category: str
    description: Optional[str]
    subtopics: List[SubtopicResponseSchema] = []

    class Config:
        from_attributes = True


class TopicFormSchema(BaseModel):
    tema: str
    puntos:  List[str] | None = None
    archivo: str | None = None
    objetivo: str | None = None

    class Config:
        from_attributes = True


class TopicInfoSchema(BaseModel):
    topic_code: int
    topic_title: str
    category: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class UserTopicBasicSchema(BaseModel):
    username: str
    date_ini: Optional[date]
    date_goal: Optional[date]
    low_percent: Optional[int]
    intermediate_percent: Optional[int]
    high_percent: Optional[int]
    topic: TopicInfoSchema

    class Config:
        from_attributes = True


