<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Library Utilities (lib/)

## Purpose
Shared utilities, API wrapper, and meeting templates used across the frontend.

## Key Files
| File | Description |
|------|-------------|
| `api.ts` | Typed Tauri invoke wrapper — single `api` object with methods for all backend commands |
| `utils.ts` | Helpers: `cn` (clsx wrapper), `formatDate`, `isOverdue`, `priorityColor`, `statusColor`, `truncate` |
| `templates.ts` | 8 meeting templates with realistic sample content (sprint planning, stakeholder update, 1:1, brainstorm, kickoff, retro, client meeting, incident review) |

## For AI Agents

### Working In This Directory
- `api.ts` is the ONLY place that calls `invoke()` — all backend communication goes through here
- Every `api.*` method is typed with request/response interfaces from `types/`
- `utils.ts` helpers are pure functions, no side effects
- Templates contain rich realistic content for demo/onboarding purposes
- When adding new backend commands, add the typed wrapper in `api.ts`

<!-- MANUAL: -->
