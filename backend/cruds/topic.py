# backend/cruds/topics.py

##########################################################################
#                            CRUD - TOPICS                               #
##########################################################################

from sqlalchemy.orm import Session
from backend import models
from backend.schemas.topic import TopicSchema


def save_topic_from_schema(db: Session, topic_schema: TopicSchema):
    topic_db = models.Topic(
        topic_title=topic_schema.titulo,
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
                        letter=opt.letra,            
                        option=opt.texto,            
                        explanation=opt.explicacion, 
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
