use crate::db::connection::Database;
use crate::db::{meeting_repo, search_repo};
use crate::domain::meeting::*;
use crate::domain::minutes::*;
use crate::utils::errors::{AppError, AppResult};

pub struct MeetingService;

impl MeetingService {
    pub fn create_meeting(db: &Database, req: CreateMeetingRequest) -> AppResult<Meeting> {
        if req.title.trim().is_empty() {
            return Err(AppError::Validation("Meeting title cannot be empty".into()));
        }
        db.with_conn(|conn| meeting_repo::create_meeting(conn, &req))
            .map_err(AppError::from)
    }

    pub fn get_meeting(db: &Database, id: &str) -> AppResult<Meeting> {
        db.with_conn(|conn| meeting_repo::get_meeting(conn, id))
            .map_err(|e| match e {
                rusqlite::Error::QueryReturnedNoRows => AppError::NotFound(format!("Meeting {id} not found")),
                other => AppError::Database(other),
            })
    }

    pub fn update_meeting(db: &Database, req: UpdateMeetingRequest) -> AppResult<Meeting> {
        db.with_conn(|conn| meeting_repo::update_meeting(conn, &req))
            .map_err(AppError::from)
    }

    pub fn delete_meeting(db: &Database, id: &str) -> AppResult<()> {
        db.with_conn(|conn| meeting_repo::delete_meeting(conn, id))
            .map_err(AppError::from)
    }

    pub fn list_meetings(db: &Database, filter: MeetingListFilter) -> AppResult<Vec<MeetingSummary>> {
        db.with_conn(|conn| meeting_repo::list_meetings(conn, &filter))
            .map_err(AppError::from)
    }

    pub fn save_raw_note(db: &Database, req: SaveRawNoteRequest) -> AppResult<RawNote> {
        if req.content.trim().is_empty() {
            return Err(AppError::Validation("Note content cannot be empty".into()));
        }
        let note = db.with_conn(|conn| meeting_repo::save_raw_note(conn, &req))
            .map_err(AppError::from)?;

        // Update FTS index
        let _ = Self::reindex_meeting(db, &req.meeting_id);

        Ok(note)
    }

    pub fn get_raw_notes(db: &Database, meeting_id: &str) -> AppResult<Vec<RawNote>> {
        db.with_conn(|conn| meeting_repo::get_raw_notes(conn, meeting_id))
            .map_err(AppError::from)
    }

    pub fn save_processed_minutes(db: &Database, minutes: ProcessedMinutes) -> AppResult<()> {
        db.with_conn(|conn| meeting_repo::save_processed_minutes(conn, &minutes))
            .map_err(AppError::from)?;

        // Update FTS index
        let _ = Self::reindex_meeting(db, &minutes.meeting_id);

        Ok(())
    }

    pub fn get_latest_minutes(db: &Database, meeting_id: &str) -> AppResult<Option<ProcessedMinutes>> {
        db.with_conn(|conn| meeting_repo::get_latest_minutes(conn, meeting_id))
            .map_err(AppError::from)
    }

    pub fn get_decisions(db: &Database, meeting_id: &str) -> AppResult<Vec<Decision>> {
        db.with_conn(|conn| meeting_repo::get_decisions(conn, meeting_id))
            .map_err(AppError::from)
    }

    pub fn get_deliverables(db: &Database, meeting_id: &str) -> AppResult<Vec<Deliverable>> {
        db.with_conn(|conn| meeting_repo::get_deliverables(conn, meeting_id))
            .map_err(AppError::from)
    }

    pub fn get_risks_blockers(db: &Database, meeting_id: &str) -> AppResult<Vec<RiskOrBlocker>> {
        db.with_conn(|conn| meeting_repo::get_risks_blockers(conn, meeting_id))
            .map_err(AppError::from)
    }

    pub fn get_open_questions(db: &Database, meeting_id: &str) -> AppResult<Vec<OpenQuestion>> {
        db.with_conn(|conn| meeting_repo::get_open_questions(conn, meeting_id))
            .map_err(AppError::from)
    }

    pub fn search_meetings(db: &Database, query: &str, limit: i64) -> AppResult<Vec<MeetingSummary>> {
        db.with_conn(|conn| search_repo::search_meetings(conn, query, limit))
            .map_err(AppError::from)
    }

    fn reindex_meeting(db: &Database, meeting_id: &str) -> AppResult<()> {
        db.with_conn(|conn| {
            let meeting = meeting_repo::get_meeting(conn, meeting_id)?;
            let notes = meeting_repo::get_raw_notes(conn, meeting_id)?;
            let minutes = meeting_repo::get_latest_minutes(conn, meeting_id)?;

            let raw_content: String = notes.iter().map(|n| n.content.as_str()).collect::<Vec<_>>().join("\n");
            let minutes_content = minutes.and_then(|m| m.content_markdown).unwrap_or_default();

            meeting_repo::index_meeting_for_search(conn, meeting_id, &meeting.title, &raw_content, &minutes_content)
        }).map_err(AppError::from)
    }
}
