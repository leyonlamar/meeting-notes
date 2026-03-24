import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="mb-5" style={{ color: 'var(--ink-600)' }}>
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium" style={{ color: 'var(--ink-200)' }}>{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px]" style={{ color: 'var(--ink-500)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
