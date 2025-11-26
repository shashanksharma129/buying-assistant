# AI Buying Assistant

An intelligent buying assistant powered by Google's Agent Development Kit (ADK) and Gemini AI. This application helps users find the best products based on their preferences and highlights relevant offers for their credit/debit cards.

![AI Buying Assistant](docs/screenshot.png)

## Features

- 🤖 **AI-Powered Recommendations**: Uses Gemini 2.5 Flash for intelligent product research
- 💳 **Card-Specific Offers**: Highlights cashback and offers for your credit/debit cards
- 🎨 **Premium UI**: Beautiful glassmorphism design with smooth animations
- ⚡ **Real-time Search**: Fast, streaming responses from the AI agent
- 🔄 **Session Management**: Maintains conversation context across requests

## Architecture

Built with modern best practices:

- **Backend**: FastAPI serving both API and static files
- **Agent**: Google ADK `LlmAgent` with proper session management
- **Frontend**: Vanilla JavaScript with premium CSS styling
- **Session**: `InMemorySessionService` for conversation state

## Prerequisites

- Python 3.13+
- [UV](https://docs.astral.sh/uv/) package manager
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/buying-assistant.git
cd buying-assistant
```

### 2. Install Dependencies

```bash
uv sync
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 4. Run the Application

```bash
uv run uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Access the Application

Open your browser to: **http://localhost:8000**

## Usage

1. **Enter Product**: Describe what you're looking for (e.g., "best laptop for coding under $1000")
2. **Add Cards** (Optional): List your credit/debit cards (e.g., "HDFC Regalia, Amex Platinum")
3. **Get Results**: Click "Find Best Options" to receive AI-powered recommendations

The agent will provide:
- Product recommendations with key features
- Approximate prices
- Why each product fits your criteria
- Available offers (highlighting your card-specific deals)

## Project Structure

```
buying-assistant/
├── src/
│   ├── agent/
│   │   ├── agent.py           # Root agent with runner and session service
│   │   └── buying_agent.py    # ADK LlmAgent configuration
│   ├── api/
│   │   └── main.py            # FastAPI backend
│   └── web/
│       ├── index.html         # Frontend UI
│       ├── styles.css         # Styling
│       └── app.js             # Frontend logic
├── .env                       # Environment variables (create this)
├── .gitignore                 # Git ignore rules
├── pyproject.toml             # Project dependencies
└── README.md                  # This file
```

## Development

### Running with Auto-Reload

```bash
uv run uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

The `--reload` flag enables automatic restart when code changes are detected.

### Adding Dependencies

```bash
uv add package-name
```

## Troubleshooting

### Rate Limit Errors (429)

If you see "429 RESOURCE_EXHAUSTED":
- You've hit the free tier rate limit
- Wait 60 seconds and try again
- Consider upgrading your Gemini API quota

### Invalid API Key

1. Verify your key at: https://aistudio.google.com/app/apikey
2. Ensure it's correctly set in `.env`
3. Restart the server after changing `.env`

### Port Already in Use

```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Then restart
uv run uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload
```

## Technical Details

### ADK Integration

The application follows Google ADK best practices:

- **Root Agent Pattern**: Agent, runner, and session service initialized at module level
- **Proper Message Format**: Uses `Content(role='user', parts=[Part(text=...)])`
- **Event Streaming**: Async event handling with proper text extraction
- **Session Management**: Creates sessions before agent execution

### Key Components

- **`src/agent/agent.py`**: Exports `root_agent`, `runner`, and `session_service`
- **`src/agent/buying_agent.py`**: Configures the `LlmAgent` with Gemini model
- **`src/api/main.py`**: FastAPI app with chat endpoint and static file serving
- **`src/web/`**: Frontend files served directly by FastAPI

## Future Enhancements

- [ ] Persistent session storage (database-backed)
- [ ] User authentication and profiles
- [ ] Save favorite products
- [ ] Price tracking and alerts
- [ ] Custom tools for e-commerce APIs
- [ ] Multi-agent pattern for specialized research

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Built with [Google Agent Development Kit (ADK)](https://google.github.io/adk-docs/)
- Powered by [Gemini AI](https://ai.google.dev/)
- UI inspired by modern glassmorphism design trends

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review [ADK Documentation](https://google.github.io/adk-docs/)
- Open an issue on GitHub

---

Made with ❤️ using Google ADK and Gemini AI
