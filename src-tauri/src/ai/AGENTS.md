<!-- Parent: ../AGENTS.md -->
<!-- Generated: 2026-03-24 -->

# AI Module

## Purpose
AI provider abstraction with trait-based polymorphism. Supports mock provider (dev/demo) and OpenAI-compatible API (Ollama, LM Studio, OpenAI).

## Key Files
| File | Description |
|------|-------------|
| `mod.rs` | Re-exports provider trait, types, and implementations |
| `provider.rs` | `AiProvider` trait with `async fn process(&self, request: AiRequest) -> Result<AiResponse>` |
| `types.rs` | `AiOperation` enum (11 operations), `AiRequest`, `AiResponse`, `AiExtractedItem` |
| `mock_provider.rs` | `MockProvider` returning realistic sample data — default when no API configured |
| `openai_provider.rs` | `OpenAiCompatibleProvider` using reqwest to call OpenAI-compatible chat/completions endpoint |

## For AI Agents

### Working In This Directory
- New AI operations: add variant to `AiOperation` enum + `as_str()` match arm
- `AiProvider` is `Send + Sync` for thread safety (stored as `Arc<dyn AiProvider>`)
- MockProvider generates realistic but deterministic sample data — great for testing
- OpenAI provider sends structured prompts and parses JSON responses
- API keys retrieved from keyring at request time, never cached in memory
- Operations: summarize_notes, clean_notes, generate_minutes, extract_action_items, extract_decisions, extract_deliverables, extract_risks, extract_open_questions, extract_next_steps, extract_attendees, extract_deadlines

<!-- MANUAL: -->
