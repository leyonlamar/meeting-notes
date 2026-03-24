use tauri::State;

use crate::app::state::AppState;
use crate::domain::meeting::CreateMeetingRequest;
use crate::domain::action_item::CreateActionItemRequest;
use crate::services::meeting_service::MeetingService;
use crate::services::action_item_service::ActionItemService;
use crate::utils::errors::AppError;

/// Insert sample data for development and demonstration
#[tauri::command]
pub fn seed_sample_data(state: State<'_, AppState>) -> Result<String, AppError> {
    // Meeting 1: Sprint Planning
    let m1 = MeetingService::create_meeting(&state.db, CreateMeetingRequest {
        title: "Sprint 14 Planning".to_string(),
        meeting_date: Some("2026-03-18".to_string()),
        location: Some("Conference Room B".to_string()),
        project: Some("Project Atlas".to_string()),
        tags: Some(vec!["sprint".to_string(), "planning".to_string()]),
    })?;

    let note1 = "Sprint 14 Planning - March 18, 2026\n\n\
        Attendees: Sarah Chen, Mike Rodriguez, Emily Park, James Wilson\n\n\
        ## Current Sprint Review\n\
        - Completed user authentication module (Sarah)\n\
        - API gateway 80% done, needs performance testing (Mike)\n\
        - UI redesign for dashboard complete, pending QA (Emily)\n\n\
        ## Sprint 14 Goals\n\
        - Mike will finish API gateway performance testing by Friday March 22\n\
        - Emily needs to fix the responsive layout issues on mobile - due March 20\n\
        - James will handle the database migration script, should be done by end of week\n\
        - Sarah will start on the notification service - estimated 2 weeks\n\n\
        ## Decisions\n\
        - We agreed to use Redis for caching instead of Memcached\n\
        - Decided to postpone the analytics dashboard to Sprint 15\n\n\
        ## Risks\n\
        - The third-party payment API might have breaking changes in v3\n\
        - Waiting on finance approval for the cloud infrastructure upgrade\n\n\
        ## Open Questions\n\
        - Who owns the data migration after the schema change?\n\
        - Should we support IE11 or can we drop it?\n\n\
        ## Next Steps\n\
        - Schedule design review for Thursday\n\
        - Mike to set up staging environment by Wednesday";

    MeetingService::save_raw_note(&state.db, crate::domain::meeting::SaveRawNoteRequest {
        meeting_id: m1.id.clone(),
        content: note1.to_string(),
        source_type: Some("manual".to_string()),
        source_filename: None,
    })?;

    ActionItemService::create(&state.db, CreateActionItemRequest {
        meeting_id: m1.id.clone(),
        title: "Finish API gateway performance testing".to_string(),
        description: Some("Complete load testing and optimize response times".to_string()),
        owner: Some("Mike Rodriguez".to_string()),
        due_date: Some("2026-03-22".to_string()),
        priority: Some("high".to_string()),
        category: Some("development".to_string()),
        tags: Some(vec!["api".to_string(), "performance".to_string()]),
        notes: None,
        is_tentative: Some(false),
        confidence_score: Some(0.95),
        source_snippet: Some("Mike will finish API gateway performance testing by Friday March 22".to_string()),
    })?;

    ActionItemService::create(&state.db, CreateActionItemRequest {
        meeting_id: m1.id.clone(),
        title: "Fix responsive layout issues on mobile".to_string(),
        description: None,
        owner: Some("Emily Park".to_string()),
        due_date: Some("2026-03-20".to_string()),
        priority: Some("medium".to_string()),
        category: Some("frontend".to_string()),
        tags: None,
        notes: None,
        is_tentative: Some(false),
        confidence_score: Some(0.9),
        source_snippet: Some("Emily needs to fix the responsive layout issues on mobile - due March 20".to_string()),
    })?;

    ActionItemService::create(&state.db, CreateActionItemRequest {
        meeting_id: m1.id.clone(),
        title: "Handle database migration script".to_string(),
        description: None,
        owner: Some("James Wilson".to_string()),
        due_date: Some("2026-03-22".to_string()),
        priority: Some("medium".to_string()),
        category: None,
        tags: Some(vec!["database".to_string()]),
        notes: None,
        is_tentative: Some(false),
        confidence_score: Some(0.85),
        source_snippet: Some("James will handle the database migration script".to_string()),
    })?;

    // Meeting 2: Stakeholder Update
    let m2 = MeetingService::create_meeting(&state.db, CreateMeetingRequest {
        title: "Q1 Stakeholder Update".to_string(),
        meeting_date: Some("2026-03-15".to_string()),
        location: Some("Virtual - Teams".to_string()),
        project: Some("Project Atlas".to_string()),
        tags: Some(vec!["stakeholder".to_string(), "quarterly".to_string()]),
    })?;

    let note2 = "Q1 Stakeholder Update\n\n\
        Attendees: VP Engineering, Product Lead, Tech Lead, PM\n\n\
        - Project is on track for April launch\n\
        - Budget utilization at 78%, within targets\n\
        - Key risk: vendor contract renewal pending legal review\n\
        - Action: PM to prepare launch readiness checklist by March 25\n\
        - Action: Tech Lead to complete security audit - critical priority\n\
        - Decision: approved additional headcount for Q2\n\
        - TODO: schedule customer beta program kickoff";

    MeetingService::save_raw_note(&state.db, crate::domain::meeting::SaveRawNoteRequest {
        meeting_id: m2.id.clone(),
        content: note2.to_string(),
        source_type: Some("paste".to_string()),
        source_filename: None,
    })?;

    ActionItemService::create(&state.db, CreateActionItemRequest {
        meeting_id: m2.id.clone(),
        title: "Prepare launch readiness checklist".to_string(),
        description: None,
        owner: Some("PM".to_string()),
        due_date: Some("2026-03-25".to_string()),
        priority: Some("high".to_string()),
        category: None,
        tags: Some(vec!["launch".to_string()]),
        notes: None,
        is_tentative: Some(false),
        confidence_score: Some(0.92),
        source_snippet: Some("PM to prepare launch readiness checklist by March 25".to_string()),
    })?;

    ActionItemService::create(&state.db, CreateActionItemRequest {
        meeting_id: m2.id.clone(),
        title: "Complete security audit".to_string(),
        description: None,
        owner: Some("Tech Lead".to_string()),
        due_date: None,
        priority: Some("critical".to_string()),
        category: None,
        tags: Some(vec!["security".to_string()]),
        notes: None,
        is_tentative: Some(false),
        confidence_score: Some(0.88),
        source_snippet: Some("Tech Lead to complete security audit - critical priority".to_string()),
    })?;

    Ok(format!("Seeded 2 meetings and 5 action items"))
}
