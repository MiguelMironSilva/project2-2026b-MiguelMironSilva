from bson import ObjectId

from app.database import user_movies_collection


def get_movie_state(user_id: str, tmdb_id: int):
    return user_movies_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
        }
    )


def upsert_movie_state(
    user_id: str,
    tmdb_id: int,
    favorite: bool | None = None,
    watched: bool | None = None,
    rating: int | None = None,
):
    existing = get_movie_state(user_id, tmdb_id)

    if existing is None:
        document = {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
            "favorite": favorite if favorite is not None else False,
            "watched": watched if watched is not None else False,
            "rating": rating,
        }

        user_movies_collection.insert_one(document)

    else:
        updates = {}

        if favorite is not None:
            updates["favorite"] = favorite

        if watched is not None:
            updates["watched"] = watched

        if rating is not None:
            updates["rating"] = rating

        if updates:
            user_movies_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": updates},
            )

    document = get_movie_state(user_id, tmdb_id)

    return {
        "tmdb_id": document["tmdb_id"],
        "favorite": document["favorite"],
        "watched": document["watched"],
        "rating": document.get("rating"),
    }


def delete_movie_state(user_id: str, tmdb_id: int):
    result = user_movies_collection.delete_one(
        {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
        }
    )

    return result.deleted_count > 0