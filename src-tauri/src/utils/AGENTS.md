<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Utilities

## Purpose
Shared error types for the application.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports errors module |
| `errors.rs` | `AppError` enum implementing `Serialize` for Tauri IPC, with variants for Database, Ai, Config, NotFound, Validation, Export, Keyring errors. Also defines `AppResult<T>` type alias. |

## For AI Agents

### Working In This Directory
- `AppError` must implement `serde::Serialize` — Tauri requires serializable errors for IPC
- Each variant maps to a user-friendly error message
- `From` impls convert `rusqlite::Error`, `anyhow::Error`, etc. into `AppError`
- Use `AppResult<T>` as the return type for all service and command functions

<!-- MANUAL: -->
