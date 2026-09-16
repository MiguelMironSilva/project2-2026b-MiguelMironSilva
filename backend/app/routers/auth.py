from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    UserCreate,
    UserResponse,
)
from app.services.auth import (
    authenticate_user,
    create_access_token,
    create_user,
)
from typing import Annotated
from fastapi import Depends
from app.auth import get_current_user


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(user: UserCreate):
    try:
        return create_user(
            username=user.username,
            email=user.email,
            password=user.password,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(credentials: LoginRequest):
    user = authenticate_user(
        identifier=credentials.identifier,
        password=credentials.password,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Nome de usuário ou e-mail inválido",
        )

    token = create_access_token(str(user["_id"]))

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_me(
    current_user: Annotated[dict, Depends(get_current_user)]
):
    return {
        "id": str(current_user["_id"]),
        "username": current_user["username"],
        "email": current_user["email"],
    }