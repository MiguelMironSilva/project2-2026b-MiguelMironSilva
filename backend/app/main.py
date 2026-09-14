from fastapi import FastAPI

app = FastAPI(
    title="Webapp Filmes API",
    version="0.1.0",
)


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
