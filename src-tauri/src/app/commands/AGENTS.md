<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Tauri Command Handlers

## Purpose
Thin `#[tauri::command]` functions that extract parameters, call services, and return serializable results. No business logic here.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports all command modules |
| `meeting_commands.rs` | CRUD for meetings, raw notes, minutes, and extracted entities (decisions, deliverables, risks, open questions) |
| `action_item_commands.rs` | CRUD for action items + stats endpoint |
| `ai_commands.rs` | `run_ai_operation` and `list_ai_providers` |
| `export_commands.rs` | Export minutes (Markdown), action items (CSV/JSON), meeting PDF |
| `search_commands.rs` | FTS5 full-text search across meetings |
| `settings_commands.rs` | Get/update settings, API key management (store/has/delete) |
| `seed_commands.rs` | `seed_sample_data` for dev/demo purposes |

## For AI Agents

### Working In This Directory
- Every command receives `state: State<AppState>` as first parameter
- Commands call `state.db.with_conn(|conn| ...)` or service methods
- Return `Result<T, AppError>` where T is serializable
- New commands MUST be registered in `lib.rs` `invoke_handler!` macro
- Parameter names must match the frontend `invoke()` call argument names exactly

<!-- MANUAL: -->
