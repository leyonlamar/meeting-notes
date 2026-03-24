import { useState, useEffect } from "react";
import { useThemeStore } from "./stores/theme-store";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { MeetingsPage } from "./pages/MeetingsPage";
import { MeetingDetailPage } from "./pages/MeetingDetailPage";
import { ActionItemsPage } from "./pages/ActionItemsPage";
import { SettingsPage } from "./pages/SettingsPage";

export type Route =
  | { page: "dashboard" }
  | { page: "meetings" }
  | { page: "meeting-detail"; meetingId: string }
  | { page: "action-items" }
  | { page: "settings" };

export default function App() {
  const [route, setRoute] = useState<Route>({ page: "dashboard" });
  const loadTheme = useThemeStore((s) => s.loadTheme);

  useEffect(() => { loadTheme(); }, [loadTheme]);

  const renderPage = () => {
    switch (route.page) {
      case "dashboard":
        return <Dashboard onNavigate={setRoute} />;
      case "meetings":
        return <MeetingsPage onNavigate={setRoute} />;
      case "meeting-detail":
        return <MeetingDetailPage meetingId={route.meetingId} onNavigate={setRoute} />;
      case "action-items":
        return <ActionItemsPage onNavigate={setRoute} />;
      case "settings":
        return <SettingsPage />;
    }
  };

  return (
    <AppLayout currentRoute={route} onNavigate={setRoute}>
      {renderPage()}
    </AppLayout>
  );
}
