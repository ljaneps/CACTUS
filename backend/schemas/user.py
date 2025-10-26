# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    username: str
    email: EmailStr

    class Config:
        from_attributes = True
        

class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True
        

class UserQuestionResponse(BaseModel):
    username: str
    topic_code: int
    question_code: int
    level: int
    streak: int
    last_result: str
    favourite: bool
    

class UserQuestionsPayload(BaseModel):
    user_questions: List[UserQuestionResponse]


class UserQuestionRequest(BaseModel):
    topic_question_codes: list[int]
