from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini with API Key
genai.configure(api_key=GEMINI_API_KEY)

# Initialize app
app = FastAPI()

# Allow frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body structure
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    question = req.question.strip()

    print(f"\n🟡 Question received: {question}")

    if not question:
        return {"error": "Question is empty."}

    try:
        # Use a compatible model
        model = genai.GenerativeModel("gemini-1.5-flash-latest")

        # Send prompt
        response = model.generate_content(question)
        reply = response.text.strip()

        print(f"🔵 Gemini response: {reply}")
        return {"response": reply}

    except Exception as e:
        print(f"🔴 Error: {str(e)}")
        return {"error": str(e)}
