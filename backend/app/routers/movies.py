from fastapi import APIRouter, HTTPException

from app.services.tmdb import search_movies


router = APIRouter(prefix="/api/movies", tags=["movies"])


@router.get("/search")
def search(query: str):
    if not query.strip():
        raise HTTPException(
            status_code=400,
            detail="Consulta não pode ser vazia",
        )

    try:
        return search_movies(query)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {exc}",
        ) from exc

def movie_details(tmdb_id: int):
    try:
        return get_movie(tmdb_id)
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"TMDB error: {exc}",
        ) from exc