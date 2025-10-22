# backend/routers/topics.py

##########################################################################
#                          ROUTER - TOPICS                               #
##########################################################################
import os
import re
import json
import httpx
from typing import Union
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ValidationError
from sqlalchemy.orm import Session, joinedload
from backend.database import SessionLocal
from backend.schemas .topic import *
from backend.schemas import topic as topic_schema
from backend.schemas import user as user_schema
from backend.cruds.topic import *
from backend.routers.users import get_current_user
import backend.models as models
import json5

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
router = APIRouter(prefix="/topics", tags=["Topics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class TemaRequest(BaseModel):
    tema: str


#########################################################################
#
# TOPICS
#
#########################################################################


# GENERAR TEMARIO

@router.post("/generar-temario-global")
async def generar_temario(
    req: TopicFormSchema,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    prompt = f"""
    Eres un generador de contenido educativo. 
    Tu tarea es crear un objeto JSON siguiendo **estrictamente** la estructura mostrada a continuación, sin texto adicional fuera del JSON.

    Estructura exacta requerida:
    {{
        "titulo": "string",
        "categoria": "string",
        "descripcion": "string",
        "subtemas": [
            {{
                "titulo": "string",
                "descripcion": "string",
                "flashcards": [
                    {{
                        "titulo": "string",
                        "explicacion": "string",
                        "preguntas": [
                            {{
                                "enunciado": "string",
                                "opciones": [
                                    {{
                                        "letter": "A" | "B" | "C" | "D",
                                        "option": "string",
                                        "explanation": "string (puede estar vacío)"
                                    }}
                                ],
                                "respuesta_correcta": "letra correspondiente (A, B, C o D)"
                            }}
                        ]
                    }}
                ]
            }}
        ]
    }}

    Reglas importantes:
    - **No** incluyas texto fuera del JSON.
    - Usa las claves exactamente como aparecen.
    - Cada subtema debe tener al menos 5 flashcards.
    - Cada flashcard debe tener entre 2 y 3 preguntas.
    - Cada pregunta debe tener 4 opciones (A, B, C, D).
    - Solo las opciones correctas deben tener explicación.
    - Si el tema lo requiere, incluye una categoría relevante.

    Tema: {req.tema}
    """

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "z-ya-text-1",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "clase",
                "strict": True,
                "schema": {
                    "type": "object",
                    "properties": {
                        "titulo": {"type": "string"},
                        "categoria": {"type": "string"},
                        "descripcion": {"type": "string"},
                        "subtemas": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "titulo": {"type": "string"},
                                    "descripcion": {"type": "string"},
                                    "flashcards": {
                                        "type": "array",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "titulo": {"type": "string"},
                                                "explicacion": {"type": "string"},
                                                "preguntas": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "object",
                                                        "properties": {
                                                            "enunciado": {"type": "string"},
                                                            "opciones": {
                                                                "type": "array",
                                                                "items": {
                                                                    "type": "object",
                                                                    "properties": {
                                                                        "letter": {"type": "string"},
                                                                        "option": {"type": "string"},
                                                                        "explanation": {"type": "string"}
                                                                    }
                                                                }
                                                            },
                                                            "respuesta_correcta": {"type": "string"}
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "required": ["titulo", "categoria"]
                }
            }
        }
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        print("Respuesta completa de OpenRouter:", data)

    try:
        raw_message = data["choices"][0]["message"]

        if isinstance(raw_message, dict) and "content" in raw_message:
            raw_json = raw_message["content"]
        elif isinstance(raw_message, str):
            raw_json = raw_message
        else:
            raise HTTPException(
                status_code=500, detail="La respuesta del modelo no contiene contenido JSON válido.")

        # Limpieza básica
        clean_json = (
            raw_json.replace("“", "\"")
            .replace("”", "\"")
            .replace("‘", "'")
            .replace("’", "'")
            .replace("\n", " ")
            .replace("\r", " ")
        )
        clean_json = re.sub(r"```(?:json)?", "", clean_json).strip()

        # Extrae el bloque JSON (primer { hasta último })
        start = clean_json.find("{")
        end = clean_json.rfind("}")
        if start == -1 or end == -1 or start >= end:
            raise HTTPException(
                status_code=500, detail=f"No se encontró JSON válido en la respuesta. Contenido recibido: {clean_json[:400]}"
            )

        json_str = clean_json[start:end+1]

        # Intentar parsear con json y luego con json5
        try:
            temario_dict = json.loads(json_str)
        except json.JSONDecodeError:
            temario_dict = json5.loads(json_str)

        # Validar estructura con Pydantic
        temario = TopicSchema(**temario_dict)

    except (json.JSONDecodeError, ValidationError) as e:
        raise HTTPException(
            status_code=500, detail=f"Error al procesar JSON: {str(e)} | Contenido: {json_str[:400]}"
        )

    new_topic = save_topic_from_schema(db, temario)

    save_user_topic(
        db,
        current_user.username,
        topic_id=new_topic.topic_code,
        date_goal=req.objetivo
    )

    print("Tema generado:", temario.titulo)

    return temario


# GENERAR TEMARIO - PARTE SUBTEMAS

@router.post("/generar-temario")
async def generar_temario(
    req: TopicFormSchema,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    puntos_list: list[str] = []

    if req.puntos:
        if isinstance(req.puntos, str):
            puntos_list = [p.strip()
                           for p in req.puntos.splitlines() if p.strip()]
        elif isinstance(req.puntos, list):
            puntos_list = req.puntos
        else:
            raise HTTPException(
                status_code=400, detail="Campo 'puntos' debe ser string o lista de strings"
            )

    puntos_str = ""
    if puntos_list:
        puntos_str = "\n- " + "\n- ".join(puntos_list)

    prompt = f"""
    Eres un generador de contenido educativo. 
    Tu tarea es crear un objeto JSON siguiendo **estrictamente** la estructura mostrada a continuación, sin texto adicional fuera del JSON.

    Estructura exacta requerida:
    {{
    "titulo": "string",
    "categoria": "string",
    "descripcion": "string",
    "subtemas": []
    }}

    Reglas importantes:
    - **No** incluyas texto fuera del JSON.
    - Usa las claves exactamente como aparecen.
    - "titulo": debe ser el nombre formal o representativo del tema.
    - "categoria": clasifica el tema en una categoría general (por ejemplo: Ciencia, Historia, Tecnología, Arte, Salud, etc.).
    - "descripcion": redacta una breve descripción de 1 a 2 líneas explicando de qué trata el tema.
    - "subtemas": lista entre 4 y 8 subtemas importantes relacionados, como strings.
    - Tener en cuenta los "puntos" proporcionados en la lista de subtemas.

    Tema: {req.tema}
    Puntos clave a considerar: {puntos_str}
    """

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "z-ai/glm-4.5-air:free",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "clase",
                "schema": {
                    "type": "object",
                    "properties": {
                        "titulo": {"type": "string"},
                        "categoria": {"type": "string"},
                        "descripcion": {"type": "string"},
                        "subtemas": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["titulo", "categoria", "descripcion", "subtemas"]
                }
            }
        },
        "temperature": 0.7
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        # print("Respuesta completa de OpenRouter:", data)

    try:
        raw_message = data["choices"][0]["message"]

        if isinstance(raw_message, dict) and "content" in raw_message:
            raw_json = raw_message["content"]
        elif isinstance(raw_message, str):
            raw_json = raw_message
        else:
            raise HTTPException(
                status_code=500, detail="La respuesta del modelo no contiene contenido JSON válido.")

        # Limpieza
        clean_json = (
            raw_json.replace("“", "\"")
            .replace("”", "\"")
            .replace("‘", "'")
            .replace("’", "'")
            .replace("\n", " ")
            .replace("\r", " ")
        )
        clean_json = re.sub(r"```(?:json)?", "", clean_json).strip()

        start = clean_json.find("{")
        end = clean_json.rfind("}")
        if start == -1 or end == -1 or start >= end:
            raise HTTPException(
                status_code=500, detail=f"No se encontró JSON válido en la respuesta. Contenido recibido: {clean_json[:400]}"
            )

        json_str = clean_json[start:end+1]

        try:
            temario_dict = json.loads(json_str)
        except json.JSONDecodeError:
            temario_dict = json5.loads(json_str)

        temario = TopicSubtopicSchema(**temario_dict)

    except (json.JSONDecodeError, ValidationError) as e:
        raise HTTPException(
            status_code=500, detail=f"Error al procesar JSON: {str(e)} | Contenido: {json_str[:400]}"
        )

    new_topic = save_topic(
        db, temario.titulo, temario.categoria, temario.descripcion)

    save_user_topic(
        db,
        current_user.username,
        topic_id=new_topic.topic_code,
        date_goal=req.objetivo
    )
    info_topic = TopicSubtopicInfoSchema(
        topic_code=new_topic.topic_code, topic_info=temario)

    print("Tema generado:", temario.titulo)
    return info_topic


# Para dar de alta temarios por medio de json (sin asociar a usuario)
@router.post("/generar-nuevo-temario", response_model=TopicSchema)
async def generar_temario_mock(
        topic: TopicSchema,  # <- Aquí recibes directamente el JSON
        db: Session = Depends(get_db)):

    # Validación y guardado
    save_topic_from_schema(db, topic)

    return topic

# Todos los TOPIC


@router.get("/topics", response_model=list[topic_schema.TopicInfoSchema])
def get_all_topics(db: Session = Depends(get_db)):
    topics = db.query(models.Topic).all()
    if not topics:
        raise HTTPException(status_code=404, detail="No topics found")
    return topics


# TOPICS por USUARIO

# GET - Obtener los temarios del usuario
@router.get("/topics-by-user/{username}", response_model=list[topic_schema.UserTopicBasicSchema])
def get_user_topics(username: str, db: Session = Depends(get_db)):
    user_topics = (
        db.query(models.UserTopic)
        .join(models.Topic)
        .filter(models.UserTopic.username == username)
        .all()
    )

    if not user_topics:
        raise HTTPException(
            status_code=404, detail="No topics found for this user")

    return user_topics

# POST - Asociar un temario a un usuario


@router.post("/topics-by-user/{username}/{topic_code}", response_model=topic_schema.UserTopicBasicSchema)
def create_user_topic(
    username: str,
    topic_code: int,
    db: Session = Depends(get_db)
):
    existing_entry = db.query(models.UserTopic).filter_by(
        username=username,
        topic_code=topic_code
    ).first()

    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El usuario '{username}' ya tiene asociado el topic '{topic_code}'"
        )

    new_user_topic = models.UserTopic(
        username=username,
        topic_code=topic_code,
        low_percent=100,
        intermediate_percent=0,
        high_percent=0
    )

    db.add(new_user_topic)
    db.commit()
    db.refresh(new_user_topic)

    return new_user_topic


# DELETE - Eliminar el topic para un usuario.
@router.delete("/topics-by-user/{username}/{topic_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_topic(username: str, topic_code: int, db: Session = Depends(get_db)):
    """
    Elimina un registro de UserTopic (es decir, desvincula un usuario de un topic)
    """
    user_topic = db.query(models.UserTopic).filter_by(
        username=username, topic_code=topic_code).first()

    if not user_topic:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró relación entre el usuario '{username}' y el topic '{topic_code}'"
        )

    db.delete(user_topic)
    db.commit()

    return {"message": f"El topic {topic_code} fue eliminado para el usuario {username}"}


# TEMARIO por TOPIC CODE
@router.get("/topic-detail/{topic_code}", response_model=topic_schema.TopicResponseSchema)
def get_topic_detail(topic_code: int, db: Session = Depends(get_db)):
    topic = (
        db.query(models.Topic)
        .options(
            joinedload(models.Topic.subtopics)
            .joinedload(models.Subtopic.flashcards)
            .joinedload(models.Flashcard.questions)
            .joinedload(models.Question.options)
        )
        .filter(models.Topic.topic_code == topic_code)
        .first()
    )

    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    return topic

#########################################################################
#
# SUBTOPICS
#
#########################################################################

# POST - save subtopic


@router.post("/add/subtopics/{topic_code}", response_model=topic_schema.SubtopicResponseSchema)
def create_subtopic(topic_code: int, subtopic: topic_schema.SubtopicInfoSchema, db: Session = Depends(get_db)):
    db_subtopic = models.Subtopic(
        topic_code=topic_code,
        subtopic_title=subtopic.titulo,
        description=subtopic.descripcion
    )
    db.add(db_subtopic)
    db.commit()
    db.refresh(db_subtopic)
    return db_subtopic


# DELETE - Delete subtopic
@router.delete("/remove/subtopics/{subtopic_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subtopic(subtopic_code: int, db: Session = Depends(get_db)):
    db_subtopic = db.query(models.Subtopic).filter(
        models.Subtopic.subtopic_code == subtopic_code).first()
    if not db_subtopic:
        raise HTTPException(
            status_code=404, detail="Subtopic not found")
    db.delete(db_subtopic)
    db.commit()
    return

# PUT - Update subtopic


@router.put("/update/subtopics/{subtopic_code}", response_model=topic_schema.SubtopicResponseSchema)
def update_subtopic(subtopic_code: int, subtopic: topic_schema.SubtopicInfoSchema, db: Session = Depends(get_db)):
    db_subtopic = db.query(models.Subtopic).filter(
        models.Subtopic.subtopic_code == subtopic_code).first()
    if not db_subtopic:
        raise HTTPException(
            status_code=404, detail="Subtopic not found")
    db_subtopic.subtopic_title = subtopic.titulo
    db_subtopic.description = subtopic.descripcion
    db.commit()
    db.refresh(db_subtopic)
    return db_subtopic


# GENERAR SUBTEMAS
@router.post("/generar-subtemas")
async def generar_subtemas(
    req: TopicSubtopicInfoSchema,
    db: Session = Depends(get_db),
):

    puntos_list: list[str] = []

    if req.puntos:
        if isinstance(req.puntos, str):
            puntos_list = [p.strip()
                           for p in req.puntos.splitlines() if p.strip()]
        elif isinstance(req.puntos, list):
            puntos_list = req.puntos
        else:
            raise HTTPException(
                status_code=400, detail="Campo 'puntos' debe ser string o lista de strings"
            )

    # Convertimos a string para el prompt
    puntos_str = ""
    if puntos_list:
        puntos_str = "\n- " + "\n- ".join(puntos_list)

    prompt = f"""
    Eres un generador de contenido educativo. 
    Tu tarea es crear un objeto JSON siguiendo **estrictamente** la estructura mostrada a continuación, sin texto adicional fuera del JSON.

    Estructura exacta requerida:
    {{
    "titulo": "string",
    "categoria": "string",
    "descripcion": "string",
    "subtemas": []
    }}

    Reglas importantes:
    - **No** incluyas texto fuera del JSON.
    - Usa las claves exactamente como aparecen.
    - "titulo": debe ser el nombre formal o representativo del tema.
    - "categoria": clasifica el tema en una categoría general (por ejemplo: Ciencia, Historia, Tecnología, Arte, Salud, etc.).
    - "descripcion": redacta una breve descripción de 1 a 2 líneas explicando de qué trata el tema.
    - "subtemas": lista entre 4 y 8 subtemas importantes relacionados, como strings.
    - Tener en cuenta los "puntos" proporcionados en la lista de subtemas.

    Tema: {req.tema}
    Puntos clave a considerar: {puntos_str}
    """

    url = "https://openrouter.ai/api/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "z-ai/glm-4.5-air:free",
        "messages": [{"role": "user", "content": prompt}],
        "response_format": {
            "type": "json_schema",
            "json_schema": {
                "name": "clase",
                "schema": {
                    "type": "object",
                    "properties": {
                        "titulo": {"type": "string"},
                        "categoria": {"type": "string"},
                        "descripcion": {"type": "string"},
                        "subtemas": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["titulo", "categoria", "descripcion", "subtemas"]
                }
            }
        },
        "temperature": 0.7
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        print("Respuesta completa de OpenRouter:", data)

    try:
        raw_message = data["choices"][0]["message"]

        if isinstance(raw_message, dict) and "content" in raw_message:
            raw_json = raw_message["content"]
        elif isinstance(raw_message, str):
            raw_json = raw_message
        else:
            raise HTTPException(
                status_code=500, detail="La respuesta del modelo no contiene contenido JSON válido.")

        # Limpieza
        clean_json = (
            raw_json.replace("“", "\"")
            .replace("”", "\"")
            .replace("‘", "'")
            .replace("’", "'")
            .replace("\n", " ")
            .replace("\r", " ")
        )
        clean_json = re.sub(r"```(?:json)?", "", clean_json).strip()

        start = clean_json.find("{")
        end = clean_json.rfind("}")
        if start == -1 or end == -1 or start >= end:
            raise HTTPException(
                status_code=500, detail=f"No se encontró JSON válido en la respuesta. Contenido recibido: {clean_json[:400]}"
            )

        json_str = clean_json[start:end+1]

        try:
            temario_dict = json.loads(json_str)
        except json.JSONDecodeError:
            temario_dict = json5.loads(json_str)

        temario = TopicSubtopicSchema(**temario_dict)

    except (json.JSONDecodeError, ValidationError) as e:
        raise HTTPException(
            status_code=500, detail=f"Error al procesar JSON: {str(e)} | Contenido: {json_str[:400]}"
        )

    new_topic = save_topic(
        db, temario.titulo, temario.categoria, temario.descripcion)

    save_user_topic(
        db,
        current_user.username,
        topic_id=new_topic.topic_code,
        date_goal=req.objetivo
    )

    print("Tema generado:", temario.titulo)

    return temario


#########################################################################
#
# FLASCHCARDS
#
#########################################################################

# POST - save flashcard
@router.post("/add/flashcards/", response_model=topic_schema.FlashcardResponseSchema)
def create_flashcard(flashcard: topic_schema.FlashcardInfoSchema, db: Session = Depends(get_db)):
    db_flashcard = models.Flashcard(
        subtopic_code=flashcard.subtopic_code,
        sentence=flashcard.titulo,
        explanation=flashcard.explicacion
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

# DELETE - Delete flashcard


@router.delete("/remove/flashcards/{flashcard_code}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(flashcard_code: int, db: Session = Depends(get_db)):
    db_flashcard = db.query(models.Flashcard).filter(
        models.Flashcard.flashcard_code == flashcard_code).first()
    if not db_flashcard:
        raise HTTPException(
            status_code=404, detail="Flashcard not found")
    db.delete(db_flashcard)
    db.commit()
    return

# PUT - Update flashcard


@router.put("/update/flashcards/{flashcard_code}", response_model=topic_schema.FlashcardResponseSchema)
def update_flashcard(flashcard_code: int, flashcard: topic_schema.FlashcardSchema, db: Session = Depends(get_db)):
    db_flashcard = db.query(models.Flashcard).filter(
        models.Flashcard.flashcard_code == flashcard_code).first()
    if not db_flashcard:
        raise HTTPException(
            status_code=404, detail="Flashcard not found")
    db_flashcard.sentence = flashcard.titulo
    db_flashcard.explanation = flashcard.explicacion
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard
