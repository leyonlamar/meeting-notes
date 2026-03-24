import { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { FolderOpen, FileText, X, Upload } from "lucide-react";

interface ImportFile {
  path: string;
  name: string;
  selected: boolean;
  preview: string;
  size: string;
}

interface ImportDialogProps {
  meetingId: string;
  onImported: (content: string) => void;
  onClose: () => void;
}

export function ImportDialog({ onImported, onClose }: ImportDialogProps) {
  const [files, setFiles] = useState<ImportFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"choose" | "files" | "directory">("choose");

  const handlePickFiles = async () => {
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const selected = await open({
        multiple: true,
        filters: [
          { name: "Text Files", extensions: ["txt", "md", "markdown", "csv", "log"] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (selected) {
        const paths = Array.isArray(selected) ? selected : [selected];
        await loadFiles(paths as string[]);
        setMode("files");
      }
    } catch (err) {
      console.error("File pick failed:", err);
    }
  };

  const handlePickDirectory = async () => {
    try {
      const { open } = await import("@tauri-apps/plugin-dialog");
      const dir = await open({ directory: true });

      if (dir) {
        setLoading(true);
        // Use Tauri fs to list directory contents
        const { readDir } = await import("@tauri-apps/plugin-fs");
        const entries = await readDir(dir as string);
        const textFiles = entries
          .filter((e: { name: string; isFile: boolean }) =>
            e.isFile && /\.(txt|md|markdown|csv|log)$/i.test(e.name)
          )
          .map((e: { name: string }) => `${dir}/${e.name}`);

        if (textFiles.length > 0) {
          await loadFiles(textFiles);
          setMode("directory");
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Directory scan failed:", err);
      setLoading(false);
    }
  };

  const loadFiles = async (paths: string[]) => {
    setLoading(true);
    try {
      const { readTextFile } = await import("@tauri-apps/plugin-fs");
      const loaded: ImportFile[] = [];

      for (const path of paths) {
        try {
          const content = await readTextFile(path);
          const name = path.split(/[/\\]/).pop() || path;
          const sizeKb = Math.round(new Blob([content]).size / 1024);
          loaded.push({
            path,
            name,
            selected: true,
            preview: content.slice(0, 200),
            size: sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)}MB` : `${sizeKb}KB`,
          });
        } catch {
          // Skip unreadable files
        }
      }

      setFiles(loaded);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFile = (index: number) => {
    setFiles((prev) => prev.map((f, i) => i === index ? { ...f, selected: !f.selected } : f));
  };

  const handleSelectAll = () => setFiles((prev) => prev.map((f) => ({ ...f, selected: true })));
  const handleSelectNone = () => setFiles((prev) => prev.map((f) => ({ ...f, selected: false })));

  const handleImport = async () => {
    const selected = files.filter((f) => f.selected);
    if (selected.length === 0) return;

    setLoading(true);
    try {
      const { readTextFile } = await import("@tauri-apps/plugin-fs");
      const contents: string[] = [];

      for (const file of selected) {
        const content = await readTextFile(file.path);
        contents.push(`--- Imported from: ${file.name} ---\n\n${content}`);
      }

      onImported(contents.join("\n\n"));
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = files.filter((f) => f.selected).length;

  // Choose mode screen
  if (mode === "choose") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg" style={{ color: 'var(--gold-400)' }}>Import Notes</h3>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <p className="text-[13px]" style={{ color: 'var(--ink-500)' }}>
          Choose how to import meeting notes
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={handlePickFiles} className="flex flex-col items-center gap-3 py-8 cursor-pointer">
            <FileText className="h-8 w-8" style={{ color: 'var(--gold-400)' }} />
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--ink-100)' }}>Select Files</p>
              <p className="text-[11px]" style={{ color: 'var(--ink-500)' }}>Pick one or more text files</p>
            </div>
          </Card>
          <Card onClick={handlePickDirectory} className="flex flex-col items-center gap-3 py-8 cursor-pointer">
            <FolderOpen className="h-8 w-8" style={{ color: 'var(--gold-400)' }} />
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--ink-100)' }}>Scan Directory</p>
              <p className="text-[11px]" style={{ color: 'var(--ink-500)' }}>Import from a folder of notes</p>
            </div>
          </Card>
        </div>
        <p className="text-[11px]" style={{ color: 'var(--ink-600)' }}>
          Supports: .txt, .md, .markdown, .csv, .log
        </p>
      </div>
    );
  }

  // File selection screen
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg" style={{ color: 'var(--gold-400)' }}>
            {mode === "directory" ? "Directory Contents" : "Selected Files"}
          </h3>
          <p className="text-[12px]" style={{ color: 'var(--ink-500)' }}>
            {selectedCount} of {files.length} files selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setMode("choose")}>Back</Button>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={handleSelectAll}>Select All</Button>
        <Button variant="ghost" size="sm" onClick={handleSelectNone}>Select None</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--gold-500)', borderTopColor: 'transparent' }} />
        </div>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {files.map((file, i) => (
            <Card
              key={i}
              onClick={() => handleToggleFile(i)}
              className="cursor-pointer"
              style={file.selected ? { border: '1px solid rgba(212, 168, 83, 0.3)', background: 'rgba(212, 168, 83, 0.05)' } : undefined}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={file.selected}
                  onChange={() => handleToggleFile(i)}
                  className="mt-1 h-4 w-4"
                  style={{ accentColor: 'var(--gold-500)' }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--ink-100)' }}>{file.name}</p>
                    <Badge>{file.size}</Badge>
                  </div>
                  <p className="mt-1 truncate text-[11px] italic" style={{ color: 'var(--ink-500)' }}>
                    {file.preview}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="gold" onClick={handleImport} disabled={loading || selectedCount === 0}>
          <Upload className="h-4 w-4" />
          Import {selectedCount} {selectedCount === 1 ? "File" : "Files"}
        </Button>
      </div>
    </div>
  );
}
