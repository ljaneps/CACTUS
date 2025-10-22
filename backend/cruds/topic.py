# backend/cruds/topics.py

##########################################################################
#                            CRUD - TOPICS                               #
##########################################################################

from sqlalchemy.orm import Session
from backend import models
from backend.schemas.topic import TopicSchema
from datetime import date, datetime


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

#schema
# class TopicBasicSchema(BaseModel):
#     titulo: str
#     categoria: str
#     descripcion: str

#Model
# class Topic(Base):
#     __tablename__ = "topics"

#     topic_code = Column(Integer, primary_key=True,
#                         index=True, autoincrement=True)
#     topic_title = Column(String, nullable=False)
#     category = Column(String, nullable=False)
#     description = Column(String)

def save_topic(db: Session, titulo: str, categoria: str, descripcion: str = None):
    topic_db = models.Topic(
        topic_title=titulo,
        category=categoria,
        description=descripcion,
    )
    db.add(topic_db)
    db.commit()
    db.refresh(topic_db)
    return topic_db

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


