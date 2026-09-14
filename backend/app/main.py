from fastapi import FastAPI

app = FastAPI(
    title="Movie Library API",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "Movie Library API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }
