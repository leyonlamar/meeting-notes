<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Database Layer

## Purpose
SQLite database connection, migrations, and repository functions. Uses rusqlite with bundled SQLite (includes FTS5).

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports: `Database`, repos, migrations |
| `connection.rs` | `Database` struct with `Mutex<Connection>`, WAL mode, `with_conn()` thread-safe access |
| `migrations.rs` | Schema migrations run on startup: meetings, raw_notes, processed_minutes, action_items, decisions, deliverables, risks_blockers, open_questions, ai_processing_runs, meetings_fts, settings |
| `meeting_repo.rs` | Meeting CRUD, raw note CRUD, minutes CRUD, extracted entity CRUD (decisions, deliverables, risks, questions), FTS5 index updates |
| `action_item_repo.rs` | Action item CRUD, list with filters, stats (open/overdue counts) |
| `search_repo.rs` | FTS5 full-text search across meetings (title, notes, minutes) |

## For AI Agents

### Working In This Directory
- All repo functions take `&Connection` as first parameter (not `Database`)
- `Database::with_conn()` provides the locked connection to repo functions
- Migrations are idempotent — use `CREATE TABLE IF NOT EXISTS`
- FTS5 virtual table: `meetings_fts` indexes title + note content + minutes
- Pragmas: WAL mode, synchronous=NORMAL, foreign_keys=ON, busy_timeout=5000ms
- New tables MUST have a migration entry in `migrations.rs`
- Row mapping uses `row.get()` with positional indices

<!-- MANUAL: -->
