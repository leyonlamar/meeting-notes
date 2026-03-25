<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Styles

## Purpose
Global CSS with Tailwind CSS 4 integration, CSS custom properties for theming, and component-level utility classes.

## Key Files
| File | Description |
|------|-------------|
| `globals.css` | Tailwind import, Google Fonts (DM Sans + Instrument Serif), dark/light theme variables, utility classes |

## For AI Agents

### Working In This Directory
- Theme switching via `[data-theme="dark"]` / `[data-theme="light"]` selectors
- Color tokens: `--ink-*` (grayscale), `--gold-*` (accent), `--surface-*` (backgrounds), `--border-*`
- Semantic colors: `--emerald`, `--amber`, `--rose`, `--violet`, `--cyan`
- Fonts: DM Sans (body), Instrument Serif (display/numbers via `.font-display`)
- Custom classes: `.sidebar-item`, `.glass-card`, `.glow-gold`, `.stat-number`, `.noise-bg`, `.animate-in`
- The `@import url(...)` after `@import "tailwindcss"` triggers a CSS warning — cosmetic only, does not affect functionality
- Light theme inverts the ink scale (ink-950 becomes lightest)

<!-- MANUAL: -->
