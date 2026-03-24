import { invoke } from "@tauri-apps/api/core";
import type {
  Meeting,
  MeetingSummary,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  MeetingListFilter,
  RawNote,
  SaveRawNoteRequest,
  ProcessedMinutes,
  ActionItem,
  CreateActionItemRequest,
  UpdateActionItemRequest,
  ActionItemListFilter,
  ActionItemStats,
  Decision,
  Deliverable,
  RiskOrBlocker,
  OpenQuestion,
  AiResponse,
  AppSettings,
  UpdateSettingsRequest,
} from "../types";

// ── Meetings ──

export const api = {
  // Meetings
  createMeeting: (req: CreateMeetingRequest) =>
    invoke<Meeting>("create_meeting", { req }),

  getMeeting: (id: string) =>
    invoke<Meeting>("get_meeting", { id }),

  updateMeeting: (req: UpdateMeetingRequest) =>
    invoke<Meeting>("update_meeting", { req }),

  deleteMeeting: (id: string) =>
    invoke<void>("delete_meeting", { id }),

  listMeetings: (filter: MeetingListFilter = {}) =>
    invoke<MeetingSummary[]>("list_meetings", { filter }),

  // Raw Notes
  saveRawNote: (req: SaveRawNoteRequest) =>
    invoke<RawNote>("save_raw_note", { req }),

  getRawNotes: (meetingId: string) =>
    invoke<RawNote[]>("get_raw_notes", { meetingId }),

  // Minutes
  getLatestMinutes: (meetingId: string) =>
    invoke<ProcessedMinutes | null>("get_latest_minutes", { meetingId }),

  // Extracted Entities
  getDecisions: (meetingId: string) =>
    invoke<Decision[]>("get_decisions", { meetingId }),

  getDeliverables: (meetingId: string) =>
    invoke<Deliverable[]>("get_deliverables", { meetingId }),

  getRisksBlockers: (meetingId: string) =>
    invoke<RiskOrBlocker[]>("get_risks_blockers", { meetingId }),

  getOpenQuestions: (meetingId: string) =>
    invoke<OpenQuestion[]>("get_open_questions", { meetingId }),

  // Action Items
  createActionItem: (req: CreateActionItemRequest) =>
    invoke<ActionItem>("create_action_item", { req }),

  getActionItem: (id: string) =>
    invoke<ActionItem>("get_action_item", { id }),

  updateActionItem: (req: UpdateActionItemRequest) =>
    invoke<ActionItem>("update_action_item", { req }),

  deleteActionItem: (id: string) =>
    invoke<void>("delete_action_item", { id }),

  listActionItems: (filter: ActionItemListFilter = {}) =>
    invoke<ActionItem[]>("list_action_items", { filter }),

  getActionItemStats: () =>
    invoke<ActionItemStats>("get_action_item_stats"),

  // Search
  searchMeetings: (query: string, limit?: number) =>
    invoke<MeetingSummary[]>("search_meetings", { query, limit }),

  // Export
  exportMinutesMarkdown: (meetingId: string) =>
    invoke<string>("export_minutes_markdown", { meetingId }),

  exportActionItemsCsv: (meetingId?: string) =>
    invoke<string>("export_action_items_csv", { meetingId }),

  exportActionItemsJson: (meetingId?: string) =>
    invoke<string>("export_action_items_json", { meetingId }),

  exportMeetingPdf: (meetingId: string) =>
    invoke<number[]>("export_meeting_pdf", { meetingId }),

  // AI
  runAiOperation: (operation: string, inputText: string, meetingId: string) =>
    invoke<AiResponse>("run_ai_operation", { operation, inputText, meetingId }),

  listAiProviders: () =>
    invoke<string[]>("list_ai_providers"),

  // Settings
  getSettings: () =>
    invoke<AppSettings>("get_settings"),

  updateSettings: (req: UpdateSettingsRequest) =>
    invoke<AppSettings>("update_settings", { req }),

  storeApiKey: (provider: string, apiKey: string) =>
    invoke<void>("store_api_key", { req: { provider, api_key: apiKey } }),

  hasApiKey: (provider: string) =>
    invoke<boolean>("has_api_key", { provider }),

  deleteApiKey: (provider: string) =>
    invoke<void>("delete_api_key", { provider }),

  // Dev
  seedSampleData: () =>
    invoke<string>("seed_sample_data"),
};
