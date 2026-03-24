use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AiOperation {
    SummarizeNotes,
    CleanNotes,
    GenerateMinutes,
    ExtractActionItems,
    ExtractDecisions,
    ExtractDeliverables,
    ExtractRisks,
    ExtractOpenQuestions,
    ExtractNextSteps,
    ExtractAttendees,
    ExtractDeadlines,
}

impl AiOperation {
    pub fn as_str(&self) -> &str {
        match self {
            Self::SummarizeNotes => "summarize_notes",
            Self::CleanNotes => "clean_notes",
            Self::GenerateMinutes => "generate_minutes",
            Self::ExtractActionItems => "extract_action_items",
            Self::ExtractDecisions => "extract_decisions",
            Self::ExtractDeliverables => "extract_deliverables",
            Self::ExtractRisks => "extract_risks",
            Self::ExtractOpenQuestions => "extract_open_questions",
            Self::ExtractNextSteps => "extract_next_steps",
            Self::ExtractAttendees => "extract_attendees",
            Self::ExtractDeadlines => "extract_deadlines",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiRequest {
    pub operation: AiOperation,
    pub input_text: String,
    pub meeting_id: String,
    pub context: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiResponse {
    pub provider_name: String,
    pub model_name: Option<String>,
    pub operation: String,
    pub text_result: Option<String>,
    pub structured_results: Vec<AiExtractedItem>,
    pub processing_time_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiExtractedItem {
    pub extracted_text: String,
    pub normalized_value: Option<String>,
    pub item_type: String,
    pub confidence_score: f64,
    pub is_tentative: bool,
    pub rationale: Option<String>,
    pub source_snippet: Option<String>,
    pub owner: Option<String>,
    pub due_date: Option<String>,
    pub priority: Option<String>,
}
