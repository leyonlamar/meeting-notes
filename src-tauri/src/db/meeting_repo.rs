use rusqlite::{params, Connection, Row};

use crate::domain::meeting::*;
use crate::domain::minutes::*;

fn now_iso() -> String {
    chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string()
}

fn new_id() -> String {
    ulid::Ulid::new().to_string()
}

// ── Meetings ──

pub fn create_meeting(conn: &Connection, req: &CreateMeetingRequest) -> Result<Meeting, rusqlite::Error> {
    let id = new_id();
    let now = now_iso();
    let tags_json = serde_json::to_string(&req.tags.clone().unwrap_or_default()).unwrap_or_else(|_| "[]".to_string());

    conn.execute(
        "INSERT INTO meetings (id, title, meeting_date, location, project, tags, status, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'draft', ?7, ?7)",
        params![id, req.title, req.meeting_date, req.location, req.project, tags_json, now],
    )?;

    get_meeting(conn, &id)
}

pub fn get_meeting(conn: &Connection, id: &str) -> Result<Meeting, rusqlite::Error> {
    conn.query_row(
        "SELECT id, title, meeting_date, location, project, tags, status, created_at, updated_at, deleted_at
         FROM meetings WHERE id = ?1 AND deleted_at IS NULL",
        [id],
        row_to_meeting,
    )
}

pub fn update_meeting(conn: &Connection, req: &UpdateMeetingRequest) -> Result<Meeting, rusqlite::Error> {
    let existing = get_meeting(conn, &req.id)?;
    let now = now_iso();

    let title = req.title.as_deref().unwrap_or(&existing.title);
    let meeting_date = req.meeting_date.as_deref().or(existing.meeting_date.as_deref());
    let location = req.location.as_deref().or(existing.location.as_deref());
    let project = req.project.as_deref().or(existing.project.as_deref());
    let status = req.status.as_deref().unwrap_or(existing.status.as_str());
    let tags = req.tags.as_ref().unwrap_or(&existing.tags);
    let tags_json = serde_json::to_string(tags).unwrap_or_else(|_| "[]".to_string());

    conn.execute(
        "UPDATE meetings SET title=?1, meeting_date=?2, location=?3, project=?4, tags=?5, status=?6, updated_at=?7
         WHERE id=?8",
        params![title, meeting_date, location, project, tags_json, status, now, req.id],
    )?;

    get_meeting(conn, &req.id)
}

pub fn delete_meeting(conn: &Connection, id: &str) -> Result<(), rusqlite::Error> {
    let now = now_iso();
    conn.execute(
        "UPDATE meetings SET deleted_at = ?1, updated_at = ?1 WHERE id = ?2",
        params![now, id],
    )?;
    Ok(())
}

pub fn list_meetings(conn: &Connection, filter: &MeetingListFilter) -> Result<Vec<MeetingSummary>, rusqlite::Error> {
    let mut sql = String::from(
        "SELECT m.id, m.title, m.meeting_date, m.project, m.status, m.tags, m.created_at,
                (SELECT COUNT(*) FROM action_items a WHERE a.meeting_id = m.id AND a.deleted_at IS NULL) as action_count
         FROM meetings m
         WHERE m.deleted_at IS NULL"
    );
    let mut param_values: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut param_idx = 1;

    if let Some(ref status) = filter.status {
        sql.push_str(&format!(" AND m.status = ?{}", param_idx));
        param_values.push(Box::new(status.clone()));
        param_idx += 1;
    }
    if let Some(ref project) = filter.project {
        sql.push_str(&format!(" AND m.project = ?{}", param_idx));
        param_values.push(Box::new(project.clone()));
        param_idx += 1;
    }
    if let Some(ref from_date) = filter.from_date {
        sql.push_str(&format!(" AND m.meeting_date >= ?{}", param_idx));
        param_values.push(Box::new(from_date.clone()));
        param_idx += 1;
    }
    if let Some(ref to_date) = filter.to_date {
        sql.push_str(&format!(" AND m.meeting_date <= ?{}", param_idx));
        param_values.push(Box::new(to_date.clone()));
        param_idx += 1;
    }

    sql.push_str(" ORDER BY m.created_at DESC");

    if let Some(limit) = filter.limit {
        sql.push_str(&format!(" LIMIT ?{}", param_idx));
        param_values.push(Box::new(limit));
        param_idx += 1;
    }
    if let Some(offset) = filter.offset {
        sql.push_str(&format!(" OFFSET ?{}", param_idx));
        param_values.push(Box::new(offset));
    }

    let params_refs: Vec<&dyn rusqlite::types::ToSql> = param_values.iter().map(|p| p.as_ref()).collect();
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params_refs.as_slice(), |row| {
        let tags_str: String = row.get(5)?;
        let tags: Vec<String> = serde_json::from_str(&tags_str).unwrap_or_default();
        Ok(MeetingSummary {
            id: row.get(0)?,
            title: row.get(1)?,
            meeting_date: row.get(2)?,
            project: row.get(3)?,
            status: row.get(4)?,
            tags,
            action_item_count: row.get(6)?,
            created_at: row.get(7)?,
        })
    })?;

    rows.collect()
}

fn row_to_meeting(row: &Row<'_>) -> Result<Meeting, rusqlite::Error> {
    let tags_str: String = row.get(5)?;
    let tags: Vec<String> = serde_json::from_str(&tags_str).unwrap_or_default();
    let status_str: String = row.get(6)?;

    Ok(Meeting {
        id: row.get(0)?,
        title: row.get(1)?,
        meeting_date: row.get(2)?,
        location: row.get(3)?,
        project: row.get(4)?,
        tags,
        status: MeetingStatus::from_str(&status_str),
        created_at: row.get(7)?,
        updated_at: row.get(8)?,
        deleted_at: row.get(9)?,
    })
}

// ── Raw Notes ──

pub fn save_raw_note(conn: &Connection, req: &SaveRawNoteRequest) -> Result<RawNote, rusqlite::Error> {
    let id = new_id();
    let now = now_iso();
    let source_type = req.source_type.as_deref().unwrap_or("manual");

    conn.execute(
        "INSERT INTO raw_notes (id, meeting_id, content, source_type, source_filename, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![id, req.meeting_id, req.content, source_type, req.source_filename, now],
    )?;

    Ok(RawNote {
        id,
        meeting_id: req.meeting_id.clone(),
        content: req.content.clone(),
        source_type: NoteSourceType::from_str(source_type),
        source_filename: req.source_filename.clone(),
        created_at: now,
    })
}

pub fn get_raw_notes(conn: &Connection, meeting_id: &str) -> Result<Vec<RawNote>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, meeting_id, content, source_type, source_filename, created_at
         FROM raw_notes WHERE meeting_id = ?1 ORDER BY created_at ASC"
    )?;

    let rows = stmt.query_map([meeting_id], |row| {
        let source_str: String = row.get(3)?;
        Ok(RawNote {
            id: row.get(0)?,
            meeting_id: row.get(1)?,
            content: row.get(2)?,
            source_type: NoteSourceType::from_str(&source_str),
            source_filename: row.get(4)?,
            created_at: row.get(5)?,
        })
    })?;

    rows.collect()
}

// ── Processed Minutes ──

pub fn save_processed_minutes(conn: &Connection, minutes: &ProcessedMinutes) -> Result<(), rusqlite::Error> {
    let points_json = serde_json::to_string(&minutes.key_discussion_points).unwrap_or_else(|_| "[]".to_string());

    conn.execute(
        "INSERT INTO processed_minutes (id, meeting_id, version, executive_summary, key_discussion_points, agenda, content_markdown, is_accepted, ai_provider, ai_run_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            minutes.id, minutes.meeting_id, minutes.version,
            minutes.executive_summary, points_json, minutes.agenda,
            minutes.content_markdown, minutes.is_accepted as i32,
            minutes.ai_provider, minutes.ai_run_id, minutes.created_at
        ],
    )?;
    Ok(())
}

pub fn get_latest_minutes(conn: &Connection, meeting_id: &str) -> Result<Option<ProcessedMinutes>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, meeting_id, version, executive_summary, key_discussion_points, agenda, content_markdown, is_accepted, ai_provider, ai_run_id, created_at
         FROM processed_minutes WHERE meeting_id = ?1 ORDER BY version DESC LIMIT 1"
    )?;

    let mut rows = stmt.query_map([meeting_id], |row| {
        let points_str: String = row.get::<_, Option<String>>(4)?.unwrap_or_else(|| "[]".to_string());
        let points: Vec<String> = serde_json::from_str(&points_str).unwrap_or_default();
        Ok(ProcessedMinutes {
            id: row.get(0)?,
            meeting_id: row.get(1)?,
            version: row.get(2)?,
            executive_summary: row.get(3)?,
            key_discussion_points: points,
            agenda: row.get(5)?,
            content_markdown: row.get(6)?,
            is_accepted: row.get::<_, i32>(7)? != 0,
            ai_provider: row.get(8)?,
            ai_run_id: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;

    match rows.next() {
        Some(Ok(m)) => Ok(Some(m)),
        Some(Err(e)) => Err(e),
        None => Ok(None),
    }
}

// ── Decisions ──

pub fn save_decision(conn: &Connection, d: &Decision) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO decisions (id, meeting_id, content, rationale, decided_by, is_tentative, confidence_score, source_snippet, ai_run_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![d.id, d.meeting_id, d.content, d.rationale, d.decided_by, d.is_tentative as i32, d.confidence_score, d.source_snippet, d.ai_run_id, d.created_at],
    )?;
    Ok(())
}

pub fn get_decisions(conn: &Connection, meeting_id: &str) -> Result<Vec<Decision>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, meeting_id, content, rationale, decided_by, is_tentative, confidence_score, source_snippet, ai_run_id, created_at
         FROM decisions WHERE meeting_id = ?1 ORDER BY created_at ASC"
    )?;

    let rows = stmt.query_map([meeting_id], |row| {
        Ok(Decision {
            id: row.get(0)?,
            meeting_id: row.get(1)?,
            content: row.get(2)?,
            rationale: row.get(3)?,
            decided_by: row.get(4)?,
            is_tentative: row.get::<_, i32>(5)? != 0,
            confidence_score: row.get(6)?,
            source_snippet: row.get(7)?,
            ai_run_id: row.get(8)?,
            created_at: row.get(9)?,
        })
    })?;

    rows.collect()
}

// ── Deliverables ──

pub fn save_deliverable(conn: &Connection, d: &Deliverable) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO deliverables (id, meeting_id, title, description, owner, due_date, is_tentative, confidence_score, source_snippet, ai_run_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![d.id, d.meeting_id, d.title, d.description, d.owner, d.due_date, d.is_tentative as i32, d.confidence_score, d.source_snippet, d.ai_run_id, d.created_at],
    )?;
    Ok(())
}

pub fn get_deliverables(conn: &Connection, meeting_id: &str) -> Result<Vec<Deliverable>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, meeting_id, title, description, owner, due_date, is_tentative, confidence_score, source_snippet, ai_run_id, created_at
         FROM deliverables WHERE meeting_id = ?1 ORDER BY created_at ASC"
    )?;

    let rows = stmt.query_map([meeting_id], |row| {
        Ok(Deliverable {
            id: row.get(0)?,
            meeting_id: row.get(1)?,
            title: row.get(2)?,
            description: row.get(3)?,
            owner: row.get(4)?,
            due_date: row.get(5)?,
            is_tentative: row.get::<_, i32>(6)? != 0,
            confidence_score: row.get(7)?,
            source_snippet: row.get(8)?,
            ai_run_id: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;

    rows.collect()
}

// ── Risks & Blockers ──

pub fn save_risk_blocker(conn: &Connection, r: &RiskOrBlocker) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO risks_blockers (id, meeting_id, content, risk_type, severity, owner, is_tentative, confidence_score, source_snippet, ai_run_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![r.id, r.meeting_id, r.content, r.risk_type.as_str(), r.severity, r.owner, r.is_tentative as i32, r.confidence_score, r.source_snippet, r.ai_run_id, r.created_at],
    )?;
    Ok(())
}

pub fn get_risks_blockers(conn: &Connection, meeting_id: &str) -> Result<Vec<RiskOrBlocker>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, meeting_id, content, risk_type, severity, owner, is_tentative, confidence_score, source_snippet, ai_run_id, created_at
         FROM risks_blockers WHERE meeting_id = ?1 ORDER BY created_at ASC"
    )?;

    let rows = stmt.query_map([meeting_id], |row| {
        let rt: String = row.get(3)?;
        Ok(RiskOrBlocker {
            id: row.get(0)?,
            meeting_id: row.get(1)?,
            content: row.get(2)?,
            risk_type: RiskType::from_str(&rt),
            severity: row.get(4)?,
            owner: row.get(5)?,
            is_tentative: row.get::<_, i32>(6)? != 0,
            confidence_score: row.get(7)?,
            source_snippet: row.get(8)?,
            ai_run_id: row.get(9)?,
            created_at: row.get(10)?,
        })
    })?;

    rows.collect()
}

// ── Open Questions ──

pub fn save_open_question(conn: &Connection, q: &OpenQuestion) -> Result<(), rusqlite::Error> {
    conn.execute(
        "INSERT INTO open_questions (id, meeting_id, content, assigned_to, is_tentative, confidence_score, source_snippet, ai_run_id, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![q.id, q.meeting_id, q.content, q.assigned_to, q.is_tentative as i32, q.confidence_score, q.source_snippet, q.ai_run_id, q.created_at],
    )?;
    Ok(())
}

pub fn get_open_questions(conn: &Connection, meeting_id: &str) -> Result<Vec<OpenQuestion>, rusqlite::Error> {
    let mut stmt = conn.prepare(
        "SELECT id, meeting_id, content, assigned_to, is_tentative, confidence_score, source_snippet, ai_run_id, created_at
         FROM open_questions WHERE meeting_id = ?1 ORDER BY created_at ASC"
    )?;

    let rows = stmt.query_map([meeting_id], |row| {
        Ok(OpenQuestion {
            id: row.get(0)?,
            meeting_id: row.get(1)?,
            content: row.get(2)?,
            assigned_to: row.get(3)?,
            is_tentative: row.get::<_, i32>(4)? != 0,
            confidence_score: row.get(5)?,
            source_snippet: row.get(6)?,
            ai_run_id: row.get(7)?,
            created_at: row.get(8)?,
        })
    })?;

    rows.collect()
}

// ── FTS5 Indexing ──

pub fn index_meeting_for_search(conn: &Connection, meeting_id: &str, title: &str, raw_content: &str, minutes_content: &str) -> Result<(), rusqlite::Error> {
    // Remove old entry first
    conn.execute(
        "DELETE FROM meetings_fts WHERE meeting_id = ?1",
        [meeting_id],
    )?;

    conn.execute(
        "INSERT INTO meetings_fts (meeting_id, title, raw_content, minutes_content) VALUES (?1, ?2, ?3, ?4)",
        params![meeting_id, title, raw_content, minutes_content],
    )?;

    Ok(())
}
