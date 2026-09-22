export type RecoveryStatus = "monitoring" | "recovering" | "recovered" | "critical";

export type TimelinePayload = {
  observation?: string;
  treatment?: string;
  recoveryStatus?: RecoveryStatus;
  weightKg?: number;
  note?: string;
  cropStage?: string;
};

export function encodeTimelineNotes(payload: TimelinePayload): string {
  return JSON.stringify(payload);
}

export function decodeTimelineNotes(raw?: string | null): TimelinePayload {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as TimelinePayload;
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // Plain-text notes from older rows
  }
  return { note: raw, observation: raw };
}

export function recoveryLabel(status?: RecoveryStatus) {
  switch (status) {
    case "critical":
      return "Critical";
    case "recovering":
      return "Recovering";
    case "recovered":
      return "Recovered";
    case "monitoring":
      return "Monitoring";
    default:
      return "Recorded";
  }
}
