from fastapi import APIRouter

router = APIRouter()


@router.get(
    "/ping", summary="Healthcheck", description="Returns pong if the server is alive"
)
async def ping():
    return {"message": "pong"}
