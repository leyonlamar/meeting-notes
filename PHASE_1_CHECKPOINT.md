# Phase 1 Checkpoint — Architecture & Design

## Files Created
- `ARCHITECTURE.md` — Full architecture document with schema, layers, AI design, portable mode, UI IA

## Current State
- **What runs:** Nothing yet — design phase only
- **What exists:** Architecture document defining all layers, database schema, AI abstraction, portable mode detection, UI information architecture

## Key Decisions Made
1. **rusqlite over sqlx** — Simpler for embedded SQLite, no async runtime conflict with Tauri
2. **ULID for IDs** — Sortable, no coordination needed, portable-friendly
3. **JSON arrays in TEXT columns** for tags — Pragmatic for SQLite, avoids join tables for simple lists
4. **FTS5** for full-text search — Required, not optional
5. **Portable mode** via `portable` file or `data/` folder detection
6. **AI provider trait** with MockProvider, OpenAiCompatibleProvider, RuleBasedProvider
7. **keyring crate** for API key storage (Windows Credential Store)
8. **Confidence-aware extraction** — All AI outputs carry confidence scores and tentative flags

## What Phase 2 Expects
- This document exists and decisions are final
- Phase 2 will create the full project scaffold:
  - Tauri 2 config, Cargo.toml, package.json
  - Rust module structure with domain models
  - React app shell with routing and base components
  - SQLite migration SQL
  - AI provider trait definition
