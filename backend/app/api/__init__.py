from fastapi import APIRouter
from app.api.v1.endpoints import ping

router = APIRouter()

# Mount v1 routes
router.include_router(ping.router, prefix="/api/v1", tags=["health"])
