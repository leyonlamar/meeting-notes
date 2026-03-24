import { clsx } from "clsx";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  style?: React.CSSProperties;
}

export function Card({ children, className, onClick, glow, style }: CardProps) {
  return (
    <div
      className={clsx(
        "glass-card p-4",
        onClick && "cursor-pointer",
        glow && "glow-gold",
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
