import { useState } from "react";
import { api } from "../../lib/api";
import type { ActionItem } from "../../types";
import { Badge } from "../ui/Badge";
import { isOverdue } from "../../lib/utils";
import { Check, X, Pencil } from "lucide-react";

interface ActionItemRowProps {
  item: ActionItem;
  onUpdated: () => void;
  showMeetingLink?: boolean;
  onNavigateToMeeting?: (meetingId: string) => void;
}

export function ActionItemRow({ item, onUpdated }: ActionItemRowProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [owner, setOwner] = useState(item.owner || "");
  const [dueDate, setDueDate] = useState(item.due_date || "");
  const overdue = isOverdue(item.due_date) && item.status !== "done" && item.status !== "cancelled";

  const handleSaveEdit = async () => {
    await api.updateActionItem({ id: item.id, title: title.trim() || item.title, owner: owner.trim() || undefined, due_date: dueDate || undefined });
    setEditing(false);
    onUpdated();
  };

  const inputStyle = { background: 'var(--surface-elevated)', border: '1px solid var(--border-medium)', color: 'var(--ink-200)' };

  if (editing) {
    return (
      <div className="flex flex-col gap-2 rounded-xl p-4" style={{ background: 'var(--surface-elevated)', border: '1px solid rgba(212, 168, 83, 0.2)' }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg px-3 py-1.5 text-sm outline-none" style={inputStyle} placeholder="Title" autoFocus onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()} />
        <div className="flex gap-2">
          <input value={owner} onChange={(e) => setOwner(e.target.value)} className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none" style={inputStyle} placeholder="Owner" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-lg px-3 py-1.5 text-xs outline-none" style={inputStyle} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => { setTitle(item.title); setOwner(item.owner || ""); setDueDate(item.due_date || ""); setEditing(false); }} className="rounded-lg p-1.5" style={{ color: 'var(--ink-400)' }}><X className="h-4 w-4" /></button>
          <button onClick={handleSaveEdit} className="rounded-lg p-1.5" style={{ color: 'var(--emerald)' }}><Check className="h-4 w-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex items-start gap-3 p-3.5">
      <input
        type="checkbox" checked={item.status === "done"}
        onChange={async () => { await api.updateActionItem({ id: item.id, status: item.status === "done" ? "open" : "done" }); onUpdated(); }}
        className="mt-1 h-4 w-4 rounded" style={{ accentColor: 'var(--gold-500)' }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${item.status === "done" ? "line-through" : ""}`} style={{ color: item.status === "done" ? 'var(--ink-600)' : 'var(--ink-100)' }}>
            {item.title}
          </p>
          {item.is_tentative && <Badge variant="tentative">Tentative</Badge>}
          {overdue && <Badge variant="danger">Overdue</Badge>}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[12px]" style={{ color: 'var(--ink-500)' }}>
          {item.owner && <span>Owner: {item.owner}</span>}
          {item.due_date && <span style={overdue ? { color: 'var(--rose)', fontWeight: 600 } : undefined}>Due: {item.due_date}</span>}
          {item.confidence_score != null && <span>Confidence: {Math.round(item.confidence_score * 100)}%</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={item.priority === "critical" ? "danger" : item.priority === "high" ? "warning" : "default"}>{item.priority}</Badge>
        <select value={item.status} onChange={async (e) => { await api.updateActionItem({ id: item.id, status: e.target.value }); onUpdated(); }}
          className="rounded-lg px-2 py-1 text-xs outline-none" style={{ background: 'var(--surface-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--ink-300)' }}>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button onClick={() => setEditing(true)} className="rounded-lg p-1.5 transition-colors" style={{ color: 'var(--ink-500)' }}><Pencil className="h-3.5 w-3.5" /></button>
        <button onClick={async () => { await api.deleteActionItem(item.id); onUpdated(); }} className="rounded-lg p-1.5 transition-colors" style={{ color: 'var(--ink-500)' }}><X className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}
