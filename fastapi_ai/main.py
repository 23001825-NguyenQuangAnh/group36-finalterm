from fastapi import FastAPI
from routers import priority_router
from fastapi.middleware.cors import CORSMiddleware
from routers import assistant_router

app = FastAPI(
    title="AI Task Analysis Service",
    description="Phân tích mô tả nhiệm vụ cá nhân bằng AI/NLP",
    version="1.0.0"
)

# ⭐ THÊM CORS ĐỂ CHO PHÉP OPTIONS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # hoặc ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],   # QUAN TRỌNG: Cho phép OPTIONS
    allow_headers=["*"],
)

app.include_router(priority_router.router)
app.include_router(assistant_router.router,  prefix="/ai")

@app.get("/")
def root():
    return {"message": "AI module is running 🚀"}