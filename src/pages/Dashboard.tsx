import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { MeetingSummary, ActionItemStats } from "../types";
import type { Route } from "../App";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Plus, FileText, AlertTriangle, CheckSquare, Database, ArrowRight } from "lucide-react";
import { TemplatePicker } from "../components/meetings/TemplatePicker";
import type { MeetingTemplate } from "../lib/templates";

interface DashboardProps {
  onNavigate: (route: Route) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [meetings, setMeetings] = useState<MeetingSummary[]>([]);
  const [stats, setStats] = useState<ActionItemStats>({ open: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [meetingList, actionStats] = await Promise.all([
          api.listMeetings({ limit: 5 }),
          api.getActionItemStats(),
        ]);
        setMeetings(meetingList);
        setStats(actionStats);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--gold-500)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl" style={{ color: 'var(--ink-100)' }}>
            Dashboard
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-500)' }}>
            Your meetings and action intelligence at a glance
          </p>
        </div>
        <Button variant="gold" onClick={handleNewMeeting}>
          <Plus className="h-4 w-4" />
          New Meeting
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 animate-in animate-in-delay-1">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
                Meetings
              </p>
              <p className="stat-number mt-1" style={{ color: 'var(--ink-100)' }}>
                {meetings.length}
              </p>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: 'rgba(212, 168, 83, 0.1)', border: '1px solid rgba(212, 168, 83, 0.15)' }}
            >
              <FileText className="h-5 w-5" style={{ color: 'var(--gold-400)' }} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
                Open Actions
              </p>
              <p className="stat-number mt-1" style={{ color: 'var(--ink-100)' }}>
                {stats.open}
              </p>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.15)' }}
            >
              <CheckSquare className="h-5 w-5" style={{ color: 'var(--cyan)' }} />
            </div>
          </div>
        </Card>

        <Card glow={stats.overdue > 0}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
                Overdue
              </p>
              <p className="stat-number mt-1" style={{ color: stats.overdue > 0 ? 'var(--rose)' : 'var(--ink-100)' }}>
                {stats.overdue}
              </p>
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                background: stats.overdue > 0 ? 'rgba(244, 63, 94, 0.12)' : 'rgba(100, 116, 139, 0.1)',
                border: `1px solid ${stats.overdue > 0 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(100, 116, 139, 0.15)'}`,
              }}
            >
              <AlertTriangle className="h-5 w-5" style={{ color: stats.overdue > 0 ? 'var(--rose)' : 'var(--ink-400)' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Meetings */}
      <div className="animate-in animate-in-delay-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg" style={{ color: 'var(--ink-200)' }}>
            Recent Meetings
          </h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate({ page: "meetings" })}>
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {meetings.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No meetings yet"
            description="Create your first meeting or load sample data to explore the app"
            action={
              <div className="flex gap-3">
                <Button variant="gold" onClick={handleNewMeeting}>
                  <Plus className="h-3.5 w-3.5" />
                  New Meeting
                </Button>
                <Button variant="secondary" onClick={async () => {
                  try {
                    await api.seedSampleData();
                    const [meetingList, actionStats] = await Promise.all([
                      api.listMeetings({ limit: 5 }),
                      api.getActionItemStats(),
                    ]);
                    setMeetings(meetingList);
                    setStats(actionStats);
                  } catch (err) {
                    console.error("Failed to seed data:", err);
                  }
                }}>
                  <Database className="h-3.5 w-3.5" />
                  Load Sample Data
                </Button>
              </div>
            }
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
                  <p className="text-sm font-medium" style={{ color: 'var(--ink-100)' }}>{m.title}</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-500)' }}>
                    {m.meeting_date || "No date"}
                    {m.project && <span style={{ color: 'var(--gold-400)' }}> · {m.project}</span>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2 pl-4">
                  <Badge variant={m.status === "complete" ? "success" : "default"}>
                    {m.status}
                  </Badge>
                  {m.action_item_count > 0 && (
                    <Badge variant="info">{m.action_item_count} actions</Badge>
                  )}
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--ink-600)' }} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
