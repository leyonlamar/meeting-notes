import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "tentative" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const styles: Record<string, { bg: string; color: string; border?: string }> = {
    default: { bg: 'rgba(100, 116, 139, 0.15)', color: 'var(--ink-300)' },
    success: { bg: 'rgba(52, 211, 153, 0.15)', color: 'var(--emerald)', border: 'rgba(52, 211, 153, 0.2)' },
    warning: { bg: 'rgba(251, 191, 36, 0.15)', color: 'var(--amber)', border: 'rgba(251, 191, 36, 0.2)' },
    danger: { bg: 'rgba(244, 63, 94, 0.15)', color: 'var(--rose)', border: 'rgba(244, 63, 94, 0.2)' },
    tentative: { bg: 'rgba(139, 92, 246, 0.15)', color: 'var(--violet)', border: 'rgba(139, 92, 246, 0.2)' },
    info: { bg: 'rgba(212, 168, 83, 0.12)', color: 'var(--gold-400)', border: 'rgba(212, 168, 83, 0.2)' },
  };

  const s = styles[variant] || styles.default;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium tracking-wide",
        className
      )}
      style={{
        background: s.bg,
        color: s.color,
        border: s.border ? `1px solid ${s.border}` : undefined,
      }}
    >
      {children}
    </span>
  );
}
