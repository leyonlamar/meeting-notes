use tauri::State;

use crate::app::state::AppState;
use crate::domain::action_item::ActionItemListFilter;
use crate::services::action_item_service::ActionItemService;
use crate::services::export_service::ExportService;
use crate::export::pdf;
use crate::utils::errors::AppError;

#[tauri::command]
pub fn export_minutes_markdown(state: State<'_, AppState>, meeting_id: String) -> Result<String, AppError> {
    ExportService::export_minutes_markdown(&state.db, &meeting_id)
}

#[tauri::command]
pub fn export_action_items_csv(state: State<'_, AppState>, meeting_id: Option<String>) -> Result<String, AppError> {
    let filter = ActionItemListFilter {
        meeting_id,
        include_done: Some(true),
        ..Default::default()
    };
    let items = ActionItemService::list(&state.db, filter)?;
    ExportService::export_action_items_csv(&items)
}

#[tauri::command]
pub fn export_action_items_json(state: State<'_, AppState>, meeting_id: Option<String>) -> Result<String, AppError> {
    let filter = ActionItemListFilter {
        meeting_id,
        include_done: Some(true),
        ..Default::default()
    };
    let items = ActionItemService::list(&state.db, filter)?;
    ExportService::export_action_items_json(&items)
}

#[tauri::command]
pub fn export_meeting_pdf(state: State<'_, AppState>, meeting_id: String) -> Result<Vec<u8>, AppError> {
    pdf::export_meeting_pdf(&state.db, &meeting_id)
}
