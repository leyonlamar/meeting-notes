# Excel Integration Guide

## Action Item Export Shape

The Meeting Notes app exports action items in a flat tabular format designed for direct import into Excel or any spreadsheet tool.

### Field Reference

| Column | Type | Description | Excel Notes |
|--------|------|-------------|-------------|
| `id` | string | ULID unique identifier | Can be used as a primary key for VLOOKUP |
| `meeting_id` | string | Links to parent meeting | Foreign key for cross-sheet lookups |
| `title` | string | Action item title | Primary display column |
| `description` | string/null | Detailed description | May be empty |
| `owner` | string/null | Responsible person | Filter/pivot by this column |
| `due_date` | string/null | ISO date (YYYY-MM-DD) | Excel recognizes this format natively |
| `priority` | string | low/medium/high/critical | Use conditional formatting |
| `status` | string | open/in_progress/done/cancelled | Use data validation dropdown |
| `category` | string/null | Grouping category | Optional pivot field |
| `tags` | string | JSON array of strings | Use Text-to-Columns or parse with TEXTJOIN |
| `notes` | string/null | Additional notes | May be empty |
| `is_tentative` | boolean | AI confidence flag | true = needs human review |
| `confidence_score` | number/null | 0.0–1.0 AI confidence | Format as percentage |
| `source_snippet` | string/null | Original text this was extracted from | Traceability column |
| `created_at` | string | ISO timestamp | Excel datetime |
| `updated_at` | string | ISO timestamp | Excel datetime |

### Import Methods

**CSV Import:**
1. Export from app as CSV (Action Items page or Meeting Detail > Export tab)
2. In Excel: Data > From Text/CSV > select file
3. Delimiter: comma, encoding: UTF-8

**JSON Import (Power Query):**
1. Export from app as JSON
2. In Excel: Data > Get Data > From File > From JSON
3. Power Query will auto-detect the array structure
4. Each object becomes a row; nested arrays (tags) become text

### Bidirectional Sync (Future)

The data model is designed so that a future integration could:
1. Read this JSON/CSV into an Excel workbook
2. Allow edits in Excel (status changes, owner reassignment)
3. Write changes back to the app's SQLite database

Key design decisions enabling this:
- **Flat structure** — No nested objects except `tags` (JSON array, easily stringified)
- **Portable field names** — snake_case, no abbreviations, self-documenting
- **Stable IDs** — ULIDs survive round-trips and sort chronologically
- **ISO dates** — Excel-compatible without conversion
- **Null-safe** — All optional fields can be empty/null

### Sample Files

- `action_items_sample.csv` — Ready to open in Excel
- `action_items_sample.json` — Ready for Power Query import

Both files contain 6 sample action items including a tentative AI-extracted item (confidence 0.62) to demonstrate the full field set.
