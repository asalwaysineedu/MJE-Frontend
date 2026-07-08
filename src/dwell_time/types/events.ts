export const PAGE_ENTER_EVENT_NAME = "page_enter" as const;
export const PAGE_LEAVE_EVENT_NAME = "page_leave" as const;
export const PAGE_HIDDEN_EVENT_NAME = "page_hidden" as const;
export const PAGE_VISIBLE_EVENT_NAME = "page_visible" as const;
export const HEARTBEAT_EVENT_NAME = "heartbeat" as const;

export type DwellTimeEventName =
  | typeof PAGE_ENTER_EVENT_NAME
  | typeof PAGE_LEAVE_EVENT_NAME
  | typeof PAGE_HIDDEN_EVENT_NAME
  | typeof PAGE_VISIBLE_EVENT_NAME
  | typeof HEARTBEAT_EVENT_NAME;

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DwellTimeEvent {
  event_name: DwellTimeEventName;
  session_id: string | null;
  timestamp: string;
  page_path: string;
  device_type: DeviceType;
  [key: string]: unknown;
}
