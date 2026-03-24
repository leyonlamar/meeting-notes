import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import type { Route } from "../../App";

interface AppLayoutProps {
  children: ReactNode;
  currentRoute: Route;
  onNavigate: (route: Route) => void;
}

export function AppLayout({ children, currentRoute, onNavigate }: AppLayoutProps) {
  return (
    <div className="noise-bg flex h-screen overflow-hidden" style={{ background: 'var(--surface-primary)' }}>
      <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
