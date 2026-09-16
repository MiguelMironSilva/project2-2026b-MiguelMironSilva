from typing import Annotated
import jwt
from bson import ObjectId
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError

from app.config import settings
from app.database import users_collection


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=["HS256"],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user = users_collection.find_one(
            {"_id": ObjectId(user_id)}
        )

        if user is None:
            raise credentials_exception

        return user

    except (InvalidTokenError, ValueError):
        raise credentials_exception