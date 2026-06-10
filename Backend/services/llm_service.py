import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

class LLMService:
    
    gemini_client = genai.Client(api_key=os.getenv('Gemini_API_Key'))
    
    @staticmethod
    def generate_gemini(prompt: str) -> str:
        
        response = LLMService.gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        return response.text
    
    # upgrade to Cluade and gpt left
    
    