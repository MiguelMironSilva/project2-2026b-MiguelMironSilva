from typing import Optional

from pydantic import BaseModel, Field


class MovieStateUpdate(BaseModel):
    favorite: Optional[bool] = None
    watched: Optional[bool] = None
    rating: Optional[int] = Field(
        default=None,
        ge=0,
        le=10,
    )


class MovieStateResponse(BaseModel):
    tmdb_id: str
    favorite: bool
    watched: bool
    rating: Optional[int] = None

def get_all_movie_states(user_id: str):
    documents = user_movies_collection.find(
        {"user_id": ObjectId(user_id)}
    )

    return [
        {
            "tmdb_id": document["tmdb_id"],
            "favorite": document["favorite"],
            "watched": document["watched"],
            "rating": document.get("rating"),
        }
        for document in documents
    ]