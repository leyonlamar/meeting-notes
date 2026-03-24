use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Meeting {
    pub id: String,
    pub title: String,
    pub meeting_date: Option<String>,
    pub location: Option<String>,
    pub project: Option<String>,
    pub tags: Vec<String>,
    pub status: MeetingStatus,
    pub created_at: String,
    pub updated_at: String,
    pub deleted_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum MeetingStatus {
    Draft,
    Processing,
    Complete,
    Archived,
}

impl Default for MeetingStatus {
    fn default() -> Self {
        Self::Draft
    }
}

impl MeetingStatus {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Draft => "draft",
            Self::Processing => "processing",
            Self::Complete => "complete",
            Self::Archived => "archived",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "processing" => Self::Processing,
            "complete" => Self::Complete,
            "archived" => Self::Archived,
            _ => Self::Draft,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MeetingParticipant {
    pub id: String,
    pub meeting_id: String,
    pub name: String,
    pub role: Option<String>,
    pub email: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RawNote {
    pub id: String,
    pub meeting_id: String,
    pub content: String,
    pub source_type: NoteSourceType,
    pub source_filename: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum NoteSourceType {
    Manual,
    Paste,
    Import,
}

impl NoteSourceType {
    pub fn as_str(&self) -> &str {
        match self {
            Self::Manual => "manual",
            Self::Paste => "paste",
            Self::Import => "import",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "paste" => Self::Paste,
            "import" => Self::Import,
            _ => Self::Manual,
        }
    }
}

// DTOs for frontend-backend communication

#[derive(Debug, Deserialize)]
pub struct CreateMeetingRequest {
    pub title: String,
    pub meeting_date: Option<String>,
    pub location: Option<String>,
    pub project: Option<String>,
    pub tags: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateMeetingRequest {
    pub id: String,
    pub title: Option<String>,
    pub meeting_date: Option<String>,
    pub location: Option<String>,
    pub project: Option<String>,
    pub tags: Option<Vec<String>>,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct SaveRawNoteRequest {
    pub meeting_id: String,
    pub content: String,
    pub source_type: Option<String>,
    pub source_filename: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct MeetingSummary {
    pub id: String,
    pub title: String,
    pub meeting_date: Option<String>,
    pub project: Option<String>,
    pub status: String,
    pub tags: Vec<String>,
    pub action_item_count: i64,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct MeetingListFilter {
    pub search: Option<String>,
    pub status: Option<String>,
    pub project: Option<String>,
    pub tag: Option<String>,
    pub from_date: Option<String>,
    pub to_date: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}
