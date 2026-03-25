<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# App Module

## Purpose
Application state initialization and Tauri command handler registration. Thin command layer that delegates to services.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Module declarations for `commands` and `state` |
| `state.rs` | `AppState` struct holding `Database`, `AppConfig`, AI provider, and settings — initialized at startup |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `commands/` | Tauri `#[tauri::command]` handlers (see `commands/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- `AppState::init()` creates the database, loads settings, and initializes the AI provider
- `AppState` is managed by Tauri via `.manage(state)` and accessed in commands via `State<AppState>`
- AI provider is stored as `Arc<dyn AiProvider>` for thread safety

<!-- MANUAL: -->
