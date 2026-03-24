import { clsx } from "clsx";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-0.5 rounded-xl p-1" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "relative rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
          )}
          style={{
            ...(activeTab === tab.id
              ? {
                  background: 'var(--surface-elevated)',
                  color: 'var(--gold-400)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }
              : {
                  color: 'var(--ink-400)',
                }),
          }}
        >
          {tab.label}
          {tab.count !== undefined && tab.count > 0 && (
            <span
              className="ml-1.5 rounded-md px-1.5 py-0.5 text-[10px]"
              style={{
                background: activeTab === tab.id ? 'rgba(212, 168, 83, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                color: activeTab === tab.id ? 'var(--gold-400)' : 'var(--ink-400)',
              }}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
