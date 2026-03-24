use tauri::State;

use crate::app::state::AppState;
use crate::ai::types::{AiRequest, AiResponse, AiOperation};
use crate::utils::errors::AppError;

#[tauri::command]
pub fn run_ai_operation(
    state: State<'_, AppState>,
    operation: String,
    input_text: String,
    meeting_id: String,
) -> Result<AiResponse, AppError> {
    let op = match operation.as_str() {
        "summarize_notes" => AiOperation::SummarizeNotes,
        "clean_notes" => AiOperation::CleanNotes,
        "generate_minutes" => AiOperation::GenerateMinutes,
        "extract_action_items" => AiOperation::ExtractActionItems,
        "extract_decisions" => AiOperation::ExtractDecisions,
        "extract_deliverables" => AiOperation::ExtractDeliverables,
        "extract_risks" => AiOperation::ExtractRisks,
        "extract_open_questions" => AiOperation::ExtractOpenQuestions,
        "extract_next_steps" => AiOperation::ExtractNextSteps,
        "extract_attendees" => AiOperation::ExtractAttendees,
        "extract_deadlines" => AiOperation::ExtractDeadlines,
        _ => return Err(AppError::Validation(format!("Unknown AI operation: {}", operation))),
    };

    let request = AiRequest {
        operation: op,
        input_text,
        meeting_id,
        context: None,
    };

    let registry = state.ai_registry.lock().unwrap();
    let provider = registry.get_active()
        .ok_or_else(|| AppError::AiProvider("No active AI provider configured".into()))?;

    provider.process(&request)
}

#[tauri::command]
pub fn list_ai_providers(state: State<'_, AppState>) -> Result<Vec<String>, AppError> {
    let registry = state.ai_registry.lock().unwrap();
    Ok(registry.list_providers())
}
