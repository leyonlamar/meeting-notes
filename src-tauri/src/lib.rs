pub mod app;
pub mod domain;
pub mod services;
pub mod db;
pub mod ai;
pub mod export;
pub mod config;
pub mod utils;

use app::commands::*;
use app::state::AppState;
use config::portable;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();

    let data_dir = portable::detect_data_directory();
    if let Err(e) = portable::ensure_data_dirs(&data_dir) {
        eprintln!("Failed to create data directories: {}", e);
        std::process::exit(1);
    }

    let config = config::app_config::AppConfig::new(data_dir);
    let state = AppState::init(config).expect("Failed to initialize application state");

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            // Meetings
            meeting_commands::create_meeting,
            meeting_commands::get_meeting,
            meeting_commands::update_meeting,
            meeting_commands::delete_meeting,
            meeting_commands::list_meetings,
            meeting_commands::save_raw_note,
            meeting_commands::get_raw_notes,
            meeting_commands::get_latest_minutes,
            meeting_commands::get_decisions,
            meeting_commands::get_deliverables,
            meeting_commands::get_risks_blockers,
            meeting_commands::get_open_questions,
            // Action Items
            action_item_commands::create_action_item,
            action_item_commands::get_action_item,
            action_item_commands::update_action_item,
            action_item_commands::delete_action_item,
            action_item_commands::list_action_items,
            action_item_commands::get_action_item_stats,
            // Search
            search_commands::search_meetings,
            // Export
            export_commands::export_minutes_markdown,
            export_commands::export_action_items_csv,
            export_commands::export_action_items_json,
            export_commands::export_meeting_pdf,
            // AI
            ai_commands::run_ai_operation,
            ai_commands::list_ai_providers,
            // Settings
            settings_commands::get_settings,
            settings_commands::update_settings,
            settings_commands::store_api_key,
            settings_commands::has_api_key,
            settings_commands::delete_api_key,
            // Dev
            seed_commands::seed_sample_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
