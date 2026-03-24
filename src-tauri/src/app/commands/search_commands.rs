use tauri::State;

use crate::app::state::AppState;
use crate::domain::meeting::MeetingSummary;
use crate::services::meeting_service::MeetingService;
use crate::utils::errors::AppError;

#[tauri::command]
pub fn search_meetings(state: State<'_, AppState>, query: String, limit: Option<i64>) -> Result<Vec<MeetingSummary>, AppError> {
    MeetingService::search_meetings(&state.db, &query, limit.unwrap_or(50))
}
