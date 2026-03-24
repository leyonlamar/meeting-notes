// ── Meetings ──

export interface Meeting {
  id: string;
  title: string;
  meeting_date: string | null;
  location: string | null;
  project: string | null;
  tags: string[];
  status: MeetingStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type MeetingStatus = "draft" | "processing" | "complete" | "archived";

export interface MeetingSummary {
  id: string;
  title: string;
  meeting_date: string | null;
  project: string | null;
  status: string;
  tags: string[];
  action_item_count: number;
  created_at: string;
}

export interface CreateMeetingRequest {
  title: string;
  meeting_date?: string;
  location?: string;
  project?: string;
  tags?: string[];
}

export interface UpdateMeetingRequest {
  id: string;
  title?: string;
  meeting_date?: string;
  location?: string;
  project?: string;
  tags?: string[];
  status?: string;
}

export interface MeetingListFilter {
  search?: string;
  status?: string;
  project?: string;
  tag?: string;
  from_date?: string;
  to_date?: string;
  limit?: number;
  offset?: number;
}

// ── Raw Notes ──

export interface RawNote {
  id: string;
  meeting_id: string;
  content: string;
  source_type: "manual" | "paste" | "import";
  source_filename: string | null;
  created_at: string;
}

export interface SaveRawNoteRequest {
  meeting_id: string;
  content: string;
  source_type?: string;
  source_filename?: string;
}

// ── Processed Minutes ──

export interface ProcessedMinutes {
  id: string;
  meeting_id: string;
  version: number;
  executive_summary: string | null;
  key_discussion_points: string[];
  agenda: string | null;
  content_markdown: string | null;
  is_accepted: boolean;
  ai_provider: string | null;
  ai_run_id: string | null;
  created_at: string;
}

// ── Action Items ──

export interface ActionItem {
  id: string;
  meeting_id: string;
  title: string;
  description: string | null;
  owner: string | null;
  due_date: string | null;
  priority: Priority;
  status: ActionStatus;
  category: string | null;
  tags: string[];
  notes: string | null;
  is_tentative: boolean;
  confidence_score: number | null;
  source_snippet: string | null;
  source_offsets: string | null;
  ai_provider: string | null;
  ai_run_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type Priority = "low" | "medium" | "high" | "critical";
export type ActionStatus = "open" | "in_progress" | "done" | "cancelled";

export interface CreateActionItemRequest {
  meeting_id: string;
  title: string;
  description?: string;
  owner?: string;
  due_date?: string;
  priority?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  is_tentative?: boolean;
  confidence_score?: number;
  source_snippet?: string;
}

export interface UpdateActionItemRequest {
  id: string;
  title?: string;
  description?: string;
  owner?: string;
  due_date?: string;
  priority?: string;
  status?: string;
  category?: string;
  tags?: string[];
  notes?: string;
  is_tentative?: boolean;
}

export interface ActionItemListFilter {
  meeting_id?: string;
  owner?: string;
  status?: string;
  priority?: string;
  due_before?: string;
  due_after?: string;
  search?: string;
  include_done?: boolean;
  limit?: number;
  offset?: number;
}

export interface ActionItemStats {
  open: number;
  overdue: number;
}

// ── Extracted Entities ──

export interface Decision {
  id: string;
  meeting_id: string;
  content: string;
  rationale: string | null;
  decided_by: string | null;
  is_tentative: boolean;
  confidence_score: number | null;
  source_snippet: string | null;
  created_at: string;
}

export interface Deliverable {
  id: string;
  meeting_id: string;
  title: string;
  description: string | null;
  owner: string | null;
  due_date: string | null;
  is_tentative: boolean;
  confidence_score: number | null;
  source_snippet: string | null;
  created_at: string;
}

export interface RiskOrBlocker {
  id: string;
  meeting_id: string;
  content: string;
  risk_type: "risk" | "blocker" | "dependency";
  severity: string | null;
  owner: string | null;
  is_tentative: boolean;
  confidence_score: number | null;
  source_snippet: string | null;
  created_at: string;
}

export interface OpenQuestion {
  id: string;
  meeting_id: string;
  content: string;
  assigned_to: string | null;
  is_tentative: boolean;
  confidence_score: number | null;
  source_snippet: string | null;
  created_at: string;
}

// ── AI ──

export interface AiResponse {
  provider_name: string;
  model_name: string | null;
  operation: string;
  text_result: string | null;
  structured_results: AiExtractedItem[];
  processing_time_ms: number;
}

export interface AiExtractedItem {
  extracted_text: string;
  normalized_value: string | null;
  item_type: string;
  confidence_score: number;
  is_tentative: boolean;
  rationale: string | null;
  source_snippet: string | null;
  owner: string | null;
  due_date: string | null;
  priority: string | null;
}

// ── Settings ──

export interface AppSettings {
  ai_provider: string;
  ai_endpoint: string | null;
  ai_model: string | null;
  theme: string;
  export_format: string;
  autosave_interval_secs: number;
  portable_mode: boolean;
  data_directory: string;
}

export interface UpdateSettingsRequest {
  ai_provider?: string;
  ai_endpoint?: string;
  ai_model?: string;
  theme?: string;
  export_format?: string;
  autosave_interval_secs?: number;
}
