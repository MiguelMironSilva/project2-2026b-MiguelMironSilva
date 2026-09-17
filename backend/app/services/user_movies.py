from bson import ObjectId
from app.database import user_movies_collection


def get_movie_state(user_id: str, tmdb_id: str):
    return user_movies_collection.find_one(
        {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
        }
    )


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


def update_movie_state(
    user_id: str,
    tmdb_id: str,
    updates: dict,
):
    existing = get_movie_state(user_id, tmdb_id)

    if existing is None:
        document = {
            "user_id": ObjectId(user_id),
            "tmdb_id": tmdb_id,
            "favorite": updates.get("favorite", False),
            "watched": updates.get("watched", False),
            "rating": updates.get("rating"),
        }

        user_movies_collection.insert_one(document)

    else:
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