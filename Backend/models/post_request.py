from pydantic import BaseModel

class PostRequest(BaseModel):
    learning_text :str
    style : str
    audience : str
