use crate::ai::provider::AiProvider;
use crate::ai::types::*;
use crate::utils::errors::{AppError, AppResult};

/// OpenAI-compatible API provider.
/// Works with OpenAI, Ollama (v1 endpoint), LM Studio, and any compatible API.
pub struct OpenAiCompatibleProvider {
    pub name: String,
    pub endpoint: String,
    pub model: String,
    pub api_key: Option<String>,
}

impl OpenAiCompatibleProvider {
    pub fn new(name: String, endpoint: String, model: String, api_key: Option<String>) -> Self {
        Self { name, endpoint, model, api_key }
    }

    fn build_prompt(&self, operation: &AiOperation, input: &str) -> (String, String) {
        let system = match operation {
            AiOperation::CleanNotes => "You are a professional editor. Clean the provided meeting notes: fix grammar, remove filler words and repetition, normalize formatting, and organize into readable sections. Preserve all meaning and factual content. Return only the cleaned text.".to_string(),

            AiOperation::SummarizeNotes => "You are a meeting summarizer. Provide a concise executive summary of the meeting notes in 3-5 sentences. Focus on key decisions, action items, and outcomes.".to_string(),

            AiOperation::GenerateMinutes => "You are a professional meeting minutes writer. Convert the raw notes into structured meeting minutes with these sections:\n\n## Executive Summary\n## Key Discussion Points\n## Decisions Made\n## Action Items\n## Next Steps\n\nBe factual and concise. Use markdown formatting.".to_string(),

            AiOperation::ExtractActionItems => r#"You are an action item extractor. Analyze the meeting notes and extract all action items, tasks, and commitments.

Return a JSON array where each item has:
- "extracted_text": the action item description
- "owner": person responsible (null if unclear)
- "due_date": deadline in YYYY-MM-DD format (null if unclear)
- "priority": "low", "medium", "high", or "critical"
- "confidence_score": 0.0 to 1.0 indicating certainty
- "is_tentative": true if uncertain
- "source_snippet": the exact source text this was extracted from
- "rationale": brief explanation of why this was identified

Look for patterns like: "will do X", "needs to", "action:", "TODO", "by Friday", ownership phrases.
When confidence is low, mark as tentative. Never fabricate certainty.

Return ONLY valid JSON array, no other text."#.to_string(),

            AiOperation::ExtractDecisions => r#"Extract all decisions made in this meeting. Return a JSON array where each item has:
- "extracted_text": the decision
- "confidence_score": 0.0 to 1.0
- "is_tentative": true if uncertain
- "source_snippet": source text
- "rationale": why identified as a decision

Look for: "agreed to", "decided", "we will", "approved", "confirmed".
Return ONLY valid JSON array."#.to_string(),

            AiOperation::ExtractDeliverables => r#"Extract all deliverables mentioned. Return a JSON array where each item has:
- "extracted_text": the deliverable
- "owner": person responsible (null if unclear)
- "due_date": in YYYY-MM-DD (null if unclear)
- "confidence_score": 0.0 to 1.0
- "is_tentative": true if uncertain
- "source_snippet": source text

Look for: "submit", "deliver", "send", "prepare", "complete", "final deck/report".
Return ONLY valid JSON array."#.to_string(),

            AiOperation::ExtractRisks => r#"Extract all risks, blockers, and dependencies. Return a JSON array where each item has:
- "extracted_text": the risk/blocker
- "item_type": "risk", "blocker", or "dependency"
- "confidence_score": 0.0 to 1.0
- "is_tentative": true if uncertain
- "source_snippet": source text

Look for: "risk", "blocked", "waiting on", "depends on", "could delay", "concern".
Return ONLY valid JSON array."#.to_string(),

            AiOperation::ExtractOpenQuestions => r#"Extract all open/unresolved questions. Return a JSON array where each item has:
- "extracted_text": the question
- "owner": person assigned (null if unclear)
- "confidence_score": 0.0 to 1.0
- "is_tentative": true if uncertain
- "source_snippet": source text

Look for: "?", "who will", "need to figure out", "open question", "TBD", "unclear".
Return ONLY valid JSON array."#.to_string(),

            AiOperation::ExtractNextSteps => r#"Extract all next steps and follow-up items. Return a JSON array where each item has:
- "extracted_text": the next step
- "owner": person responsible (null if unclear)
- "due_date": in YYYY-MM-DD (null if unclear)
- "confidence_score": 0.0 to 1.0
- "is_tentative": true if uncertain
- "source_snippet": source text

Return ONLY valid JSON array."#.to_string(),

            AiOperation::ExtractAttendees => r#"Extract all meeting attendees/participants mentioned. Return a JSON array where each item has:
- "extracted_text": person's name
- "item_type": "attendee"
- "confidence_score": 0.0 to 1.0
- "source_snippet": source text

Return ONLY valid JSON array."#.to_string(),

            AiOperation::ExtractDeadlines => r#"Extract all deadlines and due dates mentioned. Return a JSON array where each item has:
- "extracted_text": what is due
- "due_date": in YYYY-MM-DD format (convert relative dates like "next Friday" to absolute dates)
- "owner": person responsible (null if unclear)
- "confidence_score": 0.0 to 1.0
- "is_tentative": true for vague dates like "end of month"
- "source_snippet": source text

Return ONLY valid JSON array."#.to_string(),
        };

        let user = format!("Meeting notes:\n\n{}", input);
        (system, user)
    }

    fn parse_structured_response(&self, raw: &str, operation: &AiOperation) -> Vec<AiExtractedItem> {
        // Try to find JSON array in the response
        let json_str = extract_json_array(raw);

        let parsed: Vec<serde_json::Value> = match serde_json::from_str(&json_str) {
            Ok(v) => v,
            Err(e) => {
                log::warn!("Failed to parse AI response as JSON array: {}", e);
                return Vec::new();
            }
        };

        let item_type = match operation {
            AiOperation::ExtractActionItems => "action_item",
            AiOperation::ExtractDecisions => "decision",
            AiOperation::ExtractDeliverables => "deliverable",
            AiOperation::ExtractRisks => "risk",
            AiOperation::ExtractOpenQuestions => "open_question",
            AiOperation::ExtractNextSteps => "next_step",
            AiOperation::ExtractAttendees => "attendee",
            AiOperation::ExtractDeadlines => "deadline",
            _ => "unknown",
        };

        parsed
            .into_iter()
            .map(|v| AiExtractedItem {
                extracted_text: v["extracted_text"].as_str().unwrap_or("").to_string(),
                normalized_value: v["normalized_value"].as_str().map(|s| s.to_string()),
                item_type: v["item_type"].as_str().unwrap_or(item_type).to_string(),
                confidence_score: v["confidence_score"].as_f64().unwrap_or(0.5),
                is_tentative: v["is_tentative"].as_bool().unwrap_or(true),
                rationale: v["rationale"].as_str().map(|s| s.to_string()),
                source_snippet: v["source_snippet"].as_str().map(|s| s.to_string()),
                owner: v["owner"].as_str().map(|s| s.to_string()),
                due_date: v["due_date"].as_str().map(|s| s.to_string()),
                priority: v["priority"].as_str().map(|s| s.to_string()),
            })
            .filter(|i| !i.extracted_text.is_empty())
            .collect()
    }
}

impl AiProvider for OpenAiCompatibleProvider {
    fn name(&self) -> &str {
        &self.name
    }

    fn process(&self, request: &AiRequest) -> AppResult<AiResponse> {
        let start = std::time::Instant::now();
        let (system_prompt, user_prompt) = self.build_prompt(&request.operation, &request.input_text);

        let url = format!("{}/chat/completions", self.endpoint.trim_end_matches('/'));

        let mut req_builder = reqwest::blocking::Client::new()
            .post(&url)
            .header("Content-Type", "application/json");

        if let Some(ref key) = self.api_key {
            req_builder = req_builder.header("Authorization", format!("Bearer {}", key));
        }

        let body = serde_json::json!({
            "model": self.model,
            "messages": [
                { "role": "system", "content": system_prompt },
                { "role": "user", "content": user_prompt }
            ],
            "temperature": 0.3,
            "max_tokens": 4096
        });

        let response = req_builder
            .json(&body)
            .send()
            .map_err(|e| AppError::AiProvider(format!("Request failed: {}", e)))?;

        if !response.status().is_success() {
            let status = response.status();
            let body = response.text().unwrap_or_default();
            return Err(AppError::AiProvider(format!("API returned {}: {}", status, body)));
        }

        let resp_json: serde_json::Value = response
            .json()
            .map_err(|e| AppError::AiProvider(format!("Invalid response: {}", e)))?;

        let content = resp_json["choices"][0]["message"]["content"]
            .as_str()
            .unwrap_or("")
            .to_string();

        let elapsed = start.elapsed().as_millis() as u64;

        // Determine if this is a text or structured response
        let is_extraction = matches!(
            request.operation,
            AiOperation::ExtractActionItems
                | AiOperation::ExtractDecisions
                | AiOperation::ExtractDeliverables
                | AiOperation::ExtractRisks
                | AiOperation::ExtractOpenQuestions
                | AiOperation::ExtractNextSteps
                | AiOperation::ExtractAttendees
                | AiOperation::ExtractDeadlines
        );

        let (text_result, structured_results) = if is_extraction {
            let items = self.parse_structured_response(&content, &request.operation);
            (None, items)
        } else {
            (Some(content), vec![])
        };

        Ok(AiResponse {
            provider_name: self.name.clone(),
            model_name: Some(self.model.clone()),
            operation: request.operation.as_str().to_string(),
            text_result,
            structured_results,
            processing_time_ms: elapsed,
        })
    }
}

/// Extract the first JSON array from a potentially wrapped response
fn extract_json_array(raw: &str) -> String {
    let trimmed = raw.trim();

    // If it starts with [, use as-is
    if trimmed.starts_with('[') {
        return trimmed.to_string();
    }

    // Try to find ```json ... ``` block
    if let Some(start) = trimmed.find("```json") {
        if let Some(end) = trimmed[start + 7..].find("```") {
            let inner = &trimmed[start + 7..start + 7 + end];
            return inner.trim().to_string();
        }
    }

    // Try to find ``` ... ``` block
    if let Some(start) = trimmed.find("```") {
        if let Some(end) = trimmed[start + 3..].find("```") {
            let inner = &trimmed[start + 3..start + 3 + end];
            let inner = inner.trim();
            if inner.starts_with('[') {
                return inner.to_string();
            }
        }
    }

    // Try to find [ ... ] anywhere
    if let Some(start) = trimmed.find('[') {
        if let Some(end) = trimmed.rfind(']') {
            return trimmed[start..=end].to_string();
        }
    }

    // Fallback
    "[]".to_string()
}
