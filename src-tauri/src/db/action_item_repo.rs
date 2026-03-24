use rusqlite::{params, Connection};

use crate::domain::action_item::*;

fn now_iso() -> String {
    chrono::Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string()
}

fn new_id() -> String {
    ulid::Ulid::new().to_string()
}

pub fn create_action_item(conn: &Connection, req: &CreateActionItemRequest) -> Result<ActionItem, rusqlite::Error> {
    let id = new_id();
    let now = now_iso();
    let priority = req.priority.as_deref().unwrap_or("medium");
    let tags_json = serde_json::to_string(&req.tags.clone().unwrap_or_default()).unwrap_or_else(|_| "[]".to_string());
    let is_tentative = req.is_tentative.unwrap_or(false);

    conn.execute(
        "INSERT INTO action_items (id, meeting_id, title, description, owner, due_date, priority, status, category, tags, notes, is_tentative, confidence_score, source_snippet, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'open', ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?14)",
        params![
            id, req.meeting_id, req.title, req.description, req.owner,
            req.due_date, priority, req.category, tags_json, req.notes,
            is_tentative as i32, req.confidence_score, req.source_snippet, now
        ],
    )?;

    get_action_item(conn, &id)
}

pub fn get_action_item(conn: &Connection, id: &str) -> Result<ActionItem, rusqlite::Error> {
    conn.query_row(
        "SELECT id, meeting_id, title, description, owner, due_date, priority, status, category, tags, notes, is_tentative, confidence_score, source_snippet, source_offsets, ai_provider, ai_run_id, created_at, updated_at, deleted_at
         FROM action_items WHERE id = ?1 AND deleted_at IS NULL",
        [id],
        row_to_action_item,
    )
}

pub fn update_action_item(conn: &Connection, req: &UpdateActionItemRequest) -> Result<ActionItem, rusqlite::Error> {
    let existing = get_action_item(conn, &req.id)?;
    let now = now_iso();

    let title = req.title.as_deref().unwrap_or(&existing.title);
    let description = req.description.as_deref().or(existing.description.as_deref());
    let owner = req.owner.as_deref().or(existing.owner.as_deref());
    let due_date = req.due_date.as_deref().or(existing.due_date.as_deref());
    let priority = req.priority.as_deref().unwrap_or(existing.priority.as_str());
    let status = req.status.as_deref().unwrap_or(existing.status.as_str());
    let category = req.category.as_deref().or(existing.category.as_deref());
    let tags = req.tags.as_ref().unwrap_or(&existing.tags);
    let tags_json = serde_json::to_string(tags).unwrap_or_else(|_| "[]".to_string());
    let notes = req.notes.as_deref().or(existing.notes.as_deref());
    let is_tentative = req.is_tentative.unwrap_or(existing.is_tentative);

    conn.execute(
        "UPDATE action_items SET title=?1, description=?2, owner=?3, due_date=?4, priority=?5, status=?6, category=?7, tags=?8, notes=?9, is_tentative=?10, updated_at=?11
         WHERE id=?12",
        params![title, description, owner, due_date, priority, status, category, tags_json, notes, is_tentative as i32, now, req.id],
    )?;

    get_action_item(conn, &req.id)
}

pub fn delete_action_item(conn: &Connection, id: &str) -> Result<(), rusqlite::Error> {
    let now = now_iso();
    conn.execute(
        "UPDATE action_items SET deleted_at = ?1, updated_at = ?1 WHERE id = ?2",
        params![now, id],
    )?;
    Ok(())
}

pub fn list_action_items(conn: &Connection, filter: &ActionItemListFilter) -> Result<Vec<ActionItem>, rusqlite::Error> {
    let mut sql = String::from(
        "SELECT id, meeting_id, title, description, owner, due_date, priority, status, category, tags, notes, is_tentative, confidence_score, source_snippet, source_offsets, ai_provider, ai_run_id, created_at, updated_at, deleted_at
         FROM action_items WHERE deleted_at IS NULL"
    );
    let mut param_values: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut idx = 1;

    if let Some(ref mid) = filter.meeting_id {
        sql.push_str(&format!(" AND meeting_id = ?{}", idx));
        param_values.push(Box::new(mid.clone()));
        idx += 1;
    }
    if let Some(ref owner) = filter.owner {
        sql.push_str(&format!(" AND owner = ?{}", idx));
        param_values.push(Box::new(owner.clone()));
        idx += 1;
    }
    if let Some(ref status) = filter.status {
        sql.push_str(&format!(" AND status = ?{}", idx));
        param_values.push(Box::new(status.clone()));
        idx += 1;
    }
    if let Some(ref priority) = filter.priority {
        sql.push_str(&format!(" AND priority = ?{}", idx));
        param_values.push(Box::new(priority.clone()));
        idx += 1;
    }
    if let Some(ref due_before) = filter.due_before {
        sql.push_str(&format!(" AND due_date <= ?{}", idx));
        param_values.push(Box::new(due_before.clone()));
        idx += 1;
    }
    if let Some(ref due_after) = filter.due_after {
        sql.push_str(&format!(" AND due_date >= ?{}", idx));
        param_values.push(Box::new(due_after.clone()));
        idx += 1;
    }
    if !filter.include_done.unwrap_or(false) {
        sql.push_str(" AND status != 'done' AND status != 'cancelled'");
    }

    sql.push_str(" ORDER BY due_date ASC NULLS LAST, created_at DESC");

    if let Some(limit) = filter.limit {
        sql.push_str(&format!(" LIMIT ?{}", idx));
        param_values.push(Box::new(limit));
        idx += 1;
    }
    if let Some(offset) = filter.offset {
        sql.push_str(&format!(" OFFSET ?{}", idx));
        param_values.push(Box::new(offset));
    }

    let params_refs: Vec<&dyn rusqlite::types::ToSql> = param_values.iter().map(|p| p.as_ref()).collect();
    let mut stmt = conn.prepare(&sql)?;
    let rows = stmt.query_map(params_refs.as_slice(), row_to_action_item)?;

    rows.collect()
}

fn row_to_action_item(row: &rusqlite::Row<'_>) -> Result<ActionItem, rusqlite::Error> {
    let tags_str: String = row.get::<_, Option<String>>(9)?.unwrap_or_else(|| "[]".to_string());
    let tags: Vec<String> = serde_json::from_str(&tags_str).unwrap_or_default();
    let priority_str: String = row.get(6)?;
    let status_str: String = row.get(7)?;

    Ok(ActionItem {
        id: row.get(0)?,
        meeting_id: row.get(1)?,
        title: row.get(2)?,
        description: row.get(3)?,
        owner: row.get(4)?,
        due_date: row.get(5)?,
        priority: Priority::from_str(&priority_str),
        status: ActionStatus::from_str(&status_str),
        category: row.get(8)?,
        tags,
        notes: row.get(10)?,
        is_tentative: row.get::<_, i32>(11)? != 0,
        confidence_score: row.get(12)?,
        source_snippet: row.get(13)?,
        source_offsets: row.get(14)?,
        ai_provider: row.get(15)?,
        ai_run_id: row.get(16)?,
        created_at: row.get(17)?,
        updated_at: row.get(18)?,
        deleted_at: row.get(19)?,
    })
}
