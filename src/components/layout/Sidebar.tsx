import type { Route } from "../../App";
import { LayoutDashboard, FileText, CheckSquare, Settings, Zap, Sun, Moon } from "lucide-react";
import { clsx } from "clsx";
import { useThemeStore } from "../../stores/theme-store";

interface SidebarProps {
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

const navItems: { label: string; icon: typeof LayoutDashboard; route: Route }[] = [
  { label: "Dashboard", icon: LayoutDashboard, route: { page: "dashboard" } },
  { label: "Meetings", icon: FileText, route: { page: "meetings" } },
  { label: "Action Items", icon: CheckSquare, route: { page: "action-items" } },
  { label: "Settings", icon: Settings, route: { page: "settings" } },
];

export function Sidebar({ currentRoute, onNavigate }: SidebarProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <aside
      className="flex w-60 flex-col"
      style={{
        background: 'var(--surface-secondary)',
        borderRight: '1px solid var(--border-subtle)',
      }}
      data-no-select
    >
      {/* Brand */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
              boxShadow: '0 4px 12px rgba(212, 168, 83, 0.3)',
            }}
          >
            <Zap className="h-4.5 w-4.5 text-white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
          </div>
          <div>
            <p className="font-display text-lg leading-tight" style={{ color: 'var(--ink-100)' }}>
              Meet Intelligence
            </p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--ink-500)' }}>
              Action Clarity
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
          Workspace
        </p>
        {navItems.map((item) => {
          const isActive = currentRoute.page === item.route.page;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.route)}
              className={clsx(
                "sidebar-item w-full text-left",
                isActive && "sidebar-item-active"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              <span className="text-[13px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 space-y-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          onClick={toggleTheme}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] transition-all"
          style={{ color: 'var(--ink-400)' }}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="flex items-center gap-2 px-3">
          <div className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--emerald)' }} />
          <p className="text-[11px]" style={{ color: 'var(--ink-500)' }}>
            Local Mode · v0.1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
