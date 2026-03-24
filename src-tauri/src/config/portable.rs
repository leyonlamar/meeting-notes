use std::path::PathBuf;

/// Detect whether the app should run in portable mode.
///
/// Portable mode is active when either:
/// 1. A file named `portable` exists next to the executable
/// 2. A folder named `data` exists next to the executable
///
/// In portable mode, all data is stored in `<exe_dir>/data/`.
/// Otherwise, data is stored in `%APPDATA%/meeting-notes/`.
pub fn detect_data_directory() -> PathBuf {
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    let portable_marker = exe_dir.join("portable");
    let data_folder = exe_dir.join("data");

    if portable_marker.exists() || data_folder.exists() {
        log::info!("Portable mode detected at {:?}", exe_dir);
        data_folder
    } else {
        let app_data = dirs_next().unwrap_or_else(|| exe_dir.join("data"));
        log::info!("Standard mode, data at {:?}", app_data);
        app_data
    }
}

/// Get the standard Windows AppData path for this app
fn dirs_next() -> Option<PathBuf> {
    std::env::var("APPDATA")
        .ok()
        .map(|p| PathBuf::from(p).join("meeting-notes"))
}

pub fn is_portable_mode() -> bool {
    let exe_dir = std::env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .unwrap_or_else(|| PathBuf::from("."));

    exe_dir.join("portable").exists() || exe_dir.join("data").exists()
}

/// Ensure all required subdirectories exist within the data directory
pub fn ensure_data_dirs(data_dir: &PathBuf) -> std::io::Result<()> {
    std::fs::create_dir_all(data_dir.join("db"))?;
    std::fs::create_dir_all(data_dir.join("config"))?;
    std::fs::create_dir_all(data_dir.join("exports"))?;
    std::fs::create_dir_all(data_dir.join("logs"))?;
    Ok(())
}
