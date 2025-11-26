"""
Buying Assistant Agent System
Main entry point providing the buying agent with session management.
"""

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService

from .buying_agent import build_buying_agent

# Build the main buying agent
root_agent = build_buying_agent()

# Create session service
session_service = InMemorySessionService()

# Create runner
runner = Runner(
    agent=root_agent,
    app_name="buying_assistant",
    session_service=session_service
)

print(f"Buying Assistant initialized with agent: {root_agent.name}")
