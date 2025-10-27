# backend/routers/users.py

##########################################################################
#                                  USERS                                 #
##########################################################################
import os
from typing import List
from fastapi import Query
from fastapi import APIRouter, Depends, Body, HTTPException, status, APIRouter
from datetime import datetime, timedelta, date
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend import models, database
from backend.schemas import user as user_schema
from backend.schemas import topic as topic_schema
from backend.utils.security import hash_password, verify_password
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from backend.cruds import *

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

router = APIRouter(prefix="/users", tags=["Users"])

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60*24))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Dependencia para obtener la sesión de la BD


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREAR usuario


@router.post("/add", response_model=user_schema.UserResponse)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# Generar token


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# LOGIN usuario


@router.post("/login")
def login_user(credentials: user_schema.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.username})

    return {"access_token": token, "token_type": "bearer"}


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    user = db.query(models.User).filter(
        models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user


# OBTENER usuario por email
@router.get("/by-email/{email}", response_model=user_schema.UserResponse)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# Eliminar usuario
@router.post("/delete")
def delete_user(identifier: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        (models.User.username == identifier) | (
            models.User.email == identifier)
    ).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"detail": "User deleted"}


# OBTENER datos de user-questions
@router.post("/questions/{username}", response_model=List[user_schema.UserQuestionResponse])
def get_user_questions(
    username: str,
    request: user_schema.UserQuestionRequest = Body(...),
    db: Session = Depends(get_db)
):
    user_questions = (
        db.query(models.UserQuestion)
        .filter(
            models.UserQuestion.username == username,
            models.UserQuestion.question_code.in_(request.topic_question_codes)
        )
        .all()
    )
    return user_questions


# UPDATE progreso de user-topic

def update_user_topic_progress(db: Session, username: str, topic_code: int):
    user_questions = db.query(models.UserQuestion).filter(
        models.UserQuestion.username == username,
        models.UserQuestion.topic_code == topic_code
    ).all()

    if not user_questions:
        return

    total = len(user_questions)
    low_count = sum(1 for q in user_questions if q.level == 1)
    intermediate_count = sum(1 for q in user_questions if q.level == 2)
    high_count = sum(1 for q in user_questions if q.level == 3)

    low_percent = round((low_count / total) * 100)
    intermediate_percent = round((intermediate_count / total) * 100)
    high_percent = round((high_count / total) * 100)

    user_topic = db.query(models.UserTopic).filter_by(
        username=username,
        topic_code=topic_code
    ).first()

    if not user_topic:

        user_topic = models.UserTopic(
            username=username,
            topic_code=topic_code,
            date_ini=date.today(),
            date_goal=None,
            low_percent=low_percent,
            intermediate_percent=intermediate_percent,
            high_percent=high_percent
        )
        db.add(user_topic)
    else:

        user_topic.low_percent = low_percent
        user_topic.intermediate_percent = intermediate_percent
        user_topic.high_percent = high_percent

    db.commit()

# ADD or UPDATE user-question


@router.post("/add-or-update")
def add_or_update_user_question(
    payload: dict = Body(...),
    db: Session = Depends(get_db)
):
    # print("Recibido:", payload)

    user_questions = payload.get("user_questions", [])
    for uq in user_questions:
        existing_uq = db.query(models.UserQuestion).filter(
            (models.UserQuestion.username == uq["username"]) &
            (models.UserQuestion.topic_code == uq["topic_code"]) &
            (models.UserQuestion.question_code == uq["question_code"])
        ).first()

        if existing_uq:
            existing_uq.level = uq["level"]
            existing_uq.streak = uq["streak"]
            existing_uq.last_result = uq["last_result"]
            existing_uq.favourite = uq["favourite"]
        else:
            new_uq = models.UserQuestion(
                username=uq["username"],
                topic_code=uq["topic_code"],
                question_code=uq["question_code"],
                level=uq["level"],
                streak=uq["streak"],
                last_result=uq["last_result"],
                favourite=uq["favourite"],
            )
            db.add(new_uq)

    db.commit()

    user_questions = payload.get("user_questions", [])
    if user_questions:
        topic_codes = set(uq["topic_code"] for uq in user_questions)
        username = user_questions[0]["username"]
        for topic_code in topic_codes:
            update_user_topic_progress(
                db, username=username, topic_code=topic_code)

    return {"detail": "User questions added or updated successfully"}


# UPDATE favorito user-question

@router.post("/update-favourite-question")
def update_user_question_favourite(
    request: user_schema.UserQuestionFavouriteUpdate = Body(...),
    db: Session = Depends(get_db)
):
    username = request.username
    topic_code = request.topic_code
    question_code = request.question_code
    favourite = request.favourite

    user_question = db.query(models.UserQuestion).filter(
        (models.UserQuestion.username == username) &
        (models.UserQuestion.topic_code == topic_code) &
        (models.UserQuestion.question_code == question_code)
    ).first()

    if not user_question:
        raise HTTPException(status_code=404, detail="UserQuestion not found")

    user_question.favourite = favourite
    db.commit()

    return {"detail": "User question favourite updated successfully"}


# Obtener favoritos user-qeuestions con username, favourite=True y topic_code dado
@router.get("/favourite-questions/{username}", response_model=List[user_schema.UserQuestionResponse])
def get_favourite_user_questions(
    username: str,
    topic_code: int = Query(...,
                            description="Topic code to filter favourite questions"),
    db: Session = Depends(get_db)
):
    favourite_questions = db.query(models.UserQuestion).filter(
        (models.UserQuestion.username == username) &
        (models.UserQuestion.topic_code == topic_code) &
        (models.UserQuestion.favourite == True)
    ).all()

    return favourite_questions

# UPDATE favoritos user-flashcard


@router.post("/update-favourite-flashcard")
def update_user_flashcard_favourite(
    req: user_schema.UserFlashcardFavouriteUpdate = Body(...),
    db: Session = Depends(get_db)
):
    user_flashcard = db.query(models.UserFlashcard).filter(
        (models.UserFlashcard.username == req.username) &
        (models.UserFlashcard.topic_code == req.topic_code) &
        (models.UserFlashcard.flashcard_code == req.flashcard_code)
    ).first()

    if not user_flashcard:
        raise HTTPException(status_code=404, detail="UserFlashcard not found")

    user_flashcard.favourite = req.favourite
    db.commit()

    return {"detail": "User flashcard favourite updated successfully"}


# Obtener favorito user-flashcard con username, topic_code, favourite=True
@router.get("/favourite-flashcards/{username}", response_model=List[user_schema.UserFlashcardFavouriteUpdate])
def get_favourite_user_flashcards(
    username: str,
    topic_code: int = Query(...,
                            description="Topic code to filter favourite flashcards"),
    db: Session = Depends(get_db)
):
    favourite_flashcards = db.query(models.UserFlashcard).filter(
        (models.UserFlashcard.username == username) &
        (models.UserFlashcard.topic_code == topic_code) &
        (models.UserFlashcard.favourite == True)
    ).all()

    return favourite_flashcards


# Genera un test general adaptativo tipo Leitner
# Después de obtener la lista List[user_schema.UserQuestionResponse], con el los question_code, obtener las preguntas completas
# de la tabla questions, y devolver lista de QuestionSchema

def get_leitner_test_questions(db, username: str, topic_code: int, total: int = 20):
    user_questions = db.query(models.UserQuestion).filter_by(
        username=username,
        topic_code=topic_code
    ).all()

    level_1 = [uq for uq in user_questions if uq.level == 1]
    level_2 = [uq for uq in user_questions if uq.level == 2]
    level_3 = [uq for uq in user_questions if uq.level == 3]

    n1 = round(total * 0.6)
    n2 = round(total * 0.3)
    n3 = total - n1 - n2

    import random
    selected = random.sample(level_1, min(n1, len(level_1))) \
        + random.sample(level_2, min(n2, len(level_2))) \
        + random.sample(level_3, min(n3, len(level_3)))

    random.shuffle(selected)

    return selected


@router.get("/test/general/{username}/{topic_code}", response_model=list[topic_schema.QuestionResponseSchema])
def get_general_test(username: str, topic_code: int, db: Session = Depends(get_db)):
    questions = get_leitner_test_questions(
        db, username=username, topic_code=topic_code, total=20
    )

    question_objs = []

    for uq in questions:
        q = db.query(models.Question).filter_by(
            question_code=uq.question_code
        ).first()

        if q:
            options = db.query(models.Option).filter_by(
                question_code=q.question_code
            ).all()

            option_objs = [
                {
                    "question_code": opt.question_code,
                    "letter": opt.letter,
                    "option": opt.option,
                    "explanation": opt.explanation,
                }
                for opt in options
            ]

            question_objs.append({
                "question_code": q.question_code,
                "question": q.question,
                "option_correct_letter": q.option_correct_letter,
                "options": option_objs,
            })

    return question_objs
