# backend/routers/topics.py

##########################################################################
#                          ROUTER - TOPICS                               #
##########################################################################
import os
import re
import json
import httpx
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
# GENERAR TEMARIO COMPLETO
#########################################################################


@router.post("/generar-temario")
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

#########################################################################
# GENERAR TEMARIO - PARTE SUBTEMAS
#########################################################################


@router.post("/generar-subtemas")
async def generar_temario(
    req: TopicFormSchema,
):
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
    - "descripcion": redacta una breve descripción de 2 a 3 líneas explicando de qué trata el tema.
    - "subtemas": lista entre 4 y 8 subtemas importantes relacionados, como strings.
    - Si el tema lo requiere, incluye una categoría relevante.

    Tema: {req.tema}
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
        print("🔍 Respuesta completa de OpenRouter:", data)

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

        # ✅ Extrae el bloque JSON (primer { hasta último })
        start = clean_json.find("{")
        end = clean_json.rfind("}")
        if start == -1 or end == -1 or start >= end:
            raise HTTPException(
                status_code=500, detail=f"No se encontró JSON válido en la respuesta. Contenido recibido: {clean_json[:400]}"
            )

        json_str = clean_json[start:end+1]

        # ✅ Intentar parsear con json y luego con json5
        try:
            temario_dict = json.loads(json_str)
        except json.JSONDecodeError:
            temario_dict = json5.loads(json_str)

        # ✅ Validar estructura con Pydantic
        temario = TopicSubtopicSchema(**temario_dict)

    except (json.JSONDecodeError, ValidationError) as e:
        raise HTTPException(
            status_code=500, detail=f"Error al procesar JSON: {str(e)} | Contenido: {json_str[:400]}"
        )

    print("✅ Tema generado:", temario.titulo)

    return temario


#########################################################################
# MOCKS TOPIC
#########################################################################


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


# Solo TOPICS

@router.post("/generar-temario-mocks", response_model=TopicSchema)
async def generar_temario_mock(
        db: Session = Depends(get_db)):

    mock_data = {
        "titulo": "La Primera Guerra Mundial",
        "categoria": "Historia Universal",
        "descripcion": "Estudio detallado de las causas, desarrollo, consecuencias y protagonistas de la Primera Guerra Mundial (1914-1918).",
        "subtemas": [
            {
                "titulo": "Causas de la Primera Guerra Mundial",
                "descripcion": "Análisis de los factores políticos, económicos y sociales que condujeron al estallido del conflicto.",
                "flashcards": [
                    {
                        "titulo": "Sistema de alianzas",
                        "explicacion": "El sistema de alianzas dividió a Europa en dos bloques enfrentados, aumentando las tensiones internacionales.",
                        "preguntas": [
                            {
                                "enunciado": "¿Qué países formaban parte de la Triple Entente?",
                                "opciones": [
                                    {"letter": "A", "option": "Francia, Rusia y Reino Unido",
                                     "explanation": "Correcto. Estos países formaban la Triple Entente, opuesta a la Triple Alianza."},
                                    {"letter": "B", "option": "Alemania, Austria-Hungría e Italia",
                                     "explanation": ""},
                                    {"letter": "C", "option": "Alemania, Rusia y Francia",
                                     "explanation": ""},
                                    {"letter": "D", "option": "Italia, Reino Unido y Austria-Hungría",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            },
                            {
                                "enunciado": "¿Qué objetivo tenía el sistema de alianzas?",
                                "opciones": [
                                    {"letter": "A", "option": "Mantener el equilibrio de poder en Europa",
                                     "explanation": "Correcto. Su intención inicial era prevenir conflictos al crear un equilibrio entre potencias."},
                                    {"letter": "B", "option": "Unificar Europa bajo un solo gobierno",
                                     "explanation": ""},
                                    {"letter": "C", "option": "Fomentar el comercio internacional",
                                     "explanation": ""},
                                    {"letter": "D", "option": "Evitar la expansión colonial",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            }
                        ]
                    },
                    {
                        "titulo": "Nacionalismo",
                        "explicacion": "El nacionalismo exacerbado fomentó rivalidades y deseos de independencia entre diversos pueblos europeos.",
                        "preguntas": [
                            {
                                "enunciado": "¿Qué región fue un foco de tensiones nacionalistas antes de la guerra?",
                                "opciones": [
                                    {"letter": "A", "option": "Los Balcanes",
                                     "explanation": "Correcto. Los Balcanes eran una zona de gran tensión nacionalista entre imperios y pueblos locales."},
                                    {"letter": "B", "option": "Escandinavia",
                                     "explanation": ""},
                                    {"letter": "C", "option": "África Central",
                                     "explanation": ""},
                                    {"letter": "D", "option": "América del Sur",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            },
                            {
                                "enunciado": "¿Qué sentimiento impulsó a Serbia a apoyar el nacionalismo eslavo?",
                                "opciones": [
                                    {"letter": "A", "option": "El deseo de unificar a los pueblos eslavos del sur",
                                     "explanation": "Correcto. Serbia aspiraba a formar una gran nación eslava que incluyera a Bosnia y otros pueblos."},
                                    {"letter": "B", "option": "El expansionismo colonial",
                                     "explanation": ""},
                                    {"letter": "C", "option": "La alianza con Alemania",
                                     "explanation": ""},
                                    {"letter": "D", "option": "La industrialización",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            }
                        ]
                    },
                    {
                        "titulo": "Imperialismo",
                        "explicacion": "Las potencias europeas competían por territorios coloniales, lo que aumentó las tensiones entre ellas.",
                        "preguntas": [
                            {
                                "enunciado": "¿Qué países rivalizaron especialmente por colonias en África?",
                                "opciones": [
                                    {"letter": "A", "option": "Francia y Alemania",
                                     "explanation": "Correcto. Ambos países tuvieron conflictos coloniales, especialmente en Marruecos."},
                                    {"letter": "B", "option": "Italia y Rusia",
                                     "explanation": ""},
                                    {"letter": "C", "option": "Portugal y Bélgica",
                                     "explanation": ""},
                                    {"letter": "D", "option": "España y Austria-Hungría",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            },
                            {
                                "enunciado": "¿Qué conferencia reguló la colonización de África?",
                                "opciones": [
                                    {"letter": "A", "option": "La Conferencia de Berlín de 1884-1885",
                                     "explanation": "Correcto. Esta conferencia estableció las reglas para la colonización africana."},
                                    {"letter": "B", "option": "El Congreso de Viena",
                                     "explanation": ""},
                                    {"letter": "C", "option": "La Conferencia de París",
                                     "explanation": ""},
                                    {"letter": "D", "option": "El Tratado de Versalles",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            }
                        ]
                    },
                    {
                        "titulo": "Militarismo",
                        "explicacion": "El aumento del gasto militar y la carrera armamentista crearon un clima de desconfianza y preparación para la guerra.",
                        "preguntas": [
                            {
                                "enunciado": "¿Qué país tenía el ejército más grande antes de la guerra?",
                                "opciones": [
                                    {"letter": "A", "option": "Alemania",
                                     "explanation": "Correcto. Alemania poseía uno de los ejércitos más poderosos y organizados del mundo."},
                                    {"letter": "B", "option": "Italia",
                                     "explanation": ""},
                                    {"letter": "C", "option": "España",
                                     "explanation": ""},
                                    {"letter": "D", "option": "Bélgica",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            },
                            {
                                "enunciado": "¿Qué papel tuvo la carrera naval entre Alemania y Reino Unido?",
                                "opciones": [
                                    {"letter": "A", "option": "Aumentó la rivalidad entre ambos países",
                                     "explanation": "Correcto. La competencia naval alimentó la tensión previa al conflicto."},
                                    {"letter": "B", "option": "Reducir los gastos militares",
                                     "explanation": ""},
                                    {"letter": "C", "option": "Evitar conflictos marítimos",
                                     "explanation": ""},
                                    {"letter": "D", "option": "Fortalecer la cooperación internacional",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            }
                        ]
                    },
                    {
                        "titulo": "El asesinato de Sarajevo",
                        "explicacion": "El asesinato del archiduque Francisco Fernando fue el detonante inmediato de la guerra.",
                        "preguntas": [
                            {
                                "enunciado": "¿Quién fue asesinado en Sarajevo en 1914?",
                                "opciones": [
                                    {"letter": "A", "option": "Francisco Fernando de Austria",
                                     "explanation": "Correcto. El heredero al trono austrohúngaro fue asesinado en Sarajevo."},
                                    {"letter": "B", "option": "Guillermo II",
                                     "explanation": ""},
                                    {"letter": "C", "option": "Nicolás II",
                                     "explanation": ""},
                                    {"letter": "D", "option": "Clemenceau",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            },
                            {
                                "enunciado": "¿Qué país fue responsabilizado por el atentado?",
                                "opciones": [
                                    {"letter": "A", "option": "Serbia",
                                     "explanation": "Correcto. Austria-Hungría culpó a Serbia por apoyar a los nacionalistas involucrados en el asesinato."},
                                    {"letter": "B", "option": "Rusia",
                                     "explanation": ""},
                                    {"letter": "C", "option": "Italia",
                                     "explanation": ""},
                                    {"letter": "D", "option": "Francia",
                                     "explanation": ""}
                                ],
                                "respuesta_correcta": "A"
                            }
                        ]
                    }
                ]
            }
        ]
    }

    topic_schema = TopicSchema(**mock_data)

    save_topic_from_schema(db, topic_schema)

    return topic_schema


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


#################################
#      TOPICS por USUARIO       #
#################################

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

#################################
#       CRUD Flashcard          #
#################################

# POST - save flashcard


@router.post("/flashcards/", response_model=topic_schema.FlashcardResponseSchema)
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


@router.delete("/flashcards/{flashcard_code}", status_code=status.HTTP_204_NO_CONTENT)
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


@router.put("/flashcards/{flashcard_code}", response_model=topic_schema.FlashcardResponseSchema)
def update_flashcard(flashcard_code: int, flashcard: topic_schema.FlashcardInfoSchema, db: Session = Depends(get_db)):
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
