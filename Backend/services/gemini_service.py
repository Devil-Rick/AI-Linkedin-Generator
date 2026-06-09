import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv('Gemini_API_Key')
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_post(prompt : str):
    
    response = model.generate_content(prompt)
    return response.text

