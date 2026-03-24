# Meeting Notes & Action Intelligence — Architecture

## Product Summary

A portable Windows desktop application that transforms raw meeting notes, transcripts, and bullet dumps into structured meeting minutes with tracked action items, decisions, deliverables, risks, and follow-ups. Local-first, AI-assisted, human-in-the-loop.

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Shell | Tauri 2 | Native Windows app, small binary, Rust backend |
| Backend | Rust | Performance, safety, type-safe DB access |
| Frontend | React 18 + TypeScript + Vite | Fast dev, strong typing, rich ecosystem |
| Styling | Tailwind CSS 4 | Utility-first, minimal CSS, consistent design |
| Database | SQLite via rusqlite | Zero-config, portable, embedded |
| State | Zustand | Minimal, predictable, no boilerplate |
| Routing | TanStack Router | Type-safe file-based routing |
| Forms | React Hook Form | Performant, minimal re-renders |
| Async | TanStack Query | Cache, dedupe, background refresh |

## Architecture Layers

```
┌─────────────────────────────────────────────┐
│              Presentation (React)            │
│  Pages → Components → Stores → Hooks        │
├─────────────────────────────────────────────┤
│           Tauri IPC Bridge (invoke)          │
├─────────────────────────────────────────────┤
│         Command Handlers (thin layer)        │
│         app/commands/*.rs                    │
├─────────────────────────────────────────────┤
│         Services (business logic)            │
│         services/*.rs                        │
├──────────────┬──────────────────────────────┤
│  AI Layer    │   Persistence Layer           │
│  ai/*.rs     │   db/*.rs (rusqlite + FTS5)   │
├──────────────┴──────────────────────────────┤
│         Domain Models                        │
│         domain/*.rs                          │
├─────────────────────────────────────────────┤
│         Config / Portable Detection          │
│         config/*.rs                          │
└─────────────────────────────────────────────┘
```

## Database Schema

### Core Tables

**meetings** — One row per meeting session
- `id` TEXT PRIMARY KEY (ULID)
- `title` TEXT NOT NULL
- `meeting_date` TEXT (ISO 8601)
- `location` TEXT
- `project` TEXT
- `tags` TEXT (JSON array)
- `status` TEXT DEFAULT 'draft' (draft|processing|complete|archived)
- `created_at` TEXT NOT NULL
- `updated_at` TEXT NOT NULL
- `deleted_at` TEXT

**meeting_participants** — Attendees per meeting
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `name` TEXT NOT NULL
- `role` TEXT
- `email` TEXT

**raw_notes** — Original unprocessed input (source of truth)
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `content` TEXT NOT NULL
- `source_type` TEXT DEFAULT 'manual' (manual|paste|import)
- `source_filename` TEXT
- `created_at` TEXT NOT NULL

**processed_minutes** — AI-generated or manually structured output
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `version` INTEGER DEFAULT 1
- `executive_summary` TEXT
- `key_discussion_points` TEXT (JSON array)
- `agenda` TEXT
- `content_markdown` TEXT
- `is_accepted` INTEGER DEFAULT 0
- `ai_provider` TEXT
- `ai_run_id` TEXT
- `created_at` TEXT NOT NULL

**action_items** — Tracked commitments
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `title` TEXT NOT NULL
- `description` TEXT
- `owner` TEXT
- `due_date` TEXT
- `priority` TEXT DEFAULT 'medium' (low|medium|high|critical)
- `status` TEXT DEFAULT 'open' (open|in_progress|done|cancelled)
- `category` TEXT
- `tags` TEXT (JSON array)
- `notes` TEXT
- `is_tentative` INTEGER DEFAULT 0
- `confidence_score` REAL
- `source_snippet` TEXT
- `source_offsets` TEXT
- `ai_provider` TEXT
- `ai_run_id` TEXT
- `created_at` TEXT NOT NULL
- `updated_at` TEXT NOT NULL
- `deleted_at` TEXT

**decisions** — Recorded decisions
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `content` TEXT NOT NULL
- `rationale` TEXT
- `decided_by` TEXT
- `is_tentative` INTEGER DEFAULT 0
- `confidence_score` REAL
- `source_snippet` TEXT
- `ai_run_id` TEXT
- `created_at` TEXT NOT NULL

**deliverables** — Expected outputs
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `title` TEXT NOT NULL
- `description` TEXT
- `owner` TEXT
- `due_date` TEXT
- `is_tentative` INTEGER DEFAULT 0
- `confidence_score` REAL
- `source_snippet` TEXT
- `ai_run_id` TEXT
- `created_at` TEXT NOT NULL

**risks_blockers** — Identified risks and blockers
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `content` TEXT NOT NULL
- `risk_type` TEXT DEFAULT 'risk' (risk|blocker|dependency)
- `severity` TEXT DEFAULT 'medium'
- `owner` TEXT
- `is_tentative` INTEGER DEFAULT 0
- `confidence_score` REAL
- `source_snippet` TEXT
- `ai_run_id` TEXT
- `created_at` TEXT NOT NULL

**open_questions** — Unresolved items
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `content` TEXT NOT NULL
- `assigned_to` TEXT
- `is_tentative` INTEGER DEFAULT 0
- `confidence_score` REAL
- `source_snippet` TEXT
- `ai_run_id` TEXT
- `created_at` TEXT NOT NULL

**ai_processing_runs** — Audit trail for AI operations
- `id` TEXT PRIMARY KEY
- `meeting_id` TEXT NOT NULL REFERENCES meetings(id)
- `operation` TEXT NOT NULL
- `provider_name` TEXT NOT NULL
- `model_name` TEXT
- `input_hash` TEXT
- `status` TEXT DEFAULT 'pending'
- `error_message` TEXT
- `duration_ms` INTEGER
- `created_at` TEXT NOT NULL

**meetings_fts** — FTS5 virtual table
- Indexes: title, raw note content, processed minutes content

### Indexes
- `idx_meetings_date` ON meetings(meeting_date)
- `idx_meetings_status` ON meetings(status)
- `idx_action_items_meeting` ON action_items(meeting_id)
- `idx_action_items_owner` ON action_items(owner)
- `idx_action_items_status` ON action_items(status)
- `idx_action_items_due_date` ON action_items(due_date)

## AI Provider Abstraction

```rust
#[async_trait]
pub trait AiProvider: Send + Sync {
    fn name(&self) -> &str;
    async fn process(&self, op: AiOperation, input: &str) -> Result<AiResponse>;
}

pub enum AiOperation {
    SummarizeNotes,
    CleanNotes,
    GenerateMinutes,
    ExtractActionItems,
    ExtractDecisions,
    ExtractDeliverables,
    ExtractRisks,
    ExtractOpenQuestions,
    ExtractNextSteps,
    ExtractAttendees,
    ExtractDeadlines,
}
```

Providers: MockProvider (dev), OpenAiCompatibleProvider (Ollama/LM Studio/OpenAI), RuleBasedProvider (offline regex/pattern extraction).

## Portable Mode

Detection at startup:
1. Get executable directory
2. Check for `portable` file OR `data/` folder alongside exe
3. If found → data root = `<exe_dir>/data/`
4. If not → data root = `%APPDATA%/meeting-notes/`

Data root contains: `db/`, `config/`, `exports/`, `logs/`

## UI Information Architecture

```
App
├── Dashboard (default view)
│   ├── Quick Capture
│   ├── Recent Meetings
│   ├── Overdue Actions
│   └── Stats
├── Meetings
│   ├── Meeting List (search + filter)
│   └── Meeting Detail
│       ├── Tab: Raw Notes
│       ├── Tab: Minutes
│       ├── Tab: Action Items
│       ├── Tab: Decisions & Deliverables
│       └── Tab: Export
├── Action Items (global view)
│   ├── List/Filter view
│   └── Detail view
└── Settings
    ├── AI Provider
    ├── API Keys
    ├── Storage
    └── Export Defaults
```

## Implementation Roadmap

1. **Phase 1** — Architecture (this document) ✓
2. **Phase 2** — Scaffold: Tauri 2 project, DB migrations, base UI shell
3. **Phase 3** — Core: Meeting CRUD, notes, minutes, action items, search, export
4. **Phase 4** — AI: Provider interface, mock + OpenAI-compatible, review UX
5. **Phase 5** — Quality: Tests, seed data, build/packaging instructions
