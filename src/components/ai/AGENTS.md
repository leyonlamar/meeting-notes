<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# AI Components

## Purpose
Human-in-the-loop review interface for AI-extracted entities (action items, decisions, deliverables, risks, open questions).

## Key Files
| File | Description |
|------|-------------|
| `ExtractionReview.tsx` | Review panel showing AI extraction results with accept/reject/edit controls per item |

## For AI Agents

### Working In This Directory
- Displays `AiExtractedItem[]` from AI operations
- Each item shows: extracted text, confidence score, tentative flag, source snippet
- Users can accept (commits to DB), reject (discards), or edit before accepting
- Confidence threshold visualization (high/medium/low)
- Connected to `api.runAiOperation()` for triggering extractions

<!-- MANUAL: -->
