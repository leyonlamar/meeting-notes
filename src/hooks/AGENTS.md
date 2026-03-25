<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Hooks

## Purpose
Custom React hooks for shared behavior across components.

## Key Files
| File | Description |
|------|-------------|
| `use-autosave.ts` | Debounced autosave hook — fires `saveFn` when `value` changes, skips mount, configurable interval (default 30s) |

## For AI Agents

### Working In This Directory
- `useAutosave` tracks `lastSaved` via ref to avoid redundant saves
- Does NOT fire on mount — only on subsequent value changes
- Clears timeout on unmount to prevent memory leaks
- Skips empty/whitespace-only values

<!-- MANUAL: -->
