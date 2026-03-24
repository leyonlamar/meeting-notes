use tauri::State;

use crate::app::state::AppState;
use crate::domain::meeting::*;
use crate::domain::minutes::*;
use crate::services::meeting_service::MeetingService;
use crate::utils::errors::AppError;

#[tauri::command]
pub fn create_meeting(state: State<'_, AppState>, req: CreateMeetingRequest) -> Result<Meeting, AppError> {
    MeetingService::create_meeting(&state.db, req)
}

#[tauri::command]
pub fn get_meeting(state: State<'_, AppState>, id: String) -> Result<Meeting, AppError> {
    MeetingService::get_meeting(&state.db, &id)
}

#[tauri::command]
pub fn update_meeting(state: State<'_, AppState>, req: UpdateMeetingRequest) -> Result<Meeting, AppError> {
    MeetingService::update_meeting(&state.db, req)
}

#[tauri::command]
pub fn delete_meeting(state: State<'_, AppState>, id: String) -> Result<(), AppError> {
    MeetingService::delete_meeting(&state.db, &id)
}

#[tauri::command]
pub fn list_meetings(state: State<'_, AppState>, filter: MeetingListFilter) -> Result<Vec<MeetingSummary>, AppError> {
    MeetingService::list_meetings(&state.db, filter)
}

#[tauri::command]
pub fn save_raw_note(state: State<'_, AppState>, req: SaveRawNoteRequest) -> Result<RawNote, AppError> {
    MeetingService::save_raw_note(&state.db, req)
}

#[tauri::command]
pub fn get_raw_notes(state: State<'_, AppState>, meeting_id: String) -> Result<Vec<RawNote>, AppError> {
    MeetingService::get_raw_notes(&state.db, &meeting_id)
}

#[tauri::command]
pub fn get_latest_minutes(state: State<'_, AppState>, meeting_id: String) -> Result<Option<ProcessedMinutes>, AppError> {
    MeetingService::get_latest_minutes(&state.db, &meeting_id)
}

#[tauri::command]
pub fn get_decisions(state: State<'_, AppState>, meeting_id: String) -> Result<Vec<Decision>, AppError> {
    MeetingService::get_decisions(&state.db, &meeting_id)
}

#[tauri::command]
pub fn get_deliverables(state: State<'_, AppState>, meeting_id: String) -> Result<Vec<Deliverable>, AppError> {
    MeetingService::get_deliverables(&state.db, &meeting_id)
}

#[tauri::command]
pub fn get_risks_blockers(state: State<'_, AppState>, meeting_id: String) -> Result<Vec<RiskOrBlocker>, AppError> {
    MeetingService::get_risks_blockers(&state.db, &meeting_id)
}

#[tauri::command]
pub fn get_open_questions(state: State<'_, AppState>, meeting_id: String) -> Result<Vec<OpenQuestion>, AppError> {
    MeetingService::get_open_questions(&state.db, &meeting_id)
}
