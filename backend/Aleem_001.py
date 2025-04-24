from fastapi import FastAPI
from pydantic import BaseModel
from Aleem_002 import run_agent
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Define the input data model
class ChatInput(BaseModel):
    query: str
    session_id: str

# Define the POST route
@app.post("/chat")
def chat(payload: ChatInput):
    response = run_agent(payload.query, payload.session_id)
    return {"response": response}
