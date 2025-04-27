from fastapi import FastAPI
from app.api import router as api_router

app = FastAPI(
    title="Your Project Name",
    version="0.1.0",
)

# Register your API routes
app.include_router(api_router)

# If you want, add startup/shutdown events here too
# @app.on_event("startup")
# async def startup_event():
#     pass

# @app.on_event("shutdown")
# async def shutdown_event():
#     pass
