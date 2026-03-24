use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("AI provider error: {0}")]
    AiProvider(String),

    #[error("Export error: {0}")]
    Export(String),

    #[error("Config error: {0}")]
    Config(String),

    #[error("Keyring error: {0}")]
    Keyring(String),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("{0}")]
    Internal(String),
}

// Tauri commands require serializable errors
impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        #[derive(Serialize)]
        struct ErrorResponse {
            error: String,
            code: String,
        }

        let (code, error) = match self {
            AppError::Database(e) => ("DATABASE_ERROR".to_string(), e.to_string()),
            AppError::NotFound(msg) => ("NOT_FOUND".to_string(), msg.clone()),
            AppError::Validation(msg) => ("VALIDATION_ERROR".to_string(), msg.clone()),
            AppError::AiProvider(msg) => ("AI_PROVIDER_ERROR".to_string(), msg.clone()),
            AppError::Export(msg) => ("EXPORT_ERROR".to_string(), msg.clone()),
            AppError::Config(msg) => ("CONFIG_ERROR".to_string(), msg.clone()),
            AppError::Keyring(msg) => ("KEYRING_ERROR".to_string(), msg.clone()),
            AppError::Io(e) => ("IO_ERROR".to_string(), e.to_string()),
            AppError::Internal(msg) => ("INTERNAL_ERROR".to_string(), msg.clone()),
        };

        ErrorResponse { error, code }.serialize(serializer)
    }
}

pub type AppResult<T> = Result<T, AppError>;
