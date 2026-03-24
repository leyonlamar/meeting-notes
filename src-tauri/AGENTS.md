<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-21 -->

# Rust Backend (src-tauri/)

## Purpose
Tauri 2 Rust backend providing SQLite persistence, AI provider abstraction, export services, portable mode detection, and secure credential storage.

## Key Files
| File | Description |
|------|-------------|
| `Cargo.toml` | Rust dependencies |
| `tauri.conf.json` | Tauri 2 configuration (plugins, window, bundle) |
| `capabilities/default.json` | Tauri 2 permission capabilities |
| `build.rs` | Tauri build script |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/app/commands/` | Tauri command handlers — thin layer delegating to services |
| `src/app/` | AppState initialization |
| `src/domain/` | Domain models: Meeting, ActionItem, Minutes, Extraction, Settings |
| `src/services/` | Business logic: MeetingService, ActionItemService, ExportService |
| `src/db/` | SQLite: connection, migrations, repos (meeting, action_item, search) |
| `src/ai/` | AI provider trait, MockProvider, OpenAiCompatibleProvider |
| `src/config/` | Portable mode detection, AppConfig |
| `src/export/` | Re-exports from ExportService |
| `src/utils/` | AppError with Tauri-serializable errors |

## For AI Agents

### Working In This Directory
- Keep command handlers thin — delegate to services
- Services use `Database::with_conn()` for thread-safe DB access
- All IDs are ULIDs generated via `ulid::Ulid::new()`
- Timestamps are ISO 8601 UTC strings
- Errors must implement `Serialize` for Tauri IPC
- API keys go through `keyring` crate — NEVER store in config files or log them
- AI providers implement the `AiProvider` trait

### Testing Requirements
- `cargo check` must pass with zero errors before any PR
- New tables need migration entries in `db/migrations.rs`
- New commands must be registered in `lib.rs` invoke_handler

### Common Patterns
- `AppResult<T>` = `Result<T, AppError>` for all service returns
- `from_str` / `as_str` pattern for enum serialization in SQLite
- JSON arrays stored as TEXT columns for simple lists (tags)
- FTS5 index updated after note/minutes changes
