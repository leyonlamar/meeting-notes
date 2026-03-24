<!-- Generated: 2026-03-21 | Updated: 2026-03-21 -->

# Meeting Notes & Action Intelligence

## Purpose
Portable Windows desktop application that transforms raw meeting notes into structured minutes with tracked action items, decisions, deliverables, and risks. Local-first, AI-assisted, human-in-the-loop.

## Key Files
| File | Description |
|------|-------------|
| `package.json` | NPM dependencies and build scripts |
| `vite.config.ts` | Vite + React + Tailwind CSS 4 config |
| `tsconfig.json` | TypeScript strict configuration |
| `index.html` | App entry HTML |
| `ARCHITECTURE.md` | Full architecture documentation |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | React frontend (see `src/AGENTS.md`) |
| `src-tauri/` | Rust backend + Tauri config (see `src-tauri/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- This is a Tauri 2 project — use `npm run tauri dev` to run
- Frontend is React 19 + TypeScript + Tailwind CSS 4 + Vite
- Backend is Rust with rusqlite, keyring, reqwest
- All frontend-backend communication uses Tauri 2 `invoke`
- Never use Tauri v1 patterns or imports

### Testing Requirements
- `cargo check` must pass with zero errors
- `npx tsc --noEmit` must pass with zero errors
- `npx vite build` must succeed

### Common Patterns
- Domain models defined in Rust `domain/`, mirrored in TypeScript `types/`
- Command handlers are thin; business logic lives in `services/`
- AI operations go through the provider trait abstraction
- All IDs are ULIDs
- Soft-delete via `deleted_at` column

## Dependencies

### External
- Tauri 2 — desktop shell
- React 19, Vite 6, Tailwind CSS 4 — frontend
- rusqlite (bundled), keyring, reqwest, chrono, ulid — backend
