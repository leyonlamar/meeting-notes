<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# TypeScript Types

## Purpose
TypeScript interfaces mirroring Rust domain models. Single source of truth for frontend type safety.

## Key Files
| File | Description |
|------|-------------|
| `index.ts` | All interfaces: Meeting, RawNote, ProcessedMinutes, ActionItem, Decision, Deliverable, RiskOrBlocker, OpenQuestion, AiResponse, AppSettings, plus request/filter/stats types |

## For AI Agents

### Working In This Directory
- Types MUST stay in sync with Rust `src-tauri/src/domain/` models
- Request types use optional fields (e.g., `title?: string`) for partial updates
- Filter types support pagination (`limit`, `offset`) and search
- Status/priority types are string unions matching Rust enum `as_str()` values
- Tags are `string[]` (stored as JSON TEXT in SQLite)
- All IDs are ULID strings
- Dates are ISO 8601 strings or null

<!-- MANUAL: -->
