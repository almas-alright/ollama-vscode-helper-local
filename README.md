# Local Ollama Helper

Minimal VS Code extension to ask a local Ollama instance and show responses in an Output Channel.

## Features (Phase 1)
- Command: `Local Ollama Helper: Ask Ollama`
- Settings:
  - `localOllamaHelper.apiUrl` (default `http://localhost:11434/api/chat`)
  - `localOllamaHelper.model` (default `llama3.2:1b`)
- Prompts for input, sends to Ollama `/api/chat`, prints response in the "Local Ollama Helper" output channel.
- Clear error messages when network or environment issues occur.

## Prerequisites
- Node.js 18+ (VS Code extension host uses Node; the code checks for a global `fetch`).
- Visual Studio Code
- Install dependencies: `npm install`

## Build
This project uses `esbuild` for a small bundle (see scripts in `package.json`).

- Install dev deps:

    npm install

- Build the extension bundle:

    npm run esbuild

For development with sourcemaps:

    npm run esbuild

To watch:

    npm run esbuild-watch

## Run / Debug
1. Open this folder in VS Code.
2. Press F5 (Launch Extension) — a new Extension Development Host window will open.
3. In the new host window, open the Command Palette (Ctrl/Cmd+Shift+P) and run `Local Ollama Helper: Ask Ollama`.
4. Enter a prompt; results will appear in the "Local Ollama Helper" output channel.

## Configuration
Open Settings (UI) or edit `.vscode/settings.json` and set:
- `localOllamaHelper.apiUrl` — full URL to Ollama chat endpoint
- `localOllamaHelper.model` — model identifier to pass to the API

## Troubleshooting
- If you see an error saying the Fetch API is not available: ensure your VS Code is recent enough to use Node 18+ in the extension host. The extension checks for global fetch and shows a clear error if it's missing.
- If the Ollama API returns non-200: check the Output channel for status and response body.

## Notes & Scope
- Phase 1 only: no text selection integration, no automatic edits, and no Git-specific features.
- Keep the Ollama instance running locally at the configured `apiUrl`.
