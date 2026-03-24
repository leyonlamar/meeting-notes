import { useEffect, useRef } from "react";

/**
 * Autosave hook: calls saveFn when value changes, debounced by intervalMs.
 * Does not fire on mount, only on subsequent changes.
 */
export function useAutosave(
  value: string,
  saveFn: (value: string) => Promise<void>,
  intervalMs: number = 30000,
  enabled: boolean = true
) {
  const lastSaved = useRef(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (!enabled || value === lastSaved.current) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      if (value !== lastSaved.current && value.trim()) {
        try {
          await saveFn(value);
          lastSaved.current = value;
        } catch (err) {
          console.error("Autosave failed:", err);
        }
      }
    }, intervalMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, saveFn, intervalMs, enabled]);
}
