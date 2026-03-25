<!-- Generated: 2026-03-21 | Updated: 2026-03-24 -->

# Meet Intelligence — Meeting Notes & Action Intelligence

## Purpose
Portable Windows desktop application that transforms raw meeting notes into structured minutes with tracked action items, decisions, deliverables, and risks. Local-first, AI-assisted, human-in-the-loop.

## Key Files
| File | Description |
|------|-------------|
| `package.json` | NPM dependencies and build scripts (v0.1.0) |
| `vite.config.ts` | Vite + React + Tailwind CSS 4 config |
| `tsconfig.json` | TypeScript strict configuration |
| `index.html` | App entry HTML (title: Meet Intelligence) |
| `ARCHITECTURE.md` | Full architecture documentation |
| `SOP.md` | Standard operating procedures |
| `README.md` | Setup, usage, and project overview |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `src/` | React frontend (see `src/AGENTS.md`) |
| `src-tauri/` | Rust backend + Tauri 2 config (see `src-tauri/AGENTS.md`) |
| `samples/` | Sample CSV/JSON export files + Excel integration guide (see `samples/AGENTS.md`) |
| `dist/` | Vite build output (gitignored) |

## For AI Agents

### Working In This Directory
- This is a Tauri 2 project — use `npm run tauri dev` to run, `npm run tauri build` to package
- Frontend: React 19 + TypeScript + Tailwind CSS 4 + Vite 6
- Backend: Rust with rusqlite (bundled SQLite + FTS5), keyring, reqwest
- All frontend-backend communication uses Tauri 2 `invoke` (never v1 patterns)
- Portable mode: place `portable` file or `data/` folder next to exe

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
- CSS variables for theming (dark/light) in `src/styles/globals.css`
- Meeting templates with realistic sample data in `src/lib/templates.ts`

## Dependencies

### External
- Tauri 2 — desktop shell with fs, dialog, shell plugins
- React 19, Vite 6, Tailwind CSS 4 — frontend
- TanStack React Query — async data fetching
- Zustand — lightweight state management
- lucide-react — icons
- rusqlite (bundled), keyring, reqwest, chrono, ulid — backend

<!-- MANUAL: -->
