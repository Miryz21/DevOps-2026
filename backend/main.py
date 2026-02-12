import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import user_router, area_router, task_router, note_router

app = FastAPI()

# Include routers
app.include_router(user_router, prefix="/api/v1")
app.include_router(area_router, prefix="/api/v1")
app.include_router(task_router, prefix="/api/v1")
app.include_router(note_router, prefix="/api/v1")


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", port=5000, log_level="info")