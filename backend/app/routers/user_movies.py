from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.auth import get_current_user
from app.schemas.user_movies import (
    MovieStateResponse,
    MovieStateUpdate,
)
from app.services.user_movies import (
    delete_movie_state,
    get_movie_state,
    upsert_movie_state,
)


router = APIRouter(
    prefix="/api/my-movies",
    tags=["my-movies"],
)


@router.get(
    "/{tmdb_id}",
    response_model=MovieStateResponse,
)
def get_my_movie_state(
    tmdb_id: int,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    document = get_movie_state(
        str(current_user["_id"]),
        tmdb_id,
    )

    if document is None:
        return {
            "tmdb_id": tmdb_id,
            "favorite": False,
            "watched": False,
            "rating": None,
        }

    return {
        "tmdb_id": document["tmdb_id"],
        "favorite": document["favorite"],
        "watched": document["watched"],
        "rating": document.get("rating"),
    }


@router.patch(
    "/{tmdb_id}",
    response_model=MovieStateResponse,
)
def update_my_movie_state(
    tmdb_id: int,
    update: MovieStateUpdate,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    if (
        update.favorite is None
        and update.watched is None
        and update.rating is None
    ):
        raise HTTPException(
            status_code=400,
            detail="Por favor, digite algo",
        )

    return upsert_movie_state(
        user_id=str(current_user["_id"]),
        tmdb_id=tmdb_id,
        favorite=update.favorite,
        watched=update.watched,
        rating=update.rating,
    )


@router.delete(
    "/{tmdb_id}",
)
def delete_my_movie_state(
    tmdb_id: int,
    current_user: Annotated[dict, Depends(get_current_user)],
):
    deleted = delete_movie_state(
        str(current_user["_id"]),
        tmdb_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Estado do filme não encontrado",
        )

    return {
        "status": "ok",
    }