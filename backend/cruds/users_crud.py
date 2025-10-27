# backend/cruds/usercrud.py

##########################################################################
#                            CRUD - USER                               #
##########################################################################

from sqlalchemy.orm import Session
from backend import models
from backend.schemas.topic import *
from datetime import date


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
