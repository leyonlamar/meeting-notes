import { type ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
}

export function Button({ variant = "primary", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed",
        {
          "text-white": variant === "primary" || variant === "gold" || variant === "danger",
          "border disabled:border-opacity-50": variant === "secondary",
          "disabled:bg-transparent": variant === "ghost",
        },
        {
          "px-2.5 py-1.5 text-xs gap-1.5 rounded-lg": size === "sm",
          "px-4 py-2 text-sm gap-2": size === "md",
          "px-5 py-2.5 text-sm gap-2": size === "lg",
        },
        className
      )}
      style={{
        ...(variant === "primary" ? {
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
        } : {}),
        ...(variant === "gold" ? {
          background: 'linear-gradient(135deg, var(--gold-500), var(--gold-400))',
          boxShadow: '0 2px 8px rgba(212, 168, 83, 0.3)',
        } : {}),
        ...(variant === "secondary" ? {
          background: 'var(--surface-card)',
          borderColor: 'var(--border-medium)',
          color: 'var(--ink-200)',
        } : {}),
        ...(variant === "ghost" ? {
          color: 'var(--ink-400)',
        } : {}),
        ...(variant === "danger" ? {
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
        } : {}),
      }}
      {...props}
    >
      {children}
    </button>
  );
}
