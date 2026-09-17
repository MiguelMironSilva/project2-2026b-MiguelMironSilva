from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import movies, auth, user_movies
from app.database import client
from datetime import datetime
from app.database import db


app = FastAPI(
    title="Webapp Filmes API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies.router)
app.include_router(auth.router)
app.include_router(user_movies.router)


@app.get("/")
def root():
    return {
        "message": "API Webapp Filmes está rodando"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }

@app.get("/health/db")
def database_health():
    try:
        client.admin.command("ping")
        return {
            "status": "ok",
            "database": "connected",
        }
    except Exception as exc:
        return {
            "status": "error",
            "database": "unavailable",
            "detail": str(exc),
        }

#@app.post("/test-db")
#def test_database():
#    document = {
#        "message": "MongoDB está funcionando!",
#        "created_at": datetime.utcnow(),
#    }

#    result = db.test.insert_one(document)

#    return {
#        "status": "ok",
#        "inserted_id": str(result.inserted_id),
#    }

#@app.get("/test-db")
#def read_database():
#    document = db.test.find_one(
#        sort=[("created_at", -1)]
#    )

#    if document is None:
#        return {
#            "status": "empty"
#        }

#    document["_id"] = str(document["_id"])

#    return document

