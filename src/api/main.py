import os
import sys
import uuid
from pathlib import Path

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

# Add src to path to import agent
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from google.genai.types import Content, Part

from agent.agent import runner, session_service  # type: ignore[import-not-found]


load_dotenv()

app = FastAPI(
    title="AI Buying Assistant API",
    description="""
    🤖 AI-powered buying assistant that helps users find the best products based on their preferences and highlights relevant offers for their credit/debit cards.

    ## Features
    - 💳 Card-specific offer recommendations
    - 🛍️ AI-powered product research
    - 💬 Persistent chat sessions
    - ⚡ Real-time streaming responses

    ## Authentication
    This API uses Google Gemini AI. Set your API key in the GOOGLE_API_KEY environment variable.

    ## Rate Limiting
    The API is subject to Google Gemini API rate limits. Free tier has limited requests per minute.
    """,
    version="1.0.0",
    contact={
        "name": "Shashank Sharma",
        "email": "shashanksharma129@gmail.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class ChatRequest(BaseModel):
    """
    Request model for chat endpoint.

    Attributes:
        message: The user's question or request for product recommendations
        cards: Optional list of user's credit/debit cards for offer matching
        session_id: Optional session ID for persistent chat conversations
    """

    message: str = Field(..., description="User's question or request for product recommendations")
    cards: list[str] | None = Field(
        None, description="Optional list of user's credit/debit cards for offer matching"
    )
    session_id: str | None = Field(
        None, description="Optional session ID for persistent chat conversations"
    )


class ChatResponse(BaseModel):
    """
    Response model for chat endpoint.

    Attributes:
        response: AI-generated response with product recommendations
        session_id: Session ID for continuing the conversation
    """

    response: str = Field(
        ..., description="AI-generated response with product recommendations and offers"
    )
    session_id: str = Field(..., description="Session ID for continuing the conversation")


@app.get(
    "/health",
    summary="Health Check",
    description="Simple health check endpoint to verify the API is running",
    tags=["System"],
)
async def health_check():
    """
    Health check endpoint to verify the API is running and responsive.

    Returns:
        dict: Simple status response indicating the service is healthy
    """
    return {"status": "ok"}


@app.post(
    "/api/chat",
    response_model=ChatResponse,
    summary="Chat with AI Buying Assistant",
    description="Send a message to the AI buying assistant to get product recommendations and offers",
    tags=["Chat"],
)
async def chat(request: ChatRequest):
    """
    Chat with the AI buying assistant to get product recommendations.

    This endpoint processes user queries and returns AI-generated product recommendations
    along with relevant offers for their credit/debit cards.

    Args:
        request: ChatRequest containing message, optional cards list, and session_id

    Returns:
        ChatResponse with AI-generated recommendations and session_id for follow-up

    Raises:
        HTTPException: If there's an error communicating with the AI agent

    Example:
        ```json
        {
            "message": "Best laptop for coding under $1000",
            "cards": ["HDFC Regalia", "Amex Platinum"]
        }
        ```
    """
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
                app_name="buying_assistant", user_id=user_id, session_id=session_id
            )
        except Exception:
            # Session might already exist, that's okay
            pass

        # Create proper Content object for ADK
        message_content = Content(role="user", parts=[Part(text=user_input)])

        # Collect all events from the async generator
        response_text = ""
        async for event in runner.run_async(
            user_id=user_id, session_id=session_id, new_message=message_content
        ):
            # Extract text from events using the ADK pattern
            text = extract_text_from_event(event)
            if text:
                response_text += text

        return ChatResponse(
            response=response_text if response_text else "No response generated",
            session_id=session_id,
        )
    except Exception as e:
        import traceback

        traceback.print_exc()
        return ChatResponse(
            response=f"Error communicating with agent: {str(e)}",
            session_id=request.session_id or str(uuid.uuid4()),
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
                if isinstance(txt, str) and txt:
                    return txt
            txt = getattr(content, "text", None)
            if isinstance(txt, str) and txt:
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
                if isinstance(text_value, str) and text_value:
                    return text_value
        except Exception:
            continue

    return None


# Serve index.html at root
@app.get(
    "/",
    summary="Frontend Application",
    description="Serves the main web interface of the AI Buying Assistant",
    tags=["Frontend"],
)
async def read_root():
    """
    Serves the main web interface of the AI Buying Assistant.

    Returns:
        FileResponse: The main HTML page for the web application
    """
    static_files_dir = Path(__file__).parent.parent / "web"
    index_path = static_files_dir / "index.html"
    return FileResponse(index_path)


# Serve static files (CSS, JS, etc.) from root
static_files_dir = Path(__file__).parent.parent / "web"
app.mount("/", StaticFiles(directory=static_files_dir, html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
