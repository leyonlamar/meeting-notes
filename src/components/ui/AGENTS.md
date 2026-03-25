<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# UI Components

## Purpose
Base UI primitives used throughout the app. Theme-aware via CSS custom variables, styled with Tailwind utilities and inline `style` props.

## Key Files
| File | Description |
|------|-------------|
| `Button.tsx` | Multi-variant button (primary/secondary/ghost/danger/gold) with gradient backgrounds |
| `Badge.tsx` | Status badge with color variants (default/success/warning/danger/tentative/info) |
| `Card.tsx` | Glass-morphism card container with optional header |
| `Tabs.tsx` | Tab navigation component with active state |
| `EmptyState.tsx` | Empty state placeholder with icon, title, description, and optional CTA |

## For AI Agents

### Working In This Directory
- All components accept `className` prop for composition
- Colors use CSS variables (e.g., `var(--ink-200)`, `var(--gold-400)`) for theme support
- Button uses inline `style` for gradient backgrounds — not Tailwind classes
- Badge uses inline `style` for rgba backgrounds with CSS variable text colors
- Variant pattern: `variant` prop with string union type, default value provided

### Common Patterns
```tsx
// Variant-based styling
interface Props { variant?: "primary" | "secondary"; }
// CSS variable colors via style prop
style={{ color: 'var(--ink-200)', background: 'var(--surface-card)' }}
// clsx for conditional Tailwind classes
className={clsx("base-classes", { "conditional": condition }, className)}
```

<!-- MANUAL: -->
