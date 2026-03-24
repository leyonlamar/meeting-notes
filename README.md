# Meeting Notes & Action Intelligence

A portable Windows desktop application for capturing, structuring, summarizing, and operationalizing meeting notes. Built with Tauri 2 + Rust + React + TypeScript.

## Features

- **Raw Note Capture** — Type notes live, paste transcripts (Teams/Zoom/Meet), import text/markdown files
- **AI-Powered Processing** — Clean grammar, generate structured minutes, extract action items, decisions, deliverables, risks, open questions
- **Human-in-the-Loop** — Review and accept/reject/edit AI suggestions before committing
- **Action Item Tracking** — Full CRUD with owner, due date, priority, status, confidence scoring, tentative flags
- **Full-Text Search** — FTS5-powered search across all meetings and notes
- **Export** — Markdown, CSV, JSON export with save-to-file dialog
- **Portable Mode** — Runs as a portable app without installation
- **Secure** — API keys stored in Windows Credential Store, never in config files
- **Offline-First** — Core features work without internet; AI features degrade gracefully

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Desktop Shell | Tauri 2 |
| Backend | Rust (rusqlite, keyring, reqwest) |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4 |
| Database | SQLite with FTS5 |
| AI | OpenAI-compatible API (Ollama, LM Studio, OpenAI) |

## Prerequisites

- **Rust** 1.70+ with `cargo`
- **Node.js** 18+ with `npm`
- **Windows 10 22H2** or later (for WebView2)

## Setup

```bash
# Clone the repo
git clone <repo-url> meeting-notes
cd meeting-notes

# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev
```

The first `cargo` build will take a few minutes to download and compile Rust dependencies.

## Build for Production

```bash
# Build optimized release
npm run tauri build
```

The installer/executable is output to `src-tauri/target/release/bundle/`.

## Portable Mode

The app supports portable distribution — no installer required.

### How it works

At startup, the app checks for these markers next to the executable:

1. A file named `portable` (can be empty)
2. OR a folder named `data/`

If either exists, the app runs in **portable mode** and stores all data inside `<exe_dir>/data/`:

```
meeting-notes.exe
portable              ← marker file (or just create a data/ folder)
data/
  db/                 ← SQLite database
  config/             ← settings.json
  exports/            ← exported files
  logs/               ← application logs
```

If neither marker exists, data is stored in `%APPDATA%/meeting-notes/`.

### Creating a portable distribution

1. Build the release: `npm run tauri build`
2. Copy the `.exe` from `src-tauri/target/release/`
3. Create a `portable` file (or `data/` folder) next to it
4. Distribute the folder

## AI Provider Configuration

### Mock Provider (Default)
No configuration needed. Returns realistic sample data for development and testing.

### Ollama (Local)
1. Install Ollama and pull a model (e.g., `ollama pull llama3`)
2. In Settings, set:
   - Provider: `openai-compatible`
   - Endpoint: `http://localhost:11434/v1`
   - Model: `llama3`

### LM Studio (Local)
1. Start LM Studio server
2. In Settings, set:
   - Provider: `openai-compatible`
   - Endpoint: `http://localhost:1234/v1`
   - Model: (your loaded model name)

### OpenAI API
1. In Settings, set:
   - Provider: `openai-compatible`
   - Endpoint: `https://api.openai.com/v1`
   - Model: `gpt-4o-mini` (or your preferred model)
2. Enter your API key in the API Key section (stored in Windows Credential Store)

## Project Structure

```
meeting-notes/
├── src/                        # React frontend
│   ├── components/
│   │   ├── ui/                 # Base UI components (Button, Badge, Card, Tabs)
│   │   ├── layout/             # AppLayout, Sidebar
│   │   ├── meetings/           # NoteEditor
│   │   ├── actions/            # ActionItemRow
│   │   ├── ai/                 # ExtractionReview
│   │   └── search/
│   ├── pages/                  # Dashboard, Meetings, MeetingDetail, ActionItems, Settings
│   ├── hooks/                  # useAutosave
│   ├── lib/                    # api.ts (Tauri invoke wrapper), utils.ts
│   ├── types/                  # TypeScript interfaces
│   └── styles/                 # Tailwind globals
├── src-tauri/                  # Rust backend
│   └── src/
│       ├── app/commands/       # Tauri command handlers (thin layer)
│       ├── domain/             # Domain models (Meeting, ActionItem, Minutes, etc.)
│       ├── services/           # Business logic
│       ├── db/                 # SQLite repos, migrations, FTS5 search
│       ├── ai/                 # Provider trait, MockProvider, OpenAiCompatibleProvider
│       ├── config/             # Portable mode, app config
│       ├── export/             # Markdown, CSV, JSON export
│       └── utils/              # Error types
└── ARCHITECTURE.md             # Full architecture documentation
```

## Database

SQLite with WAL mode for performance. Schema includes:

- **meetings** — Meeting sessions with status tracking
- **raw_notes** — Original unprocessed notes (source of truth)
- **processed_minutes** — AI-generated structured minutes
- **action_items** — Tracked commitments with confidence scores
- **decisions, deliverables, risks_blockers, open_questions** — Extracted entities
- **ai_processing_runs** — Audit trail for AI operations
- **meetings_fts** — FTS5 full-text search index

Migrations run automatically on startup.

## Security & Privacy

- All data stored locally by default
- API keys stored in Windows Credential Store via `keyring` crate
- Keys never appear in logs, config files, or exports
- When using API-based AI providers, note content is sent to the configured endpoint
- No telemetry or analytics

## License

MIT
