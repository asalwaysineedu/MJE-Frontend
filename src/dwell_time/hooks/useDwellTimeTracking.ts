"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  trackEvent,
  getSessionId,
  EventTrackingError,
} from "@/infrastructure/analytics";
import {
  PAGE_ENTER_EVENT_NAME,
  PAGE_LEAVE_EVENT_NAME,
  PAGE_HIDDEN_EVENT_NAME,
  PAGE_VISIBLE_EVENT_NAME,
  HEARTBEAT_EVENT_NAME,
} from "@/dwell_time/types/events";
import type {
  DwellTimeEvent,
  DwellTimeEventName,
} from "@/dwell_time/types/events";
import { getDeviceType } from "@/dwell_time/utils/deviceType";

const HEARTBEAT_INTERVAL_MS = 30_000;
const DWELL_TIME_ENDPOINT = "/dwell_time/session/events";

export function useDwellTimeTracking() {
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const hasSentEnterRef = useRef(false);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const deviceType = getDeviceType();
    let heartbeatId: ReturnType<typeof setInterval> | null = null;

    const buildEvent = (eventName: DwellTimeEventName): DwellTimeEvent => ({
      event_name: eventName,
      session_id: getSessionId(),
      timestamp: new Date().toISOString(),
      page_path: pathnameRef.current,
      device_type: deviceType,
    });

    const send = (eventName: DwellTimeEventName) => {
      trackEvent(buildEvent(eventName), DWELL_TIME_ENDPOINT).catch((error) => {
        if (error instanceof EventTrackingError) {
          console.error(
            `[DwellTimeTracking] ${eventName} 전송 실패:`,
            error.message,
            error.cause,
          );
        }
      });
    };

    const startHeartbeat = () => {
      if (heartbeatId !== null) return;
      heartbeatId = setInterval(
        () => send(HEARTBEAT_EVENT_NAME),
        HEARTBEAT_INTERVAL_MS,
      );
    };

    const stopHeartbeat = () => {
      if (heartbeatId !== null) {
        clearInterval(heartbeatId);
        heartbeatId = null;
      }
    };

    // document.hidden은 "이 탭이 브라우저 안에서 활성 탭인가"만 판단하므로,
    // 다른 앱 창이 브라우저를 덮어써서 창 포커스만 빠져나간 경우(document.hidden=false 유지)를
    // 잡지 못한다. window.hasFocus()까지 함께 봐서 "실제로 보고 있는 상태"를 판단한다.
    let isActive = true;

    const computeIsActive = () =>
      document.visibilityState === "visible" && document.hasFocus();

    const handleActivityChange = () => {
      const active = computeIsActive();
      if (active === isActive) return; // blur+hidden처럼 같은 전환이 중복 발생하는 것을 방지
      isActive = active;

      if (active) {
        send(PAGE_VISIBLE_EVENT_NAME);
        startHeartbeat();
      } else {
        stopHeartbeat();
        send(PAGE_HIDDEN_EVENT_NAME);
      }
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      if (event.persisted) return; // bfcache에 보존된 것 뿐, 실제 세션 종료가 아님
      stopHeartbeat();
      send(PAGE_LEAVE_EVENT_NAME);
    };

    // React StrictMode(dev)의 mount→cleanup→mount 이중 호출에서도
    // page_enter는 세션당 정확히 1번만 전송되어야 하므로 ref로 가드한다.
    if (!hasSentEnterRef.current) {
      hasSentEnterRef.current = true;
      send(PAGE_ENTER_EVENT_NAME);
    }

    startHeartbeat();
    document.addEventListener("visibilitychange", handleActivityChange);
    window.addEventListener("blur", handleActivityChange);
    window.addEventListener("focus", handleActivityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      stopHeartbeat();
      document.removeEventListener("visibilitychange", handleActivityChange);
      window.removeEventListener("blur", handleActivityChange);
      window.removeEventListener("focus", handleActivityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);
}
