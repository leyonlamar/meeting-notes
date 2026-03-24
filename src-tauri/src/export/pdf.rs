use printpdf::*;
use std::io::BufWriter;

use crate::db::connection::Database;
use crate::db::{meeting_repo, action_item_repo};
use crate::domain::action_item::ActionItemListFilter;
use crate::utils::errors::{AppError, AppResult};

/// Generate a PDF meeting minutes document with chronological timeline
pub fn export_meeting_pdf(db: &Database, meeting_id: &str) -> AppResult<Vec<u8>> {
    let (meeting, notes, minutes, actions, decisions, deliverables, risks, questions) = db.with_conn(|conn| {
        let meeting = meeting_repo::get_meeting(conn, meeting_id)?;
        let notes = meeting_repo::get_raw_notes(conn, meeting_id)?;
        let minutes = meeting_repo::get_latest_minutes(conn, meeting_id)?;
        let actions = action_item_repo::list_action_items(conn, &ActionItemListFilter {
            meeting_id: Some(meeting_id.to_string()),
            include_done: Some(true),
            ..Default::default()
        })?;
        let decisions = meeting_repo::get_decisions(conn, meeting_id)?;
        let deliverables = meeting_repo::get_deliverables(conn, meeting_id)?;
        let risks = meeting_repo::get_risks_blockers(conn, meeting_id)?;
        let questions = meeting_repo::get_open_questions(conn, meeting_id)?;
        Ok((meeting, notes, minutes, actions, decisions, deliverables, risks, questions))
    }).map_err(AppError::from)?;

    let (doc, page1, layer1) = PdfDocument::new(
        &meeting.title,
        Mm(210.0),  // A4 width
        Mm(297.0),  // A4 height
        "Layer 1",
    );

    let font = doc.add_builtin_font(BuiltinFont::Helvetica).unwrap();
    let font_bold = doc.add_builtin_font(BuiltinFont::HelveticaBold).unwrap();
    let font_italic = doc.add_builtin_font(BuiltinFont::HelveticaOblique).unwrap();

    let mut y = 270.0_f32;
    let left = 25.0_f32;
    let content_left = 30.0_f32;

    let mut current_layer = doc.get_page(page1).get_layer(layer1);

    // Helper: add a new page when needed
    let add_page = |doc: &PdfDocumentReference| -> PdfLayerReference {
        let (page, layer) = doc.add_page(Mm(210.0), Mm(297.0), "Layer 1");
        doc.get_page(page).get_layer(layer)
    };

    // Helper: check if we need a new page
    macro_rules! check_page {
        ($needed:expr) => {
            if y < $needed {
                current_layer = add_page(&doc);
                y = 275.0;
            }
        };
    }

    // ── Title ──
    let gold_color = Color::Rgb(Rgb::new(0.72, 0.58, 0.24, None));
    let dark_color = Color::Rgb(Rgb::new(0.06, 0.09, 0.16, None));
    let gray_color = Color::Rgb(Rgb::new(0.4, 0.45, 0.55, None));
    let black_color = Color::Rgb(Rgb::new(0.0, 0.0, 0.0, None));

    // Title bar
    current_layer.set_fill_color(gold_color.clone());
    current_layer.add_rect(printpdf::Rect::new(Mm(0.0), Mm(282.0), Mm(210.0), Mm(297.0)));

    current_layer.use_text("MEET INTELLIGENCE", 9.0, Mm(left), Mm(289.0), &font_bold);
    current_layer.set_fill_color(dark_color.clone());

    // Meeting title
    current_layer.use_text(&meeting.title, 18.0, Mm(left), Mm(y), &font_bold);
    y -= 8.0;

    // Date & metadata
    current_layer.set_fill_color(gray_color.clone());
    let meta = format!(
        "Date: {} | Status: {} {}",
        meeting.meeting_date.as_deref().unwrap_or("Not set"),
        meeting.status.as_str(),
        meeting.project.as_ref().map(|p| format!("| Project: {}", p)).unwrap_or_default(),
    );
    current_layer.use_text(&meta, 9.0, Mm(left), Mm(y), &font);
    y -= 6.0;

    if !meeting.tags.is_empty() {
        let tags_str = format!("Tags: {}", meeting.tags.join(", "));
        current_layer.use_text(&tags_str, 8.0, Mm(left), Mm(y), &font_italic);
        y -= 6.0;
    }

    // Divider
    y -= 4.0;
    current_layer.set_fill_color(Color::Rgb(Rgb::new(0.85, 0.85, 0.85, None)));
    current_layer.add_rect(printpdf::Rect::new(Mm(left), Mm(y), Mm(185.0), Mm(y + 0.3)));
    y -= 8.0;

    // ── Executive Summary ──
    if let Some(ref mins) = minutes {
        if let Some(ref summary) = mins.executive_summary {
            check_page!(40.0);
            current_layer.set_fill_color(dark_color.clone());
            current_layer.use_text("EXECUTIVE SUMMARY", 11.0, Mm(left), Mm(y), &font_bold);
            y -= 6.0;
            current_layer.set_fill_color(black_color.clone());
            for line in wrap_text(summary, 80) {
                check_page!(15.0);
                current_layer.use_text(&line, 9.0, Mm(content_left), Mm(y), &font);
                y -= 4.5;
            }
            y -= 4.0;
        }
    }

    // ── Chronological Timeline ──
    check_page!(30.0);
    current_layer.set_fill_color(gold_color.clone());
    current_layer.use_text("CHRONOLOGICAL TIMELINE", 11.0, Mm(left), Mm(y), &font_bold);
    y -= 7.0;

    // Build timeline entries sorted by created_at
    let mut timeline: Vec<(String, String, String)> = Vec::new(); // (time, type, content)

    for note in &notes {
        let time = note.created_at.chars().take(16).collect::<String>();
        timeline.push((time, "NOTE".to_string(), truncate_str(&note.content, 120)));
    }
    for d in &decisions {
        let time = d.created_at.chars().take(16).collect::<String>();
        let tent = if d.is_tentative { " [tentative]" } else { "" };
        timeline.push((time, "DECISION".to_string(), format!("{}{}", d.content, tent)));
    }
    for a in &actions {
        let time = a.created_at.chars().take(16).collect::<String>();
        let owner = a.owner.as_deref().unwrap_or("Unassigned");
        let due = a.due_date.as_deref().unwrap_or("No date");
        let tent = if a.is_tentative { " [tentative]" } else { "" };
        timeline.push((time, "ACTION".to_string(), format!("{} → {} (due: {}){}", a.title, owner, due, tent)));
    }
    for d in &deliverables {
        let time = d.created_at.chars().take(16).collect::<String>();
        timeline.push((time, "DELIVERABLE".to_string(), d.title.clone()));
    }
    for r in &risks {
        let time = r.created_at.chars().take(16).collect::<String>();
        timeline.push((time, format!("{}", r.risk_type.as_str().to_uppercase()), r.content.clone()));
    }
    for q in &questions {
        let time = q.created_at.chars().take(16).collect::<String>();
        timeline.push((time, "QUESTION".to_string(), q.content.clone()));
    }

    timeline.sort_by(|a, b| a.0.cmp(&b.0));

    current_layer.set_fill_color(black_color.clone());
    for (time, entry_type, content) in &timeline {
        check_page!(15.0);
        // Time column
        current_layer.set_fill_color(gray_color.clone());
        current_layer.use_text(&time.replace('T', " "), 7.5, Mm(content_left), Mm(y), &font);
        // Type badge
        current_layer.set_fill_color(gold_color.clone());
        current_layer.use_text(entry_type, 7.0, Mm(70.0), Mm(y), &font_bold);
        // Content
        current_layer.set_fill_color(black_color.clone());
        let truncated = truncate_str(content, 60);
        current_layer.use_text(&truncated, 8.0, Mm(95.0), Mm(y), &font);
        y -= 5.0;
    }

    if timeline.is_empty() {
        current_layer.set_fill_color(gray_color.clone());
        current_layer.use_text("No timeline entries recorded", 9.0, Mm(content_left), Mm(y), &font_italic);
        y -= 5.0;
    }

    y -= 6.0;

    // ── Action Items Summary ──
    if !actions.is_empty() {
        check_page!(30.0);
        current_layer.set_fill_color(gold_color.clone());
        current_layer.use_text("ACTION ITEMS", 11.0, Mm(left), Mm(y), &font_bold);
        y -= 7.0;

        // Table header
        current_layer.set_fill_color(gray_color.clone());
        current_layer.use_text("Title", 8.0, Mm(content_left), Mm(y), &font_bold);
        current_layer.use_text("Owner", 8.0, Mm(105.0), Mm(y), &font_bold);
        current_layer.use_text("Due", 8.0, Mm(140.0), Mm(y), &font_bold);
        current_layer.use_text("Priority", 8.0, Mm(165.0), Mm(y), &font_bold);
        y -= 5.0;

        current_layer.set_fill_color(black_color.clone());
        for a in &actions {
            check_page!(12.0);
            let title = truncate_str(&a.title, 40);
            current_layer.use_text(&title, 8.0, Mm(content_left), Mm(y), &font);
            current_layer.use_text(a.owner.as_deref().unwrap_or("-"), 8.0, Mm(105.0), Mm(y), &font);
            current_layer.use_text(a.due_date.as_deref().unwrap_or("-"), 8.0, Mm(140.0), Mm(y), &font);
            current_layer.use_text(a.priority.as_str(), 8.0, Mm(165.0), Mm(y), &font);
            y -= 4.5;
        }
        y -= 6.0;
    }

    // ── Risks & Blockers ──
    if !risks.is_empty() {
        check_page!(20.0);
        current_layer.set_fill_color(gold_color.clone());
        current_layer.use_text("RISKS & BLOCKERS", 11.0, Mm(left), Mm(y), &font_bold);
        y -= 7.0;
        current_layer.set_fill_color(black_color.clone());
        for r in &risks {
            check_page!(12.0);
            let label = format!("[{}] {}", r.risk_type.as_str().to_uppercase(), r.content);
            for line in wrap_text(&label, 85) {
                current_layer.use_text(&line, 8.0, Mm(content_left), Mm(y), &font);
                y -= 4.5;
            }
        }
        y -= 6.0;
    }

    // ── Open Questions ──
    if !questions.is_empty() {
        check_page!(20.0);
        current_layer.set_fill_color(gold_color.clone());
        current_layer.use_text("OPEN QUESTIONS", 11.0, Mm(left), Mm(y), &font_bold);
        y -= 7.0;
        current_layer.set_fill_color(black_color.clone());
        for q in &questions {
            check_page!(12.0);
            current_layer.use_text(&format!("• {}", truncate_str(&q.content, 90)), 8.0, Mm(content_left), Mm(y), &font);
            y -= 4.5;
        }
    }

    // ── Footer on last page ──
    current_layer.set_fill_color(gray_color);
    current_layer.use_text(
        &format!("Generated by Meet Intelligence · {}", chrono::Utc::now().format("%Y-%m-%d %H:%M UTC")),
        7.0, Mm(left), Mm(10.0), &font_italic
    );

    // Write to bytes
    let mut buf = BufWriter::new(Vec::new());
    doc.save(&mut buf).map_err(|e| AppError::Export(e.to_string()))?;
    let bytes = buf.into_inner().map_err(|e| AppError::Export(e.to_string()))?;

    Ok(bytes)
}

fn wrap_text(text: &str, max_chars: usize) -> Vec<String> {
    let mut lines = Vec::new();
    for paragraph in text.lines() {
        let words: Vec<&str> = paragraph.split_whitespace().collect();
        let mut current_line = String::new();
        for word in words {
            if current_line.len() + word.len() + 1 > max_chars {
                if !current_line.is_empty() {
                    lines.push(current_line);
                }
                current_line = word.to_string();
            } else {
                if !current_line.is_empty() {
                    current_line.push(' ');
                }
                current_line.push_str(word);
            }
        }
        if !current_line.is_empty() {
            lines.push(current_line);
        }
    }
    if lines.is_empty() {
        lines.push(String::new());
    }
    lines
}

fn truncate_str(s: &str, max: usize) -> String {
    if s.len() <= max { s.to_string() } else { format!("{}…", &s[..max - 1]) }
}
