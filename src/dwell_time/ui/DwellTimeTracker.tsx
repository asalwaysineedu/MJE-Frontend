"use client";

import { useDwellTimeTracking } from "@/dwell_time/hooks/useDwellTimeTracking";

export default function DwellTimeTracker() {
  useDwellTimeTracking();
  return null;
}
