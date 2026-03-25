<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Layout Components

## Purpose
App shell layout with sidebar navigation and main content area. Provides the persistent navigation frame for all pages.

## Key Files
| File | Description |
|------|-------------|
| `AppLayout.tsx` | Top-level layout: sidebar + main content area, receives `currentRoute` and `onNavigate` |
| `Sidebar.tsx` | Navigation sidebar with route links, theme toggle, and app branding |

## For AI Agents

### Working In This Directory
- `AppLayout` wraps all page content and provides the navigation context
- `Sidebar` uses the `Route` type from `App.tsx` for navigation
- Sidebar items use `.sidebar-item` and `.sidebar-item-active` CSS classes from globals.css
- Theme toggle calls `useThemeStore().toggleTheme()`
- lucide-react icons for navigation items

<!-- MANUAL: -->
