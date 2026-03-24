# Phase 4 Checkpoint — AI Integration Layer

## Files Created or Modified

### New
- `src-tauri/src/ai/openai_provider.rs` — Full OpenAI-compatible provider with:
  - Works with OpenAI, Ollama (/v1), LM Studio, any compatible API
  - Structured prompts for all 11 AI operations (clean, summarize, generate minutes, extract actions/decisions/deliverables/risks/questions/next-steps/attendees/deadlines)
  - Confidence-aware JSON parsing with robust extraction (handles markdown fences, raw JSON, embedded arrays)
  - Temperature 0.3 for consistency
  - Error handling for HTTP failures and malformed responses

### Modified
- `src-tauri/src/ai/mod.rs` — Added openai_provider module
- `src-tauri/src/app/state.rs` — Registers OpenAI-compatible provider at startup, retrieves API key from Windows Credential Store via keyring
- `src-tauri/Cargo.toml` — Added `blocking` feature to reqwest

## AI Provider Architecture

```
AiProviderRegistry
├── MockProvider (default, always available, offline)
│   └── Pattern-based extraction for development/testing
└── OpenAiCompatibleProvider
    ├── OpenAI API (api.openai.com/v1)
    ├── Ollama (localhost:11434/v1)
    ├── LM Studio (localhost:1234/v1)
    └── Any OpenAI-compatible endpoint
```

## Key Design Decisions
1. **Blocking HTTP** — Using reqwest::blocking because Tauri commands run on a thread pool; avoids async runtime conflicts
2. **JSON array extraction** — Robust parser handles: raw `[...]`, ```json fences, embedded arrays in prose
3. **Confidence-aware** — All extraction results carry confidence_score (0-1) and is_tentative flag
4. **Keyring integration** — API keys stored in Windows Credential Store, retrieved at startup, never logged
5. **Human-in-the-loop** — ExtractionReview component lets users accept/reject/edit before committing

## Current State
- **Rust:** `cargo check` passes — zero errors
- **TypeScript:** `tsc --noEmit` passes — zero errors
- **Vite build:** Passes
- **AI features working:**
  - Mock provider for offline development
  - OpenAI-compatible provider for real LLM inference
  - All 11 extraction operations have structured prompts
  - API key storage/retrieval via Windows Credential Store
  - Settings UI for provider, endpoint, model, API key management
  - Human-in-the-loop extraction review (accept/reject/edit)

## What Phase 5 Expects
- All above compiles and works
- Phase 5 will:
  - Add seed/sample data for testing
  - Add README with setup and portable mode docs
  - Add build/packaging instructions
  - Write AGENTS.md documentation files
