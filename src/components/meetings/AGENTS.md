<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Meeting Components

## Purpose
Components for creating and editing meetings: note editor with autosave, file import dialog, and meeting template picker.

## Key Files
| File | Description |
|------|-------------|
| `NoteEditor.tsx` | Rich textarea editor with autosave, character count, and source type tracking |
| `ImportDialog.tsx` | File import dialog using Tauri fs/dialog plugins to import .txt/.md files |
| `TemplatePicker.tsx` | Grid of meeting templates (sprint planning, stakeholder update, 1:1, etc.) |

## For AI Agents

### Working In This Directory
- `NoteEditor` uses the `useAutosave` hook for debounced saves via `api.saveRawNote`
- `ImportDialog` uses `@tauri-apps/plugin-dialog` for file picker and `@tauri-apps/plugin-fs` for reading
- `TemplatePicker` renders templates from `lib/templates.ts` — 8 pre-built templates with realistic content
- Source types: "manual" (typed), "paste" (pasted), "import" (file imported)

<!-- MANUAL: -->
