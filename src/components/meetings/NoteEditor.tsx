import { useCallback, useState } from "react";
import { api } from "../../lib/api";
import { useAutosave } from "../../hooks/use-autosave";
import { Button } from "../ui/Button";
import { ImportDialog } from "./ImportDialog";
import { Save, Sparkles, Upload, Clock } from "lucide-react";

interface NoteEditorProps {
  meetingId: string;
  content: string;
  onChange: (content: string) => void;
  onSaved: () => void;
  onAiAction: (operation: string) => void;
  saving: boolean;
  aiProcessing: boolean;
}

export function NoteEditor({ meetingId, content, onChange, onSaved, onAiAction, saving, aiProcessing }: NoteEditorProps) {
  const [showImport, setShowImport] = useState(false);

  const handleSave = useCallback(async (value: string) => {
    await api.saveRawNote({ meeting_id: meetingId, content: value });
    onSaved();
  }, [meetingId, onSaved]);

  useAutosave(content, handleSave, 30000, true);

  const handleImported = (importedContent: string) => {
    onChange(content ? content + "\n\n" + importedContent : importedContent);
    setShowImport(false);
  };

  if (showImport) {
    return <ImportDialog meetingId={meetingId} onImported={handleImported} onClose={() => setShowImport(false)} />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px]" style={{ color: 'var(--ink-500)' }}>
          Raw notes are preserved as-is — never modified by AI
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onChange(content + `\n[${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}] `)}>
            <Clock className="h-3.5 w-3.5" /> Timestamp
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowImport(true)}>
            <Upload className="h-3.5 w-3.5" /> Import
          </Button>
          <Button variant="secondary" size="sm" onClick={() => content.trim() && handleSave(content)} disabled={saving || !content.trim()}>
            <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="gold" size="sm" onClick={() => onAiAction("extract_action_items")} disabled={aiProcessing || !content.trim()}>
            <Sparkles className="h-3.5 w-3.5" /> Extract Actions
          </Button>
          <Button variant="gold" size="sm" onClick={() => onAiAction("generate_minutes")} disabled={aiProcessing || !content.trim()}>
            <Sparkles className="h-3.5 w-3.5" /> Generate Minutes
          </Button>
        </div>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"Type or paste your meeting notes here...\n\nSupports:\n• Bullet points and rough notes\n• Pasted transcripts (Teams, Zoom, Google Meet)\n• Markdown formatting\n• Use \"Import\" to load files or scan a directory"}
        className="h-[500px] w-full resize-y rounded-xl p-5 font-mono text-[13px] leading-relaxed outline-none transition-all placeholder:opacity-40"
        style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', color: 'var(--ink-200)' }}
        spellCheck
      />
    </div>
  );
}
