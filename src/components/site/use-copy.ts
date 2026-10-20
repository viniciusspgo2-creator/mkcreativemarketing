"use client";
import { useSite } from "@/components/app-shell";
/** Plain text only: editable copy never becomes HTML or executable markup. */
export function useCopy(group: string) {
  const { site } = useSite();
  return (key: string, fallback: string) => site?.copy?.[group]?.[key] ?? fallback;
}
