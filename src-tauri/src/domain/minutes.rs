use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessedMinutes {
    pub id: String,
    pub meeting_id: String,
    pub version: i32,
    pub executive_summary: Option<String>,
    pub key_discussion_points: Vec<String>,
    pub agenda: Option<String>,
    pub content_markdown: Option<String>,
    pub is_accepted: bool,
    pub ai_provider: Option<String>,
    pub ai_run_id: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Decision {
    pub id: String,
    pub meeting_id: String,
    pub content: String,
    pub rationale: Option<String>,
    pub decided_by: Option<String>,
    pub is_tentative: bool,
    pub confidence_score: Option<f64>,
    pub source_snippet: Option<String>,
    pub ai_run_id: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Deliverable {
    pub id: String,
    pub meeting_id: String,
    pub title: String,
    pub description: Option<String>,
    pub owner: Option<String>,
    pub due_date: Option<String>,
    pub is_tentative: bool,
    pub confidence_score: Option<f64>,
    pub source_snippet: Option<String>,
    pub ai_run_id: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RiskOrBlocker {
    pub id: String,
    pub meeting_id: String,
    pub content: String,
    pub risk_type: RiskType,
    pub severity: Option<String>,
    pub owner: Option<String>,
    pub is_tentative: bool,
    pub confidence_score: Option<f64>,
    pub source_snippet: Option<String>,
    pub ai_run_id: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum RiskType {
    Risk,
    Blocker,
    Dependency,
}

impl RiskType {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Risk => "risk",
            Self::Blocker => "blocker",
            Self::Dependency => "dependency",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "blocker" => Self::Blocker,
            "dependency" => Self::Dependency,
            _ => Self::Risk,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenQuestion {
    pub id: String,
    pub meeting_id: String,
    pub content: String,
    pub assigned_to: Option<String>,
    pub is_tentative: bool,
    pub confidence_score: Option<f64>,
    pub source_snippet: Option<String>,
    pub ai_run_id: Option<String>,
    pub created_at: String,
}
