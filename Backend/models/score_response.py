from pydantic import BaseModel
from typing import List

class ScoreMetric(BaseModel):
    score :int
    reason : str
    
class ScoreResponse(BaseModel):
    overall_score : float
    hook : ScoreMetric
    engagement : ScoreMetric
    readability : ScoreMetric
    professionalism : ScoreMetric
    improvement : List[str]     

    