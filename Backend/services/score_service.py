import json 

from models.score_response import ScoreResponse
from services.gemini_service import generate_post

class ScoreService:
    
    @staticmethod
    def build_score_prompt(post : str) -> str:
        return f"""
            You are an expert LinkedIN content reviewer
            Your task is to evaluate the post below 
            
            Evaluation criteria :
            
            1. Hook Strength
            2. engagment Potential 
            3. Readability 
            4. Professionalism
            
            Score each category 1 - 10 
            Provide concise reasoning
            
            Return only valid JSON.
            
            JSON Format:{{
                overall_score: 8.5,
            hook: {{
                'score': 8,
                "reason": 'Reason for the score'
            }},
            
            engagement: {{
                'score': 8,
                "reason": 'Reason for the score'
            }},
            
            readability: {{
                'score': 8,
                "reason": 'Reason for the score'
            }},
            
            professionalism: {{
                'score': 8,
                "reason": 'Reason for the score'
            }},
            
            improvement:[
                "list of all improvement",
                "if any pointers to highlight"
            ]                
            }}
            
            POST : {post}
        """
        
    
    @staticmethod
    def score_post(post: str) -> ScoreResponse:
        prompt = ScoreService.build_score_prompt(post)
        
        response = generate_post(prompt)
        
        cleaned_response = (
            response.replace("```json", "")
            .replace("```", "").strip()
        )
    
        data = json.loads(cleaned_response)
        
        return ScoreResponse(**data)
    