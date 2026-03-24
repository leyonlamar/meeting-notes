import { useState } from "react";
import { MEETING_TEMPLATES, type MeetingTemplate } from "../../lib/templates";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { X } from "lucide-react";

interface TemplatePickerProps {
  onSelect: (template: MeetingTemplate, title: string, date: string, project: string) => void;
  onClose: () => void;
}

export function TemplatePicker({ onSelect, onClose }: TemplatePickerProps) {
  const [selected, setSelected] = useState<MeetingTemplate | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [project, setProject] = useState("");

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--input-text)',
  };

  // Step 1: Pick a template
  if (!selected) {
    return (
      <div className="space-y-5 animate-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl" style={{ color: 'var(--ink-100)' }}>New Meeting</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-500)' }}>Choose a template to get started</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MEETING_TEMPLATES.map((t) => (
            <Card
              key={t.id}
              onClick={() => {
                setSelected(t);
                setTitle(`${t.defaultTitle} — ${new Date().toLocaleDateString()}`);
              }}
              className="cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--ink-100)' }}>{t.name}</p>
                  <p className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-500)' }}>{t.description}</p>
                  {t.tags.length > 0 && (
                    <div className="mt-2 flex gap-1">
                      {t.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Configure and create
  return (
    <div className="space-y-5 animate-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selected.icon}</span>
          <div>
            <h2 className="font-display text-2xl" style={{ color: 'var(--ink-100)' }}>{selected.name}</h2>
            <p className="text-[13px]" style={{ color: 'var(--ink-500)' }}>{selected.description}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>Back</Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
            Meeting Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={inputStyle}
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
              Project / Label
            </label>
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="e.g., Project Atlas"
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none placeholder:opacity-40"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Template preview */}
      {selected.sections && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
            Template Preview
          </p>
          <div
            className="max-h-48 overflow-y-auto rounded-xl p-4 font-mono text-[12px] leading-relaxed"
            style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--ink-400)' }}
          >
            <pre className="whitespace-pre-wrap">{selected.sections.slice(0, 500)}{selected.sections.length > 500 ? "\n..." : ""}</pre>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => setSelected(null)}>Cancel</Button>
        <Button variant="gold" onClick={() => onSelect(selected, title.trim() || selected.defaultTitle, date, project)}>
          Create Meeting
        </Button>
      </div>
    </div>
  );
}
