import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { MeetingSummary } from "../types";
import type { Route } from "../App";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Plus, Search, FileText, ArrowRight } from "lucide-react";
import { TemplatePicker } from "../components/meetings/TemplatePicker";
import type { MeetingTemplate } from "../lib/templates";

interface MeetingsPageProps {
  onNavigate: (route: Route) => void;
}

export function MeetingsPage({ onNavigate }: MeetingsPageProps) {
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const loadMeetings = async (query?: string) => {
    try {
      setLoading(true);
      const results = query
        ? await api.searchMeetings(query)
        : await api.listMeetings({ limit: 100 });
      setMeetings(results);
    } catch (err) {
      console.error("Failed to load meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMeetings(); }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadMeetings(searchQuery.trim() || undefined);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleNewMeeting = () => setShowTemplatePicker(true);

  const handleTemplateSelect = async (template: MeetingTemplate, title: string, date: string, project: string) => {
    try {
      const meeting = await api.createMeeting({
        title,
        meeting_date: date,
        project: project || undefined,
        tags: template.tags.length > 0 ? template.tags : undefined,
      });
      if (template.sections) {
        await api.saveRawNote({ meeting_id: meeting.id, content: template.sections });
      }
      setShowTemplatePicker(false);
      onNavigate({ page: "meeting-detail", meetingId: meeting.id });
    } catch (err) {
      console.error("Failed to create meeting:", err);
    }
  };

  if (showTemplatePicker) {
    return <TemplatePicker onSelect={handleTemplateSelect} onClose={() => setShowTemplatePicker(false)} />;
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-3xl" style={{ color: 'var(--ink-100)' }}>Meetings</h1>
        <Button variant="gold" onClick={handleNewMeeting}>
          <Plus className="h-4 w-4" />
          New Meeting
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--ink-500)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search meetings..."
          className="w-full rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none transition-all"
          style={{
            background: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--ink-200)',
          }}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--gold-500)', borderTopColor: 'transparent' }} />
        </div>
      ) : meetings.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12" />}
          title={searchQuery ? "No meetings found" : "No meetings yet"}
          description={searchQuery ? "Try a different search term" : "Create your first meeting to get started"}
          action={!searchQuery ? (
            <Button variant="gold" size="sm" onClick={handleNewMeeting}>
              <Plus className="h-3.5 w-3.5" /> New Meeting
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-2">
          {meetings.map((m, i) => (
            <Card
              key={m.id}
              onClick={() => onNavigate({ page: "meeting-detail", meetingId: m.id })}
              className={`flex items-center justify-between animate-in animate-in-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" style={{ color: 'var(--ink-100)' }}>{m.title}</p>
                <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-500)' }}>
                  {m.meeting_date || "No date"}
                  {m.project && <span style={{ color: 'var(--gold-400)' }}> · {m.project}</span>}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2 pl-4">
                {m.tags.slice(0, 2).map((tag) => <Badge key={tag}>{tag}</Badge>)}
                <Badge variant={m.status === "complete" ? "success" : "default"}>{m.status}</Badge>
                {m.action_item_count > 0 && <Badge variant="info">{m.action_item_count} actions</Badge>}
                <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--ink-600)' }} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
