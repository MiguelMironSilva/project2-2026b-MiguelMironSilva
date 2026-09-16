from datetime import datetime, timedelta, timezone
import jwt
from pymongo.errors import DuplicateKeyError
from pwdlib import PasswordHash
from app.config import settings
from app.database import users_collection


password_hash = PasswordHash.recommended()


def create_user(username: str, email: str, password: str) -> dict:
    username = username.strip()
    email = email.strip().lower()

    document = {
        "username": username,
        "email": email,
        "password_hash": password_hash.hash(password),
        "created_at": datetime.now(timezone.utc),
    }

    try:
        result = users_collection.insert_one(document)
    except DuplicateKeyError as exc:
        raise ValueError("Nome de usuário ou e-mail já existe") from exc

    return {
        "id": str(result.inserted_id),
        "username": username,
        "email": email,
    }


def authenticate_user(identifier: str, password: str):
    identifier = identifier.strip()

    user = users_collection.find_one(
        {
            "$or": [
                {"username": identifier},
                {"email": identifier.lower()},
            ]
        }
    )

    if user is None:
        return None

    if not password_hash.verify(password, user["password_hash"]):
        return None

    return user


def create_access_token(
    user_id: str,
    expires_minutes: int = 30,
) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes
    )

    payload = {
        "sub": user_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm="HS256",
    )