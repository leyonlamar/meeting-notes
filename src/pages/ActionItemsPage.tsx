import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { ActionItem } from "../types";
import type { Route } from "../App";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { CheckSquare } from "lucide-react";
import { isOverdue } from "../lib/utils";

interface ActionItemsPageProps {
  onNavigate: (route: Route) => void;
}

export function ActionItemsPage({ onNavigate }: ActionItemsPageProps) {
  const [items, setItems] = useState<ActionItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const results = await api.listActionItems({
          status: statusFilter === "all" ? undefined : statusFilter,
          include_done: statusFilter === "all" || statusFilter === "done",
          limit: 200,
        });
        setItems(results);
      } catch (err) {
        console.error("Failed to load action items:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter]);

  const handleStatusChange = async (item: ActionItem, newStatus: string) => {
    await api.updateActionItem({ id: item.id, status: newStatus });
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: newStatus as ActionItem["status"] } : i)));
  };

  const filters = ["open", "in_progress", "done", "all"];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-3xl" style={{ color: 'var(--ink-100)' }}>Action Items</h1>
        <div className="flex gap-0.5 rounded-xl p-1" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
          {filters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                ...(statusFilter === s
                  ? { background: 'var(--surface-elevated)', color: 'var(--gold-400)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
                  : { color: 'var(--ink-400)' }),
              }}
            >
              {s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--gold-500)', borderTopColor: 'transparent' }} />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="h-12 w-12" />}
          title="No action items"
          description={`No ${statusFilter === "all" ? "" : statusFilter + " "}action items found`}
        />
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => {
            const overdue = isOverdue(item.due_date) && item.status !== "done" && item.status !== "cancelled";
            return (
              <Card key={item.id} className={`flex items-start gap-4 animate-in animate-in-delay-${Math.min(i + 1, 4)}`}>
                <input
                  type="checkbox"
                  checked={item.status === "done"}
                  onChange={() => handleStatusChange(item, item.status === "done" ? "open" : "done")}
                  className="mt-1 h-4 w-4 rounded accent-amber-500"
                  style={{ accentColor: 'var(--gold-500)' }}
                />
                <div
                  className="min-w-0 flex-1 cursor-pointer"
                  onClick={() => onNavigate({ page: "meeting-detail", meetingId: item.meeting_id })}
                >
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${item.status === "done" ? "line-through" : ""}`}
                      style={{ color: item.status === "done" ? 'var(--ink-600)' : 'var(--ink-100)' }}>
                      {item.title}
                    </p>
                    {item.is_tentative && <Badge variant="tentative">Tentative</Badge>}
                    {overdue && <Badge variant="danger">Overdue</Badge>}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[12px]" style={{ color: 'var(--ink-500)' }}>
                    {item.owner && <span>Owner: {item.owner}</span>}
                    {item.due_date && (
                      <span style={{ color: overdue ? 'var(--rose)' : undefined, fontWeight: overdue ? 600 : undefined }}>
                        Due: {item.due_date}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={item.priority === "critical" ? "danger" : item.priority === "high" ? "warning" : "default"}>
                    {item.priority}
                  </Badge>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item, e.target.value)}
                    className="rounded-lg px-2 py-1 text-xs outline-none"
                    style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--ink-300)' }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
