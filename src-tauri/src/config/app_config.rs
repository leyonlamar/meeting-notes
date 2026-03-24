use crate::domain::settings::AppSettings;
use std::path::PathBuf;
use std::sync::RwLock;

/// Application configuration, loaded from disk and kept in memory
pub struct AppConfig {
    pub data_dir: PathBuf,
    pub db_path: PathBuf,
    pub settings: RwLock<AppSettings>,
}

impl AppConfig {
    pub fn new(data_dir: PathBuf) -> Self {
        let db_path = data_dir.join("db").join("meeting_notes.db");
        let config_path = data_dir.join("config").join("settings.json");

        let settings = if config_path.exists() {
            std::fs::read_to_string(&config_path)
                .ok()
                .and_then(|s| serde_json::from_str::<AppSettings>(&s).ok())
                .unwrap_or_default()
        } else {
            AppSettings::default()
        };

        let mut settings = settings;
        settings.data_directory = data_dir.to_string_lossy().to_string();
        settings.portable_mode = super::portable::is_portable_mode();

        Self {
            data_dir,
            db_path,
            settings: RwLock::new(settings),
        }
    }

    pub fn save_settings(&self) -> Result<(), std::io::Error> {
        let settings = self.settings.read().unwrap();
        let config_path = self.data_dir.join("config").join("settings.json");
        let json = serde_json::to_string_pretty(&*settings)
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;
        std::fs::write(config_path, json)
    }

    pub fn get_settings(&self) -> AppSettings {
        self.settings.read().unwrap().clone()
    }

    pub fn update_settings(&self, update: crate::domain::settings::UpdateSettingsRequest) {
        let mut settings = self.settings.write().unwrap();
        if let Some(v) = update.ai_provider { settings.ai_provider = v; }
        if let Some(v) = update.ai_endpoint { settings.ai_endpoint = Some(v); }
        if let Some(v) = update.ai_model { settings.ai_model = Some(v); }
        if let Some(v) = update.theme { settings.theme = v; }
        if let Some(v) = update.export_format { settings.export_format = v; }
        if let Some(v) = update.autosave_interval_secs { settings.autosave_interval_secs = v; }
    }
}
