use crate::db::connection::Database;
use crate::domain::action_item::ActionItem;
use crate::services::meeting_service::MeetingService;
use crate::utils::errors::{AppError, AppResult};

pub struct ExportService;

impl ExportService {
    /// Export meeting minutes as Markdown
    pub fn export_minutes_markdown(db: &Database, meeting_id: &str) -> AppResult<String> {
        let meeting = MeetingService::get_meeting(db, meeting_id)?;
        let minutes = MeetingService::get_latest_minutes(db, meeting_id)?;
        let decisions = MeetingService::get_decisions(db, meeting_id)?;
        let deliverables = MeetingService::get_deliverables(db, meeting_id)?;
        let risks = MeetingService::get_risks_blockers(db, meeting_id)?;
        let questions = MeetingService::get_open_questions(db, meeting_id)?;

        let mut md = String::new();
        md.push_str(&format!("# {}\n\n", meeting.title));

        if let Some(date) = &meeting.meeting_date {
            md.push_str(&format!("**Date:** {}\n", date));
        }
        if let Some(location) = &meeting.location {
            md.push_str(&format!("**Location:** {}\n", location));
        }
        if let Some(project) = &meeting.project {
            md.push_str(&format!("**Project:** {}\n", project));
        }
        md.push('\n');

        if let Some(ref mins) = minutes {
            if let Some(ref summary) = mins.executive_summary {
                md.push_str("## Executive Summary\n\n");
                md.push_str(summary);
                md.push_str("\n\n");
            }

            if !mins.key_discussion_points.is_empty() {
                md.push_str("## Key Discussion Points\n\n");
                for point in &mins.key_discussion_points {
                    md.push_str(&format!("- {}\n", point));
                }
                md.push('\n');
            }

            if let Some(ref content) = mins.content_markdown {
                md.push_str(content);
                md.push_str("\n\n");
            }
        }

        if !decisions.is_empty() {
            md.push_str("## Decisions\n\n");
            for d in &decisions {
                let tentative = if d.is_tentative { " *(tentative)*" } else { "" };
                md.push_str(&format!("- {}{}\n", d.content, tentative));
            }
            md.push('\n');
        }

        if !deliverables.is_empty() {
            md.push_str("## Deliverables\n\n");
            for d in &deliverables {
                let owner = d.owner.as_deref().unwrap_or("Unassigned");
                let due = d.due_date.as_deref().unwrap_or("No date");
                md.push_str(&format!("- **{}** — Owner: {}, Due: {}\n", d.title, owner, due));
            }
            md.push('\n');
        }

        if !risks.is_empty() {
            md.push_str("## Risks & Blockers\n\n");
            for r in &risks {
                md.push_str(&format!("- [{}] {}\n", r.risk_type.as_str().to_uppercase(), r.content));
            }
            md.push('\n');
        }

        if !questions.is_empty() {
            md.push_str("## Open Questions\n\n");
            for q in &questions {
                md.push_str(&format!("- {}\n", q.content));
            }
            md.push('\n');
        }

        Ok(md)
    }

    /// Export action items as CSV
    pub fn export_action_items_csv(items: &[ActionItem]) -> AppResult<String> {
        let mut wtr = csv::Writer::from_writer(Vec::new());

        wtr.write_record(&[
            "id", "meeting_id", "title", "description", "owner", "due_date",
            "priority", "status", "category", "tags", "is_tentative",
            "confidence_score", "created_at", "updated_at",
        ]).map_err(|e| AppError::Export(e.to_string()))?;

        for item in items {
            let tags_str = serde_json::to_string(&item.tags).unwrap_or_default();
            let tentative_str = if item.is_tentative { "true".to_string() } else { "false".to_string() };
            let confidence_str = item.confidence_score.map_or(String::new(), |s| s.to_string());
            wtr.write_record(&[
                &item.id,
                &item.meeting_id,
                &item.title,
                item.description.as_deref().unwrap_or(""),
                item.owner.as_deref().unwrap_or(""),
                item.due_date.as_deref().unwrap_or(""),
                item.priority.as_str(),
                item.status.as_str(),
                item.category.as_deref().unwrap_or(""),
                &tags_str,
                &tentative_str,
                &confidence_str,
                &item.created_at,
                &item.updated_at,
            ]).map_err(|e| AppError::Export(e.to_string()))?;
        }

        let bytes = wtr.into_inner().map_err(|e| AppError::Export(e.to_string()))?;
        String::from_utf8(bytes).map_err(|e| AppError::Export(e.to_string()))
    }

    /// Export action items as JSON (flat tabular structure for Excel compatibility)
    pub fn export_action_items_json(items: &[ActionItem]) -> AppResult<String> {
        serde_json::to_string_pretty(items)
            .map_err(|e| AppError::Export(e.to_string()))
    }
}
