<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Services

## Purpose
Business logic layer. Services orchestrate database operations, AI calls, and export generation. Called by command handlers.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports all service modules |
| `meeting_service.rs` | Meeting lifecycle: create, update, delete, list, save notes, process with AI, save minutes and extracted entities |
| `action_item_service.rs` | Action item CRUD with business rules, stats aggregation |
| `export_service.rs` | Export generation: Markdown minutes, CSV/JSON action items, PDF meeting reports |

## For AI Agents

### Working In This Directory
- Services receive `&Database` and/or `Arc<dyn AiProvider>` as dependencies
- All service methods return `AppResult<T>` (= `Result<T, AppError>`)
- MeetingService.process_with_ai: runs AI operation, saves results, updates FTS index
- ExportService generates string output (Markdown/CSV/JSON) or byte vector (PDF)
- PDF generation uses the `printpdf` crate

<!-- MANUAL: -->
