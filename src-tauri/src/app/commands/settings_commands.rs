use tauri::State;

use crate::app::state::AppState;
use crate::domain::settings::{AppSettings, UpdateSettingsRequest, StoreApiKeyRequest};
use crate::utils::errors::AppError;

#[tauri::command]
pub fn get_settings(state: State<'_, AppState>) -> Result<AppSettings, AppError> {
    Ok(state.config.get_settings())
}

#[tauri::command]
pub fn update_settings(state: State<'_, AppState>, req: UpdateSettingsRequest) -> Result<AppSettings, AppError> {
    state.config.update_settings(req);
    state.config.save_settings().map_err(|e| AppError::Config(e.to_string()))?;

    // Update active AI provider if changed
    let settings = state.config.get_settings();
    let mut registry = state.ai_registry.lock().unwrap();
    registry.set_active(&settings.ai_provider);

    Ok(settings)
}

#[tauri::command]
pub fn store_api_key(req: StoreApiKeyRequest) -> Result<(), AppError> {
    let service = format!("meeting-notes-{}", req.provider);
    let entry = keyring::Entry::new(&service, "api-key")
        .map_err(|e| AppError::Keyring(e.to_string()))?;
    entry.set_password(&req.api_key)
        .map_err(|e| AppError::Keyring(e.to_string()))?;
    Ok(())
}

#[tauri::command]
pub fn has_api_key(provider: String) -> Result<bool, AppError> {
    let service = format!("meeting-notes-{}", provider);
    let entry = keyring::Entry::new(&service, "api-key")
        .map_err(|e| AppError::Keyring(e.to_string()))?;
    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(keyring::Error::NoEntry) => Ok(false),
        Err(e) => Err(AppError::Keyring(e.to_string())),
    }
}

#[tauri::command]
pub fn delete_api_key(provider: String) -> Result<(), AppError> {
    let service = format!("meeting-notes-{}", provider);
    let entry = keyring::Entry::new(&service, "api-key")
        .map_err(|e| AppError::Keyring(e.to_string()))?;
    entry.delete_credential()
        .map_err(|e| AppError::Keyring(e.to_string()))?;
    Ok(())
}
