<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Pages

## Purpose
Top-level page components, each representing a full view in the app. Pages receive `onNavigate` to switch between views.

## Key Files
| File | Description |
|------|-------------|
| `Dashboard.tsx` | Home page with meeting stats, recent meetings, overdue action items, quick-create |
| `MeetingsPage.tsx` | Meeting list with search, filter by status/project/date, and create-new flow |
| `MeetingDetailPage.tsx` | Full meeting view: notes editor, AI processing, minutes, extracted entities, action items |
| `ActionItemsPage.tsx` | Cross-meeting action item list with filtering by owner/status/priority/due date |
| `SettingsPage.tsx` | App settings: AI provider config, theme toggle, API key management, data directory info |

## For AI Agents

### Working In This Directory
- All pages accept `onNavigate: (route: Route) => void` except SettingsPage
- `MeetingDetailPage` accepts `meetingId: string` prop and is the most complex page
- Pages use `api.*` calls from `lib/api.ts` for data fetching
- TanStack React Query patterns available but pages currently use `useEffect` + `useState`
- Use `Card` component for content sections, `Button` for actions, `Badge` for status

<!-- MANUAL: -->
