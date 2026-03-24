use serde::{Deserialize, Serialize};

/// Represents a single extraction result from an AI provider or rule-based parser.
/// Every extracted entity carries provenance and confidence metadata.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractionResult {
    pub extracted_text: String,
    pub normalized_value: Option<String>,
    pub confidence_score: f64,
    pub rationale_summary: Option<String>,
    pub source_snippet: Option<String>,
    pub source_offsets: Option<SourceOffsets>,
    pub is_tentative: bool,
    pub provider_name: String,
    pub extraction_type: ExtractionType,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceOffsets {
    pub start: usize,
    pub end: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ExtractionType {
    ActionItem,
    Decision,
    Deliverable,
    Risk,
    Blocker,
    OpenQuestion,
    NextStep,
    Attendee,
    Deadline,
    Owner,
}

/// Batch extraction response from an AI operation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractionBatch {
    pub run_id: String,
    pub meeting_id: String,
    pub provider_name: String,
    pub results: Vec<ExtractionResult>,
    pub processing_time_ms: u64,
}

/// AI processing run audit record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiProcessingRun {
    pub id: String,
    pub meeting_id: String,
    pub operation: String,
    pub provider_name: String,
    pub model_name: Option<String>,
    pub input_hash: Option<String>,
    pub status: String,
    pub error_message: Option<String>,
    pub duration_ms: Option<i64>,
    pub created_at: String,
}
