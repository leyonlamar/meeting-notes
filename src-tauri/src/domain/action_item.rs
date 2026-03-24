use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActionItem {
    pub id: String,
    pub meeting_id: String,
    pub title: String,
    pub description: Option<String>,
    pub owner: Option<String>,
    pub due_date: Option<String>,
    pub priority: Priority,
    pub status: ActionStatus,
    pub category: Option<String>,
    pub tags: Vec<String>,
    pub notes: Option<String>,
    pub is_tentative: bool,
    pub confidence_score: Option<f64>,
    pub source_snippet: Option<String>,
    pub source_offsets: Option<String>,
    pub ai_provider: Option<String>,
    pub ai_run_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum Priority {
    Low,
    Medium,
    High,
    Critical,
}

impl Priority {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Low => "low",
            Self::Medium => "medium",
            Self::High => "high",
            Self::Critical => "critical",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "low" => Self::Low,
            "high" => Self::High,
            "critical" => Self::Critical,
            _ => Self::Medium,
        }
    }
}

impl Default for Priority {
    fn default() -> Self {
        Self::Medium
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ActionStatus {
    Open,
    InProgress,
    Done,
    Cancelled,
}

impl ActionStatus {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Open => "open",
            Self::InProgress => "in_progress",
            Self::Done => "done",
            Self::Cancelled => "cancelled",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "in_progress" => Self::InProgress,
            "done" => Self::Done,
            "cancelled" => Self::Cancelled,
            _ => Self::Open,
        }
    }
}

impl Default for ActionStatus {
    fn default() -> Self {
        Self::Open
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateActionItemRequest {
    pub meeting_id: String,
    pub title: String,
    pub description: Option<String>,
    pub owner: Option<String>,
    pub due_date: Option<String>,
    pub priority: Option<String>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
    pub is_tentative: Option<bool>,
    pub confidence_score: Option<f64>,
    pub source_snippet: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateActionItemRequest {
    pub id: String,
    pub title: Option<String>,
    pub description: Option<String>,
    pub owner: Option<String>,
    pub due_date: Option<String>,
    pub priority: Option<String>,
    pub status: Option<String>,
    pub category: Option<String>,
    pub tags: Option<Vec<String>>,
    pub notes: Option<String>,
    pub is_tentative: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct ActionItemListFilter {
    pub meeting_id: Option<String>,
    pub owner: Option<String>,
    pub status: Option<String>,
    pub priority: Option<String>,
    pub due_before: Option<String>,
    pub due_after: Option<String>,
    pub search: Option<String>,
    pub include_done: Option<bool>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}
