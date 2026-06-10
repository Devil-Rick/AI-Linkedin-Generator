from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.post_request import PostRequest
from services.llm_service import LLMService
from services.nlp_service import analyze_text
from services.prompt_service import PromptService
from services.score_service import ScoreService


app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins= origins, 
    allow_credentials = True,
    allow_methods=['*'],
    allow_headers=['*']
)

# health check to see backend is running fine
@app.get('/')
def home():
    return {
        'message' : 'Backend is running'
    }
    


@app.post('/generate-post')
def generate_post_gemini(data: PostRequest):
    # data processing NLP layer
    nlp_data = analyze_text(data.learning_text)
    
    # generate prompt
    prompt = PromptService.build_prompt(data.learning_text, data.style, data.audience, nlp_data)
    
    # generate result
    post = LLMService.generate_gemini(prompt)
    
    # generate score
    print(ScoreService.score_post(post))
    
    return {post}    

