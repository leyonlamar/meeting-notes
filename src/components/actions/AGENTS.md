<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Action Item Components

## Purpose
Display and inline editing of action items extracted from meetings.

## Key Files
| File | Description |
|------|-------------|
| `ActionItemRow.tsx` | Single action item row with inline editing, status toggle, priority badge, due date, owner, and confidence score |

## For AI Agents

### Working In This Directory
- Uses `Badge` for priority/status display
- Inline editing via `react-hook-form`
- Tentative items (AI-extracted, unconfirmed) show a violet badge
- Confidence score displayed as percentage when present
- Status transitions: open -> in_progress -> done / cancelled
- Overdue detection via `utils.isOverdue()`

<!-- MANUAL: -->
