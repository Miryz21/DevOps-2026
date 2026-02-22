import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import user_router, area_router, task_router, note_router, search_router

app = FastAPI()

API_PREFIX = "/api/v1"

# Include routers
app.include_router(user_router, prefix=API_PREFIX)
app.include_router(area_router, prefix=API_PREFIX)
app.include_router(task_router, prefix=API_PREFIX)
app.include_router(note_router, prefix=API_PREFIX)
app.include_router(search_router, prefix=API_PREFIX)


origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5555, log_level="info")
