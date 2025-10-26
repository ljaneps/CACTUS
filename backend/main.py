from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import users, topics
from backend.database import Base, engine
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from backend import models

# Importa modelos
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flashcards API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          
    allow_credentials=True,         
    allow_methods=["*"],
    allow_headers=["*"],            
)

app.include_router(users.router)
app.include_router(topics.router)


@app.get("/")
def root():
    return {"🚀 Backend funcionando correctamente"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print("Validation error:", exc.errors())
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()}
    )
