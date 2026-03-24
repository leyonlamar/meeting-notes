use crate::db::connection::Database;
use crate::db::action_item_repo;
use crate::domain::action_item::*;
use crate::utils::errors::{AppError, AppResult};

pub struct ActionItemService;

impl ActionItemService {
    pub fn create(db: &Database, req: CreateActionItemRequest) -> AppResult<ActionItem> {
        if req.title.trim().is_empty() {
            return Err(AppError::Validation("Action item title cannot be empty".into()));
        }
        db.with_conn(|conn| action_item_repo::create_action_item(conn, &req))
            .map_err(AppError::from)
    }

    pub fn get(db: &Database, id: &str) -> AppResult<ActionItem> {
        db.with_conn(|conn| action_item_repo::get_action_item(conn, id))
            .map_err(|e| match e {
                rusqlite::Error::QueryReturnedNoRows => AppError::NotFound(format!("Action item {id} not found")),
                other => AppError::Database(other),
            })
    }

    pub fn update(db: &Database, req: UpdateActionItemRequest) -> AppResult<ActionItem> {
        db.with_conn(|conn| action_item_repo::update_action_item(conn, &req))
            .map_err(AppError::from)
    }

    pub fn delete(db: &Database, id: &str) -> AppResult<()> {
        db.with_conn(|conn| action_item_repo::delete_action_item(conn, id))
            .map_err(AppError::from)
    }

    pub fn list(db: &Database, filter: ActionItemListFilter) -> AppResult<Vec<ActionItem>> {
        db.with_conn(|conn| action_item_repo::list_action_items(conn, &filter))
            .map_err(AppError::from)
    }

    /// Get dashboard stats: overdue count, open count, done today count
    pub fn get_stats(db: &Database) -> AppResult<ActionItemStats> {
        let today = chrono::Utc::now().format("%Y-%m-%d").to_string();

        let all_open = Self::list(db, ActionItemListFilter {
            status: None,
            include_done: Some(false),
            ..Default::default()
        })?;

        let overdue = all_open.iter()
            .filter(|a| a.due_date.as_ref().map_or(false, |d| d.as_str() < today.as_str()))
            .count() as i64;

        let open = all_open.len() as i64;

        Ok(ActionItemStats { open, overdue })
    }
}

#[derive(Debug, serde::Serialize)]
pub struct ActionItemStats {
    pub open: i64,
    pub overdue: i64,
}

impl Default for ActionItemListFilter {
    fn default() -> Self {
        Self {
            meeting_id: None,
            owner: None,
            status: None,
            priority: None,
            due_before: None,
            due_after: None,
            search: None,
            include_done: None,
            limit: None,
            offset: None,
        }
    }
}
