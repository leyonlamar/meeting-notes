import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { AppSettings } from "../types";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Save, Key, Trash2, FolderOpen, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../stores/theme-store";

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [providers, setProviders] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const [s, p] = await Promise.all([api.getSettings(), api.listAiProviders()]);
      setSettings(s);
      setProviders(p);
      if (s.ai_provider !== "mock") {
        const has = await api.hasApiKey(s.ai_provider);
        setHasKey(has);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await api.updateSettings({
        ai_provider: settings.ai_provider,
        ai_endpoint: settings.ai_endpoint || undefined,
        ai_model: settings.ai_model || undefined,
        theme: settings.theme,
        export_format: settings.export_format,
        autosave_interval_secs: settings.autosave_interval_secs,
      });
      setSettings(updated);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: 'var(--surface-elevated)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--ink-200)',
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--gold-500)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <h1 className="font-display text-3xl" style={{ color: 'var(--ink-100)' }}>Settings</h1>

      {/* AI Provider */}
      <Card>
        <h2 className="mb-4 font-display text-lg" style={{ color: 'var(--gold-400)' }}>AI Provider</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>Provider</label>
            <select
              value={settings.ai_provider}
              onChange={(e) => setSettings({ ...settings, ai_provider: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              {providers.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>Endpoint URL</label>
            <input
              type="text"
              value={settings.ai_endpoint || ""}
              onChange={(e) => setSettings({ ...settings, ai_endpoint: e.target.value })}
              placeholder="http://localhost:11434/v1"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-gray-600"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>Model Name</label>
            <input
              type="text"
              value={settings.ai_model || ""}
              onChange={(e) => setSettings({ ...settings, ai_model: e.target.value })}
              placeholder="e.g., llama3, gpt-4o-mini"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-gray-600"
              style={inputStyle}
            />
          </div>
        </div>
      </Card>

      {/* API Key */}
      {settings.ai_provider !== "mock" && (
        <Card>
          <h2 className="mb-4 font-display text-lg" style={{ color: 'var(--gold-400)' }}>API Key</h2>
          <p className="mb-3 text-[12px]" style={{ color: 'var(--ink-500)' }}>
            Keys are stored securely in Windows Credential Store, never in config files.
          </p>
          {hasKey ? (
            <div className="flex items-center gap-3">
              <Badge variant="success">Key stored</Badge>
              <Button variant="danger" size="sm" onClick={async () => { await api.deleteApiKey(settings.ai_provider); setHasKey(false); }}>
                <Trash2 className="h-3.5 w-3.5" /> Remove Key
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter API key..."
                className="flex-1 rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-gray-600"
                style={inputStyle}
              />
              <Button variant="gold" size="sm" onClick={async () => {
                if (!apiKeyInput.trim()) return;
                await api.storeApiKey(settings.ai_provider, apiKeyInput);
                setApiKeyInput(""); setHasKey(true);
              }}>
                <Key className="h-3.5 w-3.5" /> Store Key
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* General */}
      <Card>
        <h2 className="mb-4 font-display text-lg" style={{ color: 'var(--gold-400)' }}>General</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>Default Export Format</label>
            <select
              value={settings.export_format}
              onChange={(e) => setSettings({ ...settings, export_format: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              <option value="pdf">PDF</option>
              <option value="markdown">Markdown</option>
              <option value="txt">Plain Text</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>Autosave Interval (seconds)</label>
            <input
              type="number" min={5} max={300}
              value={settings.autosave_interval_secs}
              onChange={(e) => setSettings({ ...settings, autosave_interval_secs: parseInt(e.target.value) || 30 })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <h2 className="mb-4 font-display text-lg" style={{ color: 'var(--gold-400)' }}>Appearance</h2>
        <div className="flex gap-3">
          <ThemeButton label="Dark" theme="dark" icon={<Moon className="h-4 w-4" />} />
          <ThemeButton label="Light" theme="light" icon={<Sun className="h-4 w-4" />} />
        </div>
      </Card>

      {/* Storage */}
      <Card>
        <h2 className="mb-4 font-display text-lg" style={{ color: 'var(--gold-400)' }}>Storage</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-400)' }}>
            <span>Mode:</span>
            <Badge variant={settings.portable_mode ? "info" : "default"}>
              {settings.portable_mode ? "Portable" : "Standard"}
            </Badge>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
              Data Directory
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.data_directory}
                readOnly
                className="flex-1 rounded-xl px-3 py-2.5 text-[12px] font-mono outline-none"
                style={inputStyle}
              />
              <Button variant="secondary" size="sm" onClick={async () => {
                try {
                  const { open } = await import("@tauri-apps/plugin-dialog");
                  const dir = await open({ directory: true, title: "Choose Data Directory" });
                  if (dir) {
                    setSettings({ ...settings, data_directory: dir as string });
                  }
                } catch (err) {
                  console.error("Directory pick failed:", err);
                }
              }}>
                <FolderOpen className="h-3.5 w-3.5" /> Browse
              </Button>
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: 'var(--ink-600)' }}>
              Contains: db/, config/, exports/, logs/. Changes take effect after restart.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="gold" onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}

function ThemeButton({ label, theme, icon }: { label: string; theme: "dark" | "light"; icon: React.ReactNode }) {
  const { theme: current, setTheme } = useThemeStore();
  const isActive = current === theme;

  return (
    <button
      onClick={() => setTheme(theme)}
      className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all"
      style={{
        background: isActive ? 'rgba(212, 168, 83, 0.12)' : 'var(--surface-elevated)',
        border: `1px solid ${isActive ? 'rgba(212, 168, 83, 0.3)' : 'var(--border-subtle)'}`,
        color: isActive ? 'var(--gold-400)' : 'var(--ink-400)',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
