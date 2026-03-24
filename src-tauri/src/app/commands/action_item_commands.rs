use tauri::State;

use crate::app::state::AppState;
use crate::domain::action_item::*;
use crate::services::action_item_service::{ActionItemService, ActionItemStats};
use crate::utils::errors::AppError;

#[tauri::command]
pub fn create_action_item(state: State<'_, AppState>, req: CreateActionItemRequest) -> Result<ActionItem, AppError> {
    ActionItemService::create(&state.db, req)
}

#[tauri::command]
pub fn get_action_item(state: State<'_, AppState>, id: String) -> Result<ActionItem, AppError> {
    ActionItemService::get(&state.db, &id)
}

#[tauri::command]
pub fn update_action_item(state: State<'_, AppState>, req: UpdateActionItemRequest) -> Result<ActionItem, AppError> {
    ActionItemService::update(&state.db, req)
}

#[tauri::command]
pub fn delete_action_item(state: State<'_, AppState>, id: String) -> Result<(), AppError> {
    ActionItemService::delete(&state.db, &id)
}

#[tauri::command]
pub fn list_action_items(state: State<'_, AppState>, filter: ActionItemListFilter) -> Result<Vec<ActionItem>, AppError> {
    ActionItemService::list(&state.db, filter)
}

#[tauri::command]
pub fn get_action_item_stats(state: State<'_, AppState>) -> Result<ActionItemStats, AppError> {
    ActionItemService::get_stats(&state.db)
}
