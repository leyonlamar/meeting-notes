<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Domain Models

## Purpose
Rust structs representing the core business entities. All derive `Serialize`/`Deserialize` for Tauri IPC and `Clone`/`Debug` for convenience.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports all domain modules |
| `meeting.rs` | `Meeting`, `MeetingSummary`, `MeetingStatus`, `CreateMeetingRequest`, `UpdateMeetingRequest`, `MeetingListFilter`, `RawNote`, `SaveRawNoteRequest`, `ProcessedMinutes` |
| `action_item.rs` | `ActionItem`, `Priority`, `ActionStatus`, `CreateActionItemRequest`, `UpdateActionItemRequest`, `ActionItemListFilter`, `ActionItemStats` |
| `extraction.rs` | `Decision`, `Deliverable`, `RiskOrBlocker`, `OpenQuestion` — AI-extracted entities |
| `minutes.rs` | Additional minutes-related types |
| `settings.rs` | `AppSettings`, `UpdateSettingsRequest`, `AiProcessingRun` |

## For AI Agents

### Working In This Directory
- These types are mirrored 1:1 in TypeScript `src/types/index.ts` — changes here require frontend sync
- Enums use `as_str()`/`from_str()` for SQLite TEXT column serialization
- Request types use `Option<T>` for partial updates
- Tags are `Vec<String>` serialized as JSON TEXT in SQLite
- All IDs are ULID strings, timestamps are ISO 8601 UTC

<!-- MANUAL: -->
