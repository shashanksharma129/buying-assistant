from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List
from pathlib import Path
from dotenv import load_dotenv
import os
import sys
import uuid
import uvicorn


# Add src to path to import agent
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from agent.agent import runner, session_service
from google.genai.types import Content, Part

load_dotenv()

app = FastAPI(title="Buying Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    cards: Optional[List[str]] = None
    session_id: Optional[str] = None  # For persistent chat

class ChatResponse(BaseModel):
    response: str
    session_id: str  # Return session_id for next message

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    context_str = ""
    if request.cards:
        context_str = f"\nUser Context (Cards): {', '.join(request.cards)}"
    
    user_input = f"{request.message}{context_str}"
    
    try:
        # Use ADK Runner to execute the agent
        user_id = "default_user"
        # Use provided session_id or create new one for persistent chat
        session_id = request.session_id or str(uuid.uuid4())
        
        # Create session if it doesn't exist
        try:
            await session_service.create_session(
                app_name="buying_assistant",
                user_id=user_id,
                session_id=session_id
            )
        except Exception:
            # Session might already exist, that's okay
            pass
        
        # Create proper Content object for ADK
        message_content = Content(role='user', parts=[Part(text=user_input)])
        
        # Collect all events from the async generator
        response_text = ""
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=message_content
        ):
            # Extract text from events using the ADK pattern
            text = extract_text_from_event(event)
            if text:
                response_text += text
        
        return ChatResponse(
            response=response_text if response_text else "No response generated",
            session_id=session_id
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return ChatResponse(
            response=f"Error communicating with agent: {str(e)}",
            session_id=request.session_id or str(uuid.uuid4())
        )

def extract_text_from_event(ev) -> str | None:
    """Pull user-facing text from ADK event shapes."""
    try:
        content = getattr(ev, "content", None)
        if content is not None:
            parts = getattr(content, "parts", None) or []
            if parts:
                first = parts[0]
                txt = getattr(first, "text", None) or getattr(first, "content", None)
                if txt:
                    return txt
            txt = getattr(content, "text", None)
            if txt:
                return txt
    except Exception:
        pass

    for attr in ("delta", "message", "output_text", "text", "response", "result"):
        try:
            value = getattr(ev, attr, None)
            if isinstance(value, str) and value.strip():
                return value
            if value is not None and hasattr(value, "text"):
                text_value = getattr(value, "text", None)
                if text_value:
                    return text_value
        except Exception:
            continue

    return None

# Serve index.html at root
@app.get("/")
async def read_root():
    static_files_dir = Path(__file__).parent.parent / "web"
    index_path = static_files_dir / "index.html"
    return FileResponse(index_path)

# Serve static files (CSS, JS, etc.) from root
static_files_dir = Path(__file__).parent.parent / "web"
app.mount("/", StaticFiles(directory=static_files_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
