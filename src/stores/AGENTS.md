<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Stores

## Purpose
Zustand state stores for global client-side state.

## Key Files
| File | Description |
|------|-------------|
| `theme-store.ts` | Theme state (dark/light) — persists to backend settings, applies via `data-theme` attribute on `<html>` |

## For AI Agents

### Working In This Directory
- Uses Zustand `create` with TypeScript interface
- Theme loads from backend settings on mount via `loadTheme()`
- `setTheme` applies the theme AND persists to backend (fire-and-forget)
- `applyTheme` sets `document.documentElement.setAttribute("data-theme", theme)`
- Default theme is "dark"

<!-- MANUAL: -->
