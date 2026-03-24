use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub ai_provider: String,
    pub ai_endpoint: Option<String>,
    pub ai_model: Option<String>,
    pub theme: String,
    pub export_format: String,
    pub autosave_interval_secs: u32,
    pub portable_mode: bool,
    pub data_directory: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            ai_provider: "mock".to_string(),
            ai_endpoint: None,
            ai_model: None,
            theme: "light".to_string(),
            export_format: "pdf".to_string(),
            autosave_interval_secs: 30,
            portable_mode: false,
            data_directory: String::new(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct UpdateSettingsRequest {
    pub ai_provider: Option<String>,
    pub ai_endpoint: Option<String>,
    pub ai_model: Option<String>,
    pub theme: Option<String>,
    pub export_format: Option<String>,
    pub autosave_interval_secs: Option<u32>,
}

/// Request to store an API key securely via keyring
#[derive(Debug, Deserialize)]
pub struct StoreApiKeyRequest {
    pub provider: String,
    pub api_key: String,
}
