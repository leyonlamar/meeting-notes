use crate::ai::provider::AiProvider;
use crate::ai::types::*;
use crate::utils::errors::{AppResult};

/// Mock AI provider for development and testing.
/// Returns realistic-looking but static results.
pub struct MockProvider;

impl MockProvider {
    pub fn new() -> Self {
        Self
    }
}

impl AiProvider for MockProvider {
    fn name(&self) -> &str {
        "mock"
    }

    fn process(&self, request: &AiRequest) -> AppResult<AiResponse> {
        let start = std::time::Instant::now();

        let (text_result, structured_results) = match request.operation {
            AiOperation::CleanNotes => {
                let cleaned = format!("## Cleaned Notes\n\n{}", request.input_text.trim());
                (Some(cleaned), vec![])
            }
            AiOperation::SummarizeNotes => {
                let summary = "This meeting covered project status updates, key decisions on architecture, and assigned action items to team members. Follow-up is required on budget approval and timeline adjustments.".to_string();
                (Some(summary), vec![])
            }
            AiOperation::GenerateMinutes => {
                let minutes = format!(
                    "# Meeting Minutes\n\n## Executive Summary\nThe team discussed ongoing project progress and made several key decisions.\n\n## Key Discussion Points\n- Project timeline review\n- Resource allocation\n- Risk assessment\n\n## Decisions\n- Proceed with the proposed architecture\n\n## Next Steps\n- Follow up on open items\n\n---\n*Generated from raw notes*"
                );
                (Some(minutes), vec![])
            }
            AiOperation::ExtractActionItems => {
                let items = extract_mock_action_items(&request.input_text);
                (None, items)
            }
            AiOperation::ExtractDecisions => {
                (None, vec![AiExtractedItem {
                    extracted_text: "Team agreed to proceed with the current approach".to_string(),
                    normalized_value: None,
                    item_type: "decision".to_string(),
                    confidence_score: 0.75,
                    is_tentative: true,
                    rationale: Some("Mock extraction - detected agreement pattern".to_string()),
                    source_snippet: None,
                    owner: None,
                    due_date: None,
                    priority: None,
                }])
            }
            AiOperation::ExtractRisks => {
                (None, vec![AiExtractedItem {
                    extracted_text: "Timeline may slip if dependencies are not resolved".to_string(),
                    normalized_value: None,
                    item_type: "risk".to_string(),
                    confidence_score: 0.6,
                    is_tentative: true,
                    rationale: Some("Mock extraction - detected risk language".to_string()),
                    source_snippet: None,
                    owner: None,
                    due_date: None,
                    priority: Some("medium".to_string()),
                }])
            }
            _ => (None, vec![]),
        };

        let elapsed = start.elapsed().as_millis() as u64;

        Ok(AiResponse {
            provider_name: "mock".to_string(),
            model_name: Some("mock-v1".to_string()),
            operation: request.operation.as_str().to_string(),
            text_result,
            structured_results,
            processing_time_ms: elapsed,
        })
    }
}

fn extract_mock_action_items(input: &str) -> Vec<AiExtractedItem> {
    // Simple pattern-based extraction for mock mode
    let mut items = Vec::new();

    for line in input.lines() {
        let trimmed = line.trim().to_lowercase();
        if trimmed.contains("action") || trimmed.contains("todo") || trimmed.contains("will ") || trimmed.contains("needs to") || trimmed.contains("should ") {
            items.push(AiExtractedItem {
                extracted_text: line.trim().to_string(),
                normalized_value: None,
                item_type: "action_item".to_string(),
                confidence_score: 0.65,
                is_tentative: true,
                rationale: Some("Mock extraction - detected action language".to_string()),
                source_snippet: Some(line.trim().to_string()),
                owner: None,
                due_date: None,
                priority: Some("medium".to_string()),
            });
        }
    }

    if items.is_empty() {
        items.push(AiExtractedItem {
            extracted_text: "Review meeting notes and follow up".to_string(),
            normalized_value: None,
            item_type: "action_item".to_string(),
            confidence_score: 0.5,
            is_tentative: true,
            rationale: Some("Mock fallback - no clear action items detected".to_string()),
            source_snippet: None,
            owner: None,
            due_date: None,
            priority: Some("low".to_string()),
        });
    }

    items
}
