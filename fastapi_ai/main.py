from fastapi import FastAPI
from routers import ai_router

app = FastAPI(
    title="AI Task Analysis Service",
    description="Phân tích mô tả nhiệm vụ cá nhân bằng AI/NLP",
    version="1.0.0"
)

app.include_router(ai_router.router)

@app.get("/")
def root():
    return {"message": "AI module is running 🚀"}
