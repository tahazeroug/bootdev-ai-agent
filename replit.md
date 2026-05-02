# LLM Chatbot CLI / Build AI Agent

## Overview
A Python CLI tool that uses Google's Gemini 2.5 Flash model to act as an autonomous AI code assistant. It can read files, list directories, write files, and run Python code within a working directory.

## Architecture
- **Language**: Python 3.12
- **Package Manager**: pip (uv also available)
- **Entry Point**: `main.py`
- **Working Directory for Agent**: `./calculator` (configured in `config.py`)

## Key Files
- `main.py` — CLI entry point, argument parsing, main loop
- `call_function.py` — Tool-calling orchestration between LLM and local functions
- `config.py` — Constants: `MAX_CHARS`, `WORKING_DIR`, `MAX_ITERS`
- `prompts.py` — System prompt for the AI agent
- `functions/` — Agent tool implementations:
  - `get_file_content.py` — Read file contents
  - `get_files_info.py` — List directory contents
  - `write_file.py` — Write/overwrite files
  - `run_python_file.py` — Execute Python files
- `calculator/` — Sample sub-project used for demo/testing

## Dependencies
- `google-genai==1.12.1` — Google Gemini API client
- `python-dotenv==1.1.0` — Load environment variables from `.env`
- `argparse>=1.4.0` — CLI argument parsing

## Environment Variables
- `GEMINI_API_KEY` — Required. Google Gemini API key. Set in a `.env` file or as an environment secret.

## Usage
```sh
python3 main.py "Your prompt here"
python3 main.py "Your prompt here" --verbose
```

## Notes
- The project originally required Python 3.14+; updated to >=3.12 for Replit compatibility.
- No frontend — this is a pure CLI/console application.
- The workflow runs a sample prompt; modify the command to run your own prompt.
