<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Rust Source (src-tauri/src/)

## Purpose
Container for all Rust backend modules. Entry point is `lib.rs` which declares modules and sets up the Tauri application with plugins, state, and command handlers.

## Key Files
| File | Description |
|------|-------------|
| `lib.rs` | Module declarations, Tauri builder setup, portable mode init, command handler registration |
| `main.rs` | Binary entry point — calls `meeting_notes_lib::run()` |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `app/` | AppState initialization and Tauri command handlers (see `app/AGENTS.md`) |
| `domain/` | Domain models: Meeting, ActionItem, Minutes, Extraction entities, Settings (see `domain/AGENTS.md`) |
| `services/` | Business logic: MeetingService, ActionItemService, ExportService (see `services/AGENTS.md`) |
| `db/` | SQLite connection, migrations, repository functions (see `db/AGENTS.md`) |
| `ai/` | AI provider trait, MockProvider, OpenAiCompatibleProvider (see `ai/AGENTS.md`) |
| `config/` | Portable mode detection, AppConfig (see `config/AGENTS.md`) |
| `export/` | Export module re-exports + PDF generation (see `export/AGENTS.md`) |
| `utils/` | AppError type with Tauri-serializable errors (see `utils/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `lib.rs` is the central wiring file — new modules must be declared here
- New commands must be added to the `invoke_handler!` macro in `lib.rs`
- Startup flow: detect portable dir -> ensure data dirs -> init AppConfig -> init AppState -> build Tauri app
- Tauri plugins: fs, dialog, shell (all v2)

<!-- MANUAL: -->
