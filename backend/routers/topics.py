# backend/routers/topics.py

##########################################################################
#                          ROUTER - TOPICS                               #
##########################################################################

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from backend.database import SessionLocal
from backend.schemas .topic import *
from backend.schemas import topic as topic_schema
from backend.schemas import user as user_schema
from backend.cruds.topic import *
from backend.routers.users import get_current_user
import backend.models as models


import openai
from openai import OpenAI

router = APIRouter(prefix="/topics", tags=["Topics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


client = OpenAI(api_key="TU_API_KEY")


class TemaRequest(BaseModel):
    tema: str


@router.post("/generar-temario")
async def generar_temario(req: TemaRequest):
    prompt = f"""
    Genera un temario en formato JSON con título, descripción, subtemas con flashcards y preguntas.
    Clasifica cada pregunta por dificultad (fácil, medio, difícil).
    Tema: {req.tema}
    """

    # Ejemplo con OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-5",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    raw_json = response.choices[0].message["content"]

    # Validar con Pydantic
    temario = TopicSchema.parse_raw(raw_json)

    return temario


@router.post("/generar-temario-mock", response_model=TopicSchema)
async def generar_temario_mock(
    topic_form: TopicFormSchema,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    mock_data = {
        "titulo": "Biología Celular",
        "categoria": "Ciencia",
        "descripcion": "La biología celular estudia la estructura, función y procesos de las células, que son la unidad básica de la vida.",
        "subtemas": [
            {
                "titulo": "Estructura de la célula",
                "descripcion": "Componentes principales de la célula y sus funciones.",
                "flashcards": [
                    {
                        "titulo": "La membrana plasmática",
                        "explicacion": "Estructura semipermeable que regula el paso de sustancias hacia dentro y fuera de la célula.",
                        "preguntas": [
                            {
                                "enunciado": "¿Cuál es la función principal de la membrana plasmática?",
                                "opciones": [
                                    {"letter": "A", "option": "Almacenar energía",
                                        "explanation": ""},
                                    {"letter": "B", "option": "Regular el intercambio de sustancias",
                                        "explanation": "La membrana regula..."},
                                    {"letter": "C", "option": "Controlar la división celular",
                                        "explanation": ""},
                                    {"letter": "D", "option": "Sintetizar proteínas",
                                        "explanation": ""}
                                ],
                                "respuesta_correcta": "B",
                            },
                            {
                                "enunciado": "¿De qué está compuesta principalmente la membrana plasmática?",
                                "opciones": [
                                    {"letter": "A", "option": "Colágeno",
                                        "explanation": ""},
                                    {"letter": "B", "option": "Fosfolípidos y proteínas",
                                        "explanation": "La bicapa lipídica..."},
                                    {"letter": "C", "option": "Ácidos nucleicos",
                                        "explanation": ""},
                                    {"letter": "D", "option": "Glucosa",
                                        "explanation": ""}
                                ],
                                "respuesta_correcta": "B",
                            }
                        ]
                    },
                    {
                        "titulo": "El núcleo",
                        "explicacion": "El núcleo contiene el material genético y regula la expresión de los genes.",
                        "preguntas": [
                            {
                                "dificultad": "difícil",
                                "enunciado": "¿Qué estructura dentro del núcleo sintetiza los ribosomas?",
                                "opciones": [
                                    {"letter": "A", "option": "Nucleolo",
                                        "explanation": "El nucleolo es la región especializada en la síntesis de ARN ribosomal y ensamblaje inicial de ribosomas."},
                                    {"letter": "B", "option": "Cromatina",
                                        "explanation": ""},
                                    {"letter": "C", "option": "Retículo endoplasmático",
                                        "explanation": ""},
                                    {"letter": "D", "option": "Aparato de Golgi",
                                        "explanation": ""}
                                ],
                                "respuesta_correcta": "A",
                            }
                        ]
                    }
                ]
            },
            {
                "titulo": "Metabolismo celular",
                "descripcion": "Procesos químicos que permiten a la célula obtener y usar energía.",
                "flashcards": [
                    {
                        "titulo": "Respiración celular",
                        "explicacion": "Proceso mediante el cual la célula transforma la glucosa en ATP.",
                        "preguntas": [
                            {
                                "enunciado": "¿Cuál es la molécula principal que produce energía en la célula?",
                                "opciones": [
                                    {"letter": "A", "option": "ADN",
                                        "explanation": ""},
                                    {"letter": "B", "option": "ATP",
                                        "explanation": "El ATP es la moneda energética de la célula, producida principalmente en la mitocondria."},
                                    {"letter": "C", "option": "ARN",
                                        "explanation": ""},
                                    {"letter": "D", "option": "Glucógeno",
                                        "explanation": ""}
                                ],
                                "respuesta_correcta": "B",
                            },
                            {
                                "enunciado": "¿En qué orgánulo ocurre la mayor parte de la respiración celular?",
                                "opciones": [
                                    {"letter": "A", "option": "Cloroplasto",
                                        "explanation": ""},
                                    {"letter": "B", "option": "Mitocondria",
                                        "explanation": "Las mitocondrias son las centrales energéticas de la célula, donde se produce ATP a través de la respiración celular."},
                                    {"letter": "C", "option": "Núcleo",
                                        "explanation": ""},
                                    {"letter": "D", "option": "Lisosoma",
                                        "explanation": ""}
                                ],
                                "respuesta_correcta": "B",
                            }
                        ]
                    }
                ]
            }
        ]
    }
    topic_schema = TopicSchema(**mock_data)

    new_tocip = save_topic_from_schema(db, topic_schema)

    save_user_topic(db, current_user.username, topic_id=new_tocip.topic_code,
                    date_goal=topic_form.objetivo)

    print("Current user:", current_user.username)
    print("Topic to save:", topic_form.tema)
    print("Topic date:", topic_form.objetivo)

    return topic_schema


# Todos los TOPIC
@router.get("/topics", response_model=list[topic_schema.TopicInfoSchema])
def get_all_topics(db: Session = Depends(get_db)):
    topics = db.query(models.Topic).all()
    if not topics:
        raise HTTPException(status_code=404, detail="No topics found")
    return topics   


#################################
#      TOPICS por USUARIO       #
#################################

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

#################################
#    TEMARIO por TOPIC CODE     #
#################################


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


