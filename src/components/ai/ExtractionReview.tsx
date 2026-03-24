import { useState } from "react";
import type { AiExtractedItem, CreateActionItemRequest } from "../../types";
import { api } from "../../lib/api";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Check, X } from "lucide-react";

interface ExtractionReviewProps {
  meetingId: string;
  items: AiExtractedItem[];
  onDone: () => void;
}

export function ExtractionReview({ meetingId, items, onDone }: ExtractionReviewProps) {
  const [pending, setPending] = useState<(AiExtractedItem & { accepted: boolean | null })[]>(
    items.map((i) => ({ ...i, accepted: null }))
  );
  const [saving, setSaving] = useState(false);

  const handleAccept = (i: number) => setPending((p) => p.map((item, idx) => idx === i ? { ...item, accepted: true } : item));
  const handleReject = (i: number) => setPending((p) => p.map((item, idx) => idx === i ? { ...item, accepted: false } : item));
  const handleEditText = (i: number, text: string) => setPending((p) => p.map((item, idx) => idx === i ? { ...item, extracted_text: text } : item));

  const handleCommit = async () => {
    setSaving(true);
    try {
      for (const item of pending.filter((i) => i.accepted === true)) {
        const req: CreateActionItemRequest = {
          meeting_id: meetingId, title: item.extracted_text, owner: item.owner || undefined,
          due_date: item.due_date || undefined, priority: item.priority || "medium",
          is_tentative: item.is_tentative, confidence_score: item.confidence_score,
          source_snippet: item.source_snippet || undefined,
        };
        await api.createActionItem(req);
      }
      onDone();
    } finally { setSaving(false); }
  };

  const acceptedCount = pending.filter((i) => i.accepted === true).length;
  const reviewedCount = pending.filter((i) => i.accepted !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg" style={{ color: 'var(--gold-400)' }}>Review AI Extractions</h3>
          <p className="text-[12px]" style={{ color: 'var(--ink-500)' }}>{reviewedCount}/{pending.length} reviewed · {acceptedCount} accepted</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onDone}>Cancel</Button>
          <Button variant="gold" size="sm" onClick={handleCommit} disabled={saving || acceptedCount === 0}>
            {saving ? "Saving..." : `Save ${acceptedCount} Items`}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {pending.map((item, index) => (
          <Card
            key={index}
            className={`transition-opacity duration-200 ${item.accepted === false ? "opacity-30" : ""}`}
            style={item.accepted === true ? { border: '1px solid rgba(52, 211, 153, 0.25)', background: 'rgba(52, 211, 153, 0.05)' } : undefined}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <input value={item.extracted_text} onChange={(e) => handleEditText(index, e.target.value)}
                    className="flex-1 bg-transparent text-sm font-medium outline-none" style={{ color: 'var(--ink-100)' }} />
                  {item.is_tentative && <Badge variant="tentative">Tentative</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-3 text-[11px]" style={{ color: 'var(--ink-500)' }}>
                  <span>Confidence: {Math.round(item.confidence_score * 100)}%</span>
                  {item.owner && <span>Owner: {item.owner}</span>}
                  {item.due_date && <span>Due: {item.due_date}</span>}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => handleAccept(index)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: item.accepted === true ? 'var(--emerald)' : 'var(--ink-500)', background: item.accepted === true ? 'rgba(52,211,153,0.15)' : undefined }}>
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={() => handleReject(index)}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: item.accepted === false ? 'var(--rose)' : 'var(--ink-500)', background: item.accepted === false ? 'rgba(244,63,94,0.15)' : undefined }}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
