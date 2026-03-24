use rusqlite::{params, Connection};

use crate::domain::meeting::MeetingSummary;

/// Full-text search across meetings using FTS5
pub fn search_meetings(conn: &Connection, query: &str, limit: i64) -> Result<Vec<MeetingSummary>, rusqlite::Error> {
    if query.trim().is_empty() {
        return Ok(Vec::new());
    }

    // Escape FTS5 special characters and add prefix matching
    let fts_query = sanitize_fts_query(query);

    let mut stmt = conn.prepare(
        "SELECT m.id, m.title, m.meeting_date, m.project, m.status, m.tags, m.created_at,
                (SELECT COUNT(*) FROM action_items a WHERE a.meeting_id = m.id AND a.deleted_at IS NULL) as action_count
         FROM meetings_fts f
         JOIN meetings m ON m.id = f.meeting_id
         WHERE meetings_fts MATCH ?1 AND m.deleted_at IS NULL
         ORDER BY rank
         LIMIT ?2"
    )?;

    let rows = stmt.query_map(params![fts_query, limit], |row| {
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

/// Sanitize user input for FTS5 query safety.
/// Wraps each word in quotes and adds * for prefix matching.
fn sanitize_fts_query(input: &str) -> String {
    input
        .split_whitespace()
        .filter(|w| !w.is_empty())
        .map(|word| {
            let clean: String = word.chars().filter(|c| c.is_alphanumeric() || *c == '-' || *c == '_').collect();
            if clean.is_empty() {
                String::new()
            } else {
                format!("\"{}\"*", clean)
            }
        })
        .filter(|s| !s.is_empty())
        .collect::<Vec<_>>()
        .join(" ")
}
