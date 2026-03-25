<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-21 | Updated: 2026-03-24 -->

# Frontend Source (src/)

## Purpose
React 19 + TypeScript frontend for the Meet Intelligence app. Uses Tailwind CSS 4 for styling, Zustand for state, TanStack React Query for async data patterns.

## Key Files
| File | Description |
|------|-------------|
| `main.tsx` | React root with QueryClientProvider (retry: 1, staleTime: 30s) |
| `App.tsx` | Route state machine + page rendering via `onNavigate` pattern |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `components/` | Reusable UI components organized by domain (see `components/AGENTS.md`) |
| `pages/` | Top-level page components: Dashboard, Meetings, MeetingDetail, ActionItems, Settings (see `pages/AGENTS.md`) |
| `hooks/` | Custom React hooks — useAutosave (see `hooks/AGENTS.md`) |
| `lib/` | api.ts (typed Tauri invoke wrapper), utils.ts, templates.ts (see `lib/AGENTS.md`) |
| `types/` | TypeScript interfaces matching Rust domain models (see `types/AGENTS.md`) |
| `stores/` | Zustand stores — theme-store (see `stores/AGENTS.md`) |
| `styles/` | Tailwind CSS 4 globals with CSS custom properties (see `styles/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- All backend calls go through `lib/api.ts` which wraps `@tauri-apps/api/core` invoke
- Types in `types/index.ts` must stay in sync with Rust `domain/` models
- Use Tailwind utility classes, not custom CSS (except globals.css)
- Components should be small and focused — avoid god-components
- lucide-react for icons (pinned to 0.462.0)
- Routing is state-based (`App.tsx` Route union type), not URL-based

### Common Patterns
- Pages receive `onNavigate` prop for routing between views
- UI components use `clsx` for conditional classes
- Variant props for visual styles (Button variant, Badge variant)
- Inline `style` props for theme-aware colors using CSS variables
- `react-hook-form` for form state management
- `date-fns` for date formatting

<!-- MANUAL: -->
