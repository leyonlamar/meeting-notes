<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-21 | Updated: 2026-03-24 -->

# Rust Backend (src-tauri/)

## Purpose
Tauri 2 Rust backend providing SQLite persistence with FTS5 search, AI provider abstraction (mock + OpenAI-compatible), export services (Markdown/CSV/JSON/PDF), portable mode detection, and secure credential storage via Windows Credential Store.

## Key Files
| File | Description |
|------|-------------|
| `Cargo.toml` | Rust dependencies (tauri 2, rusqlite bundled, keyring, reqwest, chrono, ulid, printpdf) |
| `tauri.conf.json` | Tauri 2 configuration: window (1280x800), bundle (NSIS + MSI), plugins (fs, dialog, shell) |
| `capabilities/default.json` | Tauri 2 permission capabilities for main window |
| `build.rs` | Tauri build script |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | Rust source code (see `src/AGENTS.md`) |
| `capabilities/` | Tauri 2 capability/permission definitions |
| `icons/` | App icons (32x32, 128x128, 128x128@2x, icon.ico) |

## For AI Agents

### Working In This Directory
- Keep command handlers thin — delegate to services
- Services use `Database::with_conn()` for thread-safe DB access
- All IDs are ULIDs generated via `ulid::Ulid::new()`
- Timestamps are ISO 8601 UTC strings
- Errors must implement `Serialize` for Tauri IPC (see `utils/errors.rs`)
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

<!-- MANUAL: -->
