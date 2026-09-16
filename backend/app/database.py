from pymongo import MongoClient, ASCENDING
from pymongo.server_api import ServerApi
from app.config import settings


client = MongoClient(
    settings.mongodb_uri,
    server_api=ServerApi(
        version="1",
        strict=True,
        deprecation_errors=True,
    ),
)

db = client["webapp_filmes"]

users_collection = db["users"]

users_collection.create_index(
    [("username", ASCENDING)],
    unique=True,
)

users_collection.create_index(
    [("email", ASCENDING)],
    unique=True,
)