import { useEffect, useState, useCallback } from "react";
import { api } from "../lib/api";
import type { Meeting, RawNote, ProcessedMinutes, ActionItem, Decision, Deliverable, RiskOrBlocker, OpenQuestion, AiExtractedItem } from "../types";
import type { Route } from "../App";
import { Tabs } from "../components/ui/Tabs";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { NoteEditor } from "../components/meetings/NoteEditor";
import { ActionItemRow } from "../components/actions/ActionItemRow";
import { ExtractionReview } from "../components/ai/ExtractionReview";
import { ArrowLeft, Download, Trash2, Plus } from "lucide-react";

interface MeetingDetailPageProps {
  meetingId: string;
  onNavigate: (route: Route) => void;
}

export function MeetingDetailPage({ meetingId, onNavigate }: MeetingDetailPageProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [rawNotes, setRawNotes] = useState<RawNote[]>([]);
  const [minutes, setMinutes] = useState<ProcessedMinutes | null>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [risks, setRisks] = useState<RiskOrBlocker[]>([]);
  const [questions, setQuestions] = useState<OpenQuestion[]>([]);
  const [activeTab, setActiveTab] = useState("notes");
  const [noteContent, setNoteContent] = useState("");
  const [titleEditing, setTitleEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [aiProcessing, setAiProcessing] = useState(false);
  const [extractedItems, setExtractedItems] = useState<AiExtractedItem[] | null>(null);

  const loadAll = useCallback(async () => {
    try {
      const [m, notes, mins, actions, decs, dels, rsks, qs] = await Promise.all([
        api.getMeeting(meetingId),
        api.getRawNotes(meetingId),
        api.getLatestMinutes(meetingId),
        api.listActionItems({ meeting_id: meetingId, include_done: true }),
        api.getDecisions(meetingId),
        api.getDeliverables(meetingId),
        api.getRisksBlockers(meetingId),
        api.getOpenQuestions(meetingId),
      ]);
      setMeeting(m);
      setRawNotes(notes);
      setMinutes(mins);
      setActionItems(actions);
      setDecisions(decs);
      setDeliverables(dels);
      setRisks(rsks);
      setQuestions(qs);
      setTitleDraft(m.title);
      if (notes.length > 0) setNoteContent(notes[notes.length - 1].content);
    } catch (err) {
      console.error("Failed to load meeting:", err);
    }
  }, [meetingId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSaveTitle = async () => {
    if (!titleDraft.trim() || !meeting) return;
    await api.updateMeeting({ id: meeting.id, title: titleDraft.trim() });
    setTitleEditing(false);
    await loadAll();
  };

  const handleAiAction = async (operation: string) => {
    const rawText = rawNotes.map((n) => n.content).join("\n\n");
    const currentText = noteContent || rawText;
    if (!currentText.trim()) return;
    setAiProcessing(true);
    try {
      const response = await api.runAiOperation(operation, currentText, meetingId);
      await loadAll();
      if (response.structured_results.length > 0) {
        setExtractedItems(response.structured_results);
        setActiveTab("actions");
      } else if (response.text_result) {
        setActiveTab("minutes");
      }
    } catch (err) {
      console.error("AI operation failed:", err);
    } finally {
      setAiProcessing(false);
    }
  };

  const handleAddActionItem = async () => {
    await api.createActionItem({ meeting_id: meetingId, title: "New action item" });
    await loadAll();
  };

  const handleExportToFile = async (format: "markdown" | "csv" | "json") => {
    try {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeTextFile } = await import("@tauri-apps/plugin-fs");
      let content: string, defaultName: string, ext: string;
      switch (format) {
        case "markdown":
          content = await api.exportMinutesMarkdown(meetingId);
          ext = "md"; defaultName = `${meeting?.title || "minutes"}.md`; break;
        case "csv":
          content = await api.exportActionItemsCsv(meetingId);
          ext = "csv"; defaultName = `${meeting?.title || "actions"}_actions.csv`; break;
        case "json":
          content = await api.exportActionItemsJson(meetingId);
          ext = "json"; defaultName = `${meeting?.title || "actions"}_actions.json`; break;
      }
      const path = await save({ defaultPath: defaultName, filters: [{ name: format.toUpperCase(), extensions: [ext] }] });
      if (path) await writeTextFile(path, content);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  if (!meeting) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--gold-500)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const tabs = [
    { id: "notes", label: "Raw Notes", count: rawNotes.length },
    { id: "minutes", label: "Minutes" },
    { id: "actions", label: "Actions", count: actionItems.length },
    { id: "entities", label: "Insights", count: decisions.length + deliverables.length + risks.length + questions.length },
    { id: "export", label: "Export" },
  ];

  return (
    <div className="space-y-5 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate({ page: "meetings" })}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--ink-400)' }}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          {titleEditing ? (
            <input
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
              className="w-full bg-transparent font-display text-2xl outline-none"
              style={{ color: 'var(--ink-100)', borderBottom: '2px solid var(--gold-500)' }}
              autoFocus
            />
          ) : (
            <h1
              className="cursor-pointer font-display text-2xl transition-colors"
              style={{ color: 'var(--ink-100)' }}
              onClick={() => setTitleEditing(true)}
            >
              {meeting.title}
            </h1>
          )}
          <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-500)' }}>
            {meeting.meeting_date || "No date"} · {meeting.status}
            {meeting.project && <span style={{ color: 'var(--gold-400)' }}> · {meeting.project}</span>}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={async () => { await api.deleteMeeting(meetingId); onNavigate({ page: "meetings" }); }}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "notes" && (
          <NoteEditor
            meetingId={meetingId} content={noteContent} onChange={setNoteContent}
            onSaved={loadAll} onAiAction={handleAiAction} saving={false} aiProcessing={aiProcessing}
          />
        )}

        {activeTab === "minutes" && (
          minutes ? (
            <Card className="space-y-4">
              {minutes.executive_summary && (
                <div>
                  <h3 className="font-display text-lg" style={{ color: 'var(--gold-400)' }}>Executive Summary</h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--ink-200)' }}>{minutes.executive_summary}</p>
                </div>
              )}
              {minutes.key_discussion_points.length > 0 && (
                <div>
                  <h3 className="font-display text-lg" style={{ color: 'var(--gold-400)' }}>Key Discussion Points</h3>
                  <ul className="mt-2 space-y-1">
                    {minutes.key_discussion_points.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--ink-300)' }}>
                        <span style={{ color: 'var(--gold-500)' }}>·</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {minutes.content_markdown && (
                <div className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed" style={{ color: 'var(--ink-300)' }}>
                  {minutes.content_markdown}
                </div>
              )}
              {!minutes.is_accepted && (
                <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.15)' }}>
                  <Badge variant="warning">Draft</Badge>
                  <span className="text-xs" style={{ color: 'var(--amber)' }}>These minutes have not been accepted yet</span>
                </div>
              )}
            </Card>
          ) : (
            <EmptyState title="No minutes generated" description="Use the AI tools on the Raw Notes tab to generate structured minutes" />
          )
        )}

        {activeTab === "actions" && (
          <div className="space-y-3">
            {extractedItems && (
              <ExtractionReview meetingId={meetingId} items={extractedItems} onDone={() => { setExtractedItems(null); loadAll(); }} />
            )}
            {!extractedItems && (
              <>
                <div className="flex justify-end">
                  <Button size="sm" variant="gold" onClick={handleAddActionItem}>
                    <Plus className="h-3.5 w-3.5" /> Add Action Item
                  </Button>
                </div>
                {actionItems.length === 0 ? (
                  <EmptyState title="No action items" description="Add items manually or extract them from notes using AI" />
                ) : (
                  <div className="space-y-2">
                    {actionItems.map((item) => <ActionItemRow key={item.id} item={item} onUpdated={loadAll} />)}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "entities" && (
          <div className="space-y-8">
            <EntitySection title="Decisions" items={decisions} renderItem={(d) => (
              <Card key={d.id}>
                <div className="flex items-start gap-2">
                  {d.is_tentative && <Badge variant="tentative">Tentative</Badge>}
                  <p className="text-sm" style={{ color: 'var(--ink-200)' }}>{d.content}</p>
                </div>
                {d.rationale && <p className="mt-1 text-xs italic" style={{ color: 'var(--ink-500)' }}>{d.rationale}</p>}
              </Card>
            )} />
            <EntitySection title="Deliverables" items={deliverables} renderItem={(d) => (
              <Card key={d.id}>
                <p className="text-sm font-medium" style={{ color: 'var(--ink-200)' }}>{d.title}</p>
                <p className="text-xs" style={{ color: 'var(--ink-500)' }}>
                  {d.owner && `Owner: ${d.owner}`} {d.due_date && `· Due: ${d.due_date}`}
                </p>
              </Card>
            )} />
            <EntitySection title="Risks & Blockers" items={risks} renderItem={(r) => (
              <Card key={r.id}>
                <div className="flex items-center gap-2">
                  <Badge variant={r.risk_type === "blocker" ? "danger" : "warning"}>{r.risk_type}</Badge>
                  <p className="text-sm" style={{ color: 'var(--ink-200)' }}>{r.content}</p>
                </div>
              </Card>
            )} />
            <EntitySection title="Open Questions" items={questions} renderItem={(q) => (
              <Card key={q.id}>
                <p className="text-sm" style={{ color: 'var(--ink-200)' }}>{q.content}</p>
                {q.assigned_to && <p className="text-xs" style={{ color: 'var(--ink-500)' }}>Assigned to: {q.assigned_to}</p>}
              </Card>
            )} />
          </div>
        )}

        {activeTab === "export" && (
          <div className="space-y-5">
            <p className="text-sm" style={{ color: 'var(--ink-400)' }}>Export meeting data to files</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="gold" onClick={async () => {
                try {
                  const { save } = await import("@tauri-apps/plugin-dialog");
                  const { writeFile } = await import("@tauri-apps/plugin-fs");
                  const bytes = await api.exportMeetingPdf(meetingId);
                  const path = await save({
                    defaultPath: `${meeting?.title || "minutes"}.pdf`,
                    filters: [{ name: "PDF", extensions: ["pdf"] }],
                  });
                  if (path) await writeFile(path, new Uint8Array(bytes));
                } catch (err) { console.error("PDF export failed:", err); }
              }}>
                <Download className="h-4 w-4" /> Save as PDF with Timeline
              </Button>
              <Button variant="secondary" onClick={() => handleExportToFile("markdown")}>
                <Download className="h-4 w-4" /> Save Minutes as Markdown
              </Button>
              <Button variant="secondary" onClick={() => handleExportToFile("csv")}>
                <Download className="h-4 w-4" /> Save Actions as CSV
              </Button>
              <Button variant="secondary" onClick={() => handleExportToFile("json")}>
                <Download className="h-4 w-4" /> Save Actions as JSON
              </Button>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--ink-600)' }}>
              PDF includes a chronological timeline of all discussions, decisions, and action items.
              JSON export uses flat field names compatible with Excel/tabular import.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EntitySection<T>({ title, items, renderItem }: { title: string; items: T[]; renderItem: (item: T) => React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-display text-lg" style={{ color: 'var(--gold-400)' }}>
        {title} <span className="text-sm" style={{ color: 'var(--ink-500)' }}>({items.length})</span>
      </h3>
      {items.length === 0
        ? <p className="text-xs" style={{ color: 'var(--ink-600)' }}>No {title.toLowerCase()} recorded</p>
        : <div className="space-y-2">{items.map(renderItem)}</div>
      }
    </div>
  );
}
