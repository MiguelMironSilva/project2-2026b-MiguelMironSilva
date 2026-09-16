import requests

from app.config import settings


TMDB_BASE_URL = "https://api.themoviedb.org/3"


def search_movies(query: str) -> dict:
    response = requests.get(
        f"{TMDB_BASE_URL}/search/movie",
        params={
            "query": query,
            "api_key": settings.tmdb_api_key,
        },
        timeout=10,
    )

    print("TMDB status:", response.status_code)
    print("TMDB response:", response.text)

    response.raise_for_status()
    return response.json()