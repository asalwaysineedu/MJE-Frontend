import type { DeviceType } from "@/dwell_time/types/events";

export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent;

  const isTablet =
    /iPad/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) ||
    (/Android/i.test(ua) && !/Mobile/i.test(ua));
  if (isTablet) return "tablet";

  const isMobile = /Mobi|Android|iPhone/i.test(ua);
  if (isMobile) return "mobile";

  return "desktop";
}
