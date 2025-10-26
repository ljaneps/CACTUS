# backend/cruds/topicscrud.py

##########################################################################
#                            CRUD - TOPICS                               #
##########################################################################

from sqlalchemy.orm import Session
from backend import models
from backend.schemas.topic import *
from datetime import date, datetime
from fastapi import HTTPException
import string
import random


def save_topic_from_schema(db: Session, topic_schema: TopicSchema):
    topic_db = models.Topic(
        topic_title=topic_schema.titulo,
        category=topic_schema.categoria,
        description=topic_schema.descripcion,
    )

    for sub in topic_schema.subtemas:
        sub_db = models.Subtopic(
            subtopic_title=sub.titulo,
            description=sub.descripcion,
            topic=topic_db
        )
        for flash in sub.flashcards:
            flash_db = models.Flashcard(
                sentence=flash.titulo,
                explanation=flash.explicacion,
                subtopic=sub_db
            )
            for q in flash.preguntas:
                question_db = models.Question(
                    question=q.enunciado,
                    option_correct_letter=q.respuesta_correcta,
                    flashcard=flash_db
                )
                for opt in q.opciones:
                    option_db = models.Option(
                        letter=opt.letter,
                        option=opt.option,
                        explanation=opt.explanation,
                        question=question_db
                    )
                    db.add(option_db)

                db.add(question_db)
            db.add(flash_db)
        db.add(sub_db)

    db.add(topic_db)
    db.commit()
    db.refresh(topic_db)

    return topic_db

###########################################################################
#                        TOPICS - SUBTOPICS                              ##
###########################################################################


def save_topic(db: Session, topic_schema: TopicSubtopicSchema):
    topic_db = models.Topic(
        topic_title=topic_schema.titulo,
        category=topic_schema.categoria,
        description=topic_schema.descripcion,
    )
    for sub in topic_schema.subtemas:
        sub_db = models.Subtopic(
            subtopic_title=sub.titulo,
            description=sub.descripcion,
            topic=topic_db
        )
        db.add(sub_db)
    db.add(topic_db)
    db.commit()
    db.refresh(topic_db)
    return topic_db

###########################################################################
#                              USER -TOPICS                              ##
###########################################################################


def save_user_topic(db: Session, username: str, topic_id: int,
                    date_goal: str = None,
                    low_percent: int = 100, intermediate_percent: int = 0, high_percent: int = 0):

    if isinstance(date_goal, str):
        try:
            date_goal = datetime.strptime(date_goal, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError(
                f"Formato de fecha inválido: {date_goal}. Usa AAAA-MM-DD (por ejemplo '2025-12-31').")

    user_topic = models.UserTopic(
        username=username,
        topic_code=topic_id,
        date_ini=date.today(),
        date_goal=date_goal,
        low_percent=low_percent,
        intermediate_percent=intermediate_percent,
        high_percent=high_percent
    )
    db.add(user_topic)
    db.commit()
    db.refresh(user_topic)
    return user_topic


###########################################################################
#                        SUBTOPICS - FLASHCARDS                          ##
###########################################################################

def save_subtopic_flashcards(
    db: Session,
    subtopic_id: int,
    flashcards_schema: list
):
    try:
        subtopic_db = db.query(models.Subtopic).filter(
            models.Subtopic.subtopic_code == subtopic_id
        ).first()

        if not subtopic_db:
            raise HTTPException(
                status_code=404, detail=f"Subtopic {subtopic_id} no encontrado."
            )

        if not isinstance(flashcards_schema, list):
            raise HTTPException(
                status_code=400, detail="El campo flashcards debe ser una lista."
            )

        created_flashcards = []

        for flash in flashcards_schema:
            titulo = flash.get("titulo")
            explicacion = flash.get("explicacion")
            preguntas = flash.get("preguntas")

            if not titulo or not explicacion or not preguntas:
                raise HTTPException(
                    status_code=400, detail=f"Estructura inválida en flashcard: {flash}"
                )

            # Crear flashcard
            flash_db = models.Flashcard(
                sentence=titulo[:500],
                explanation=explicacion,
                subtopic=subtopic_db
            )
            db.add(flash_db)
            db.flush()  # Para obtener el ID

            question_objects = []
            for pregunta in preguntas:
                correct_letter = random.choice(["A", "B", "C", "D"])
                question_db = models.Question(
                    flashcard_code=flash_db.flashcard_code,
                    question=pregunta[:500],
                    option_correct_letter=correct_letter
                )
                db.add(question_db)
                db.flush()  # Para obtener el question_code

                question_objects.append({
                    "question_code": question_db.question_code,
                    "question": question_db.question,
                    "option_correct_letter": question_db.option_correct_letter,
                    "options": []  # aún no generadas
                })

            created_flashcards.append({
                "flashcard_code": flash_db.flashcard_code,
                "sentence": flash_db.sentence,
                "explanation": flash_db.explanation,
                "questions": question_objects
            })

        db.commit()
        return created_flashcards

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error al guardar flashcards: {str(e)}"
        )

###########################################################################
#                           QUESTIONS - OPTIONS                          ##
###########################################################################

def save_options_questions(respuestas: list[QuestionOptionSchema], db: Session):
    letras_posibles = list(string.ascii_uppercase[:4])  # ["A", "B", "C", "D"]

    opciones_a_insertar = []

    for pregunta in respuestas:
        letras_disponibles = letras_posibles.copy()

        # Agregamos la opción correcta
        letra_correcta = pregunta.letter.upper()
        if letra_correcta not in letras_disponibles:
            letra_correcta = letras_disponibles.pop(0)
        else:
            letras_disponibles.remove(letra_correcta)

        opcion_correcta = models.Option(
            question_code=pregunta.question_code,
            letter=letra_correcta,
            option=pregunta.response,
            explanation=pregunta.explanation
        )
        opciones_a_insertar.append(opcion_correcta)

        # Agregamos las opciones incorrectas
        for opcion_texto in pregunta.options:
            # Evitar duplicar la letra de la respuesta correcta
            if opcion_texto == pregunta.response:
                continue

            if not letras_disponibles:
                break  # por seguridad, si ya usamos todas las letras

            letra = letras_disponibles.pop(0)

            opcion_incorrecta = models.Option(
                question_code=pregunta.question_code,
                letter=letra,
                option=opcion_texto,
                explanation=""  # vacío para las incorrectas
            )
            opciones_a_insertar.append(opcion_incorrecta)

    db.add_all(opciones_a_insertar)
    db.commit()

    return opciones_a_insertar
