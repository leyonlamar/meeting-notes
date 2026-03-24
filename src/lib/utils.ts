import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "No date";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export function isOverdue(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;
  const today = new Date().toISOString().split("T")[0];
  return dueDate < today;
}

export function priorityColor(priority: string): "default" | "warning" | "danger" {
  switch (priority) {
    case "critical": return "danger";
    case "high": return "warning";
    default: return "default";
  }
}

export function statusColor(status: string): "default" | "success" | "info" | "warning" {
  switch (status) {
    case "done": return "success";
    case "complete": return "success";
    case "in_progress": return "info";
    case "processing": return "warning";
    default: return "default";
  }
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + "…";
}
