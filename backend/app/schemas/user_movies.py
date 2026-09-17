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