<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Configuration

## Purpose
Portable mode detection and application configuration. Determines where data is stored based on exe location markers.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports config modules |
| `portable.rs` | `detect_data_directory()`: checks for `portable` file or `data/` folder next to exe; falls back to `%APPDATA%/meeting-notes/` |
| `app_config.rs` | `AppConfig` struct holding data directory paths (db, config, exports, logs) |

## For AI Agents

### Working In This Directory
- Portable detection runs once at startup in `lib.rs`
- `ensure_data_dirs()` creates the directory structure: `db/`, `config/`, `exports/`, `logs/`
- Portable mode: `<exe_dir>/data/` | Standard mode: `%APPDATA%/meeting-notes/`
- Settings stored in `config/settings.json` within the data directory

<!-- MANUAL: -->
