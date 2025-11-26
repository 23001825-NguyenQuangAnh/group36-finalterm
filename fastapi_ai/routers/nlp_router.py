# routers/nlp_router.py
from fastapi import APIRouter
from schemas.nlp_schema import NLPRequest, NLPResponse
from services import nlp_service

router = APIRouter(
    prefix="/nlp",
    tags=["NLP"],
)


@router.post("/analyze", response_model=NLPResponse)
def analyze(request: NLPRequest):
    result = nlp_service.analyze_task(
        title=request.title,
        description=request.description,
    )
    return result
