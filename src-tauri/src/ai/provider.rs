use crate::ai::types::{AiRequest, AiResponse};
use crate::utils::errors::AppResult;

/// Trait for AI providers. Implementations must be Send + Sync for Tauri state.
pub trait AiProvider: Send + Sync {
    fn name(&self) -> &str;

    fn process(&self, request: &AiRequest) -> AppResult<AiResponse>;
}

/// Registry of available AI providers
pub struct AiProviderRegistry {
    providers: Vec<Box<dyn AiProvider>>,
    active_provider: String,
}

impl AiProviderRegistry {
    pub fn new() -> Self {
        Self {
            providers: Vec::new(),
            active_provider: "mock".to_string(),
        }
    }

    pub fn register(&mut self, provider: Box<dyn AiProvider>) {
        self.providers.push(provider);
    }

    pub fn set_active(&mut self, name: &str) {
        self.active_provider = name.to_string();
    }

    pub fn get_active(&self) -> Option<&dyn AiProvider> {
        self.providers
            .iter()
            .find(|p| p.name() == self.active_provider)
            .map(|p| p.as_ref())
    }

    pub fn list_providers(&self) -> Vec<String> {
        self.providers.iter().map(|p| p.name().to_string()).collect()
    }
}
