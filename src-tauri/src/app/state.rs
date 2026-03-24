use std::sync::Mutex;

use crate::ai::mock_provider::MockProvider;
use crate::ai::openai_provider::OpenAiCompatibleProvider;
use crate::ai::provider::AiProviderRegistry;
use crate::config::app_config::AppConfig;
use crate::db::connection::Database;

/// Central application state, managed by Tauri
pub struct AppState {
    pub db: Database,
    pub config: AppConfig,
    pub ai_registry: Mutex<AiProviderRegistry>,
}

impl AppState {
    pub fn init(config: AppConfig) -> Result<Self, Box<dyn std::error::Error>> {
        let db = Database::open(&config.db_path)?;

        let mut ai_registry = AiProviderRegistry::new();
        ai_registry.register(Box::new(MockProvider::new()));

        // Register OpenAI-compatible provider (works with Ollama, LM Studio, OpenAI)
        let settings = config.get_settings();
        let endpoint = settings.ai_endpoint.clone()
            .unwrap_or_else(|| "http://localhost:11434/v1".to_string());
        let model = settings.ai_model.clone()
            .unwrap_or_else(|| "llama3".to_string());

        // Try to retrieve API key from keyring (never log it)
        let api_key = retrieve_api_key("openai-compatible");

        ai_registry.register(Box::new(OpenAiCompatibleProvider::new(
            "openai-compatible".to_string(),
            endpoint,
            model,
            api_key,
        )));

        ai_registry.set_active(&settings.ai_provider);

        Ok(Self {
            db,
            config,
            ai_registry: Mutex::new(ai_registry),
        })
    }
}

/// Retrieve an API key from the Windows Credential Store.
/// Returns None if no key is stored — never panics, never logs the key.
fn retrieve_api_key(provider: &str) -> Option<String> {
    let service = format!("meeting-notes-{}", provider);
    let entry = keyring::Entry::new(&service, "api-key").ok()?;
    match entry.get_password() {
        Ok(key) => Some(key),
        Err(_) => None,
    }
}
