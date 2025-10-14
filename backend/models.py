# app/models/user.py
from sqlalchemy import Column, String, Integer, Boolean, Date, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

##########################################################################
#                                  USERS                                 #
##########################################################################

class User(Base):
    __tablename__ = "users"
    
    username = Column(String, primary_key=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False) 

    topics = relationship("UserTopic", back_populates="user")
    flashcards = relationship("UserFlashcard", back_populates="user")
    questions = relationship("UserQuestion", back_populates="user")

##########################################################################
#                                 TOPICS                                 #
##########################################################################

class Topic(Base):
    __tablename__ = "topics"

    topic_code = Column(Integer, primary_key=True,index=True, autoincrement=True)
    topic_title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(String)

    subtopics = relationship(
        "Subtopic", back_populates="topic", cascade="all, delete-orphan")
    users = relationship("UserTopic", back_populates="topic",
                         cascade="all, delete-orphan")

##########################################################################
#                              SUBTOPICS                                 #
##########################################################################

class Subtopic(Base):
    __tablename__ = "subtopics"

    subtopic_code = Column(Integer, primary_key=True,index=True, autoincrement=True)
    topic_code = Column(Integer, ForeignKey("topics.topic_code"), nullable=False)
    subtopic_title = Column(String, nullable=False)
    description = Column(String)

    topic = relationship("Topic", back_populates="subtopics")
    flashcards = relationship("Flashcard", back_populates="subtopic",
                              cascade="all, delete-orphan")

##########################################################################
#                             FLASHCARDS                                 #
##########################################################################

class Flashcard(Base):
    __tablename__ = "flashcards"

    flashcard_code = Column(Integer, primary_key=True,index=True, autoincrement=True)
    subtopic_code = Column(Integer, ForeignKey("subtopics.subtopic_code"), nullable=False)
    sentence = Column(String, nullable=False)
    explanation = Column(String)

    subtopic = relationship("Subtopic", back_populates="flashcards")
    questions = relationship(
        "Question", back_populates="flashcard", cascade="all, delete-orphan")
    users = relationship(
        "UserFlashcard", back_populates="flashcard", cascade="all, delete-orphan")

##########################################################################
#                               QUESTIONS                                #
##########################################################################


class Question(Base):
    __tablename__ = "questions"

    question_code = Column(Integer, primary_key=True, index=True, autoincrement=True)
    flashcard_code = Column(Integer, ForeignKey("flashcards.flashcard_code"), nullable=False)
    question = Column(String, nullable=False)

    option_correct_letter = Column(String(1), nullable=True)

    flashcard = relationship("Flashcard", back_populates="questions")
    options = relationship("Option", back_populates="question", cascade="all, delete-orphan")
    users = relationship(
        "UserQuestion", back_populates="question", cascade="all, delete-orphan")


##########################################################################
#                                OPTIONS                                 #
##########################################################################

class Option(Base):
    __tablename__ = "options"

    question_code = Column(Integer, ForeignKey(
        "questions.question_code"), nullable=False)
    letter = Column(String(1), nullable=False)
    option = Column(String, nullable=False)
    explanation = Column(String)

    __table_args__ = (
        PrimaryKeyConstraint("question_code", "letter"),
    )

    question = relationship("Question", back_populates="options")

##########################################################################
#                             USER TOPICS                                #
##########################################################################

class UserTopic(Base):
    __tablename__ = "user_topics"

    username = Column(String, ForeignKey("users.username"), primary_key=True)
    topic_code = Column(Integer, ForeignKey("topics.topic_code"), primary_key=True)
    date_ini = Column(Date)
    date_goal = Column(Date)
    low_percent = Column(Integer)
    intermediate_percent = Column(Integer)
    high_percent = Column(Integer)

    user = relationship("User", back_populates="topics")
    topic = relationship("Topic", back_populates="users")

##########################################################################
#                            USER FLASHCARDS                              #
##########################################################################

class UserFlashcard(Base):
    __tablename__ = "user_flashcards"

    username = Column(String, ForeignKey("users.username"), primary_key=True)
    flashcard_code = Column(Integer, ForeignKey("flashcards.flashcard_code"), primary_key=True)
    favourite = Column(Boolean, default=False)

    user = relationship("User", back_populates="flashcards")
    flashcard = relationship("Flashcard", back_populates="users")

##########################################################################
#                           USER QUESTIONS                               #
##########################################################################

class UserQuestion(Base):
    __tablename__ = "user_questions"

    username = Column(String, ForeignKey("users.username"), primary_key=True)
    question_code = Column(Integer, ForeignKey("questions.question_code"), primary_key=True)
    is_low_box = Column(Boolean, default=False)
    is_intermediate_box = Column(Boolean, default=False)
    is_high_box = Column(Boolean, default=False)
    favourite = Column(Boolean, default=False)

    user = relationship("User", back_populates="questions")
    question = relationship("Question", back_populates="users")
