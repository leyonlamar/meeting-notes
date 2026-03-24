use rusqlite::Connection;
use std::path::Path;
use std::sync::Mutex;

use crate::db::migrations;

/// Thread-safe database wrapper
pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    /// Open or create the SQLite database and run migrations
    pub fn open(db_path: &Path) -> Result<Self, rusqlite::Error> {
        // Ensure parent directory exists
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent).ok();
        }

        let conn = Connection::open(db_path)?;

        // Performance pragmas
        conn.execute_batch("PRAGMA journal_mode=WAL;")?;
        conn.execute_batch("PRAGMA synchronous=NORMAL;")?;
        conn.execute_batch("PRAGMA foreign_keys=ON;")?;
        conn.execute_batch("PRAGMA busy_timeout=5000;")?;

        migrations::run_migrations(&conn)?;

        log::info!("Database opened at {:?}", db_path);

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    /// Execute a closure with a reference to the connection
    pub fn with_conn<F, T>(&self, f: F) -> Result<T, rusqlite::Error>
    where
        F: FnOnce(&Connection) -> Result<T, rusqlite::Error>,
    {
        let conn = self.conn.lock().unwrap();
        f(&conn)
    }
}
