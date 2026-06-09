from pydantic import BaseModel
from typing import List

class ScoreMetric(BaseModel):
    score :str
    reason : str
    
class ScoreResponse(BaseModel):
    overall_score : float
    hook : ScoreMetric
    engagment : ScoreMetric
    readability : ScoreMetric
    profesionalism : ScoreMetric
    improvements : List[str]     

    