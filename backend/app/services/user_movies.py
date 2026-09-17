from bson import ObjectId

from app.database import user_movies_collection


def get_movie_state(user_id: str, tmdb_id: str):
    return user_movies_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
        }
    )


def upsert_movie_state(
    user_id: str,
    tmdb_id: str,
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

        if "favorite" in update.model_fields_set:
            updates["favorite"] = update.favorite

        if "watched" in update.model_fields_set:
            updates["watched"] = update.watched

        if "rating" in update.model_fields_set:
            updates["rating"] = update.rating
        
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


def delete_movie_state(user_id: str, tmdb_id: str):
    result = user_movies_collection.delete_one(
        {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
        }
    )

    return result.deleted_count > 0