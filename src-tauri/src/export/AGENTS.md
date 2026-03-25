<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# Export Module

## Purpose
Export functionality for meeting data in multiple formats.

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports from ExportService |
| `pdf.rs` | PDF generation using `printpdf` crate — renders meeting summary, minutes, and action items to PDF |

## For AI Agents

### Working In This Directory
- Main export logic lives in `services/export_service.rs` — this module provides PDF-specific rendering
- PDF uses `printpdf` (not a browser/HTML renderer) — limited formatting capabilities
- Export formats: Markdown (.md), CSV (.csv), JSON (.json), PDF (.pdf)

<!-- MANUAL: -->
