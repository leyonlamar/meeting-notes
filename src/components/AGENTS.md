<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Components

## Purpose
Reusable React components organized by domain area. Base UI primitives in `ui/`, layout scaffolding in `layout/`, and feature-specific components in `meetings/`, `actions/`, `ai/`, and `search/`.

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `ui/` | Base UI primitives: Button, Badge, Card, Tabs, EmptyState (see `ui/AGENTS.md`) |
| `layout/` | App shell: AppLayout, Sidebar (see `layout/AGENTS.md`) |
| `meetings/` | Meeting editing: NoteEditor, ImportDialog, TemplatePicker (see `meetings/AGENTS.md`) |
| `actions/` | Action item display: ActionItemRow with inline editing (see `actions/AGENTS.md`) |
| `ai/` | AI review: ExtractionReview for human-in-the-loop approval (see `ai/AGENTS.md`) |
| `search/` | Search components (placeholder for future FTS5 UI) |

## For AI Agents

### Working In This Directory
- Each component lives in its own file, one export per file
- Use existing `ui/` components as building blocks
- Style with Tailwind utilities + CSS variable references via `style` props
- Use `clsx` for conditional class composition

<!-- MANUAL: -->
