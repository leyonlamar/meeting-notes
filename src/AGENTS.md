<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-21 -->

# Frontend Source (src/)

## Purpose
React 19 + TypeScript frontend for the Meeting Notes app. Uses Tailwind CSS 4 for styling, Zustand for state, TanStack Query available for async patterns.

## Key Files
| File | Description |
|------|-------------|
| `main.tsx` | React root with QueryClientProvider |
| `App.tsx` | Route state + page rendering |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `components/ui/` | Base UI: Button, Badge, Card, Tabs, EmptyState |
| `components/layout/` | AppLayout, Sidebar |
| `components/meetings/` | NoteEditor with autosave and file import |
| `components/actions/` | ActionItemRow with inline editing |
| `components/ai/` | ExtractionReview (human-in-the-loop) |
| `pages/` | Dashboard, MeetingsPage, MeetingDetailPage, ActionItemsPage, SettingsPage |
| `hooks/` | useAutosave |
| `lib/` | api.ts (typed Tauri invoke wrapper), utils.ts |
| `types/` | TypeScript interfaces matching Rust domain models |
| `styles/` | Tailwind CSS 4 globals with CSS variables |

## For AI Agents

### Working In This Directory
- All backend calls go through `lib/api.ts` which wraps `@tauri-apps/api/core` invoke
- Types in `types/index.ts` must stay in sync with Rust `domain/` models
- Use Tailwind utility classes, not custom CSS
- Components should be small and focused — avoid god-components
- lucide-react for icons (pinned to 0.462.0)

### Common Patterns
- Pages receive `onNavigate` prop for routing
- UI components use `clsx` for conditional classes
- Variant props for visual styles (Button variant, Badge variant)
