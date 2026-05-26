"use client";

import { useEffect, useRef, useState } from "react";
import { Place } from "@/courses/types/course";
import CourseMapSkeleton from "./CourseMapSkeleton";

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}
interface KakaoLatLngBounds {
  extend(latlng: KakaoLatLng): void;
}
interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
}
interface KakaoMap {
  setBounds(bounds: KakaoLatLngBounds): void;
}
interface KakaoGeocoder {
  addressSearch(
    addr: string,
    cb: (res: Array<{ y: string; x: string }>, status: string) => void,
  ): void;
}
interface KakaoMaps {
  Map: new (el: HTMLElement, opts: { center: KakaoLatLng; level: number }) => KakaoMap;
  Marker: new (opts: { position: KakaoLatLng }) => KakaoMarker;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  LatLngBounds: new () => KakaoLatLngBounds;
  load(cb: () => void): void;
  services: { Geocoder: new () => KakaoGeocoder; Status: { OK: string } };
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMaps };
  }
}

const MAP_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? "";
const SCRIPT_ID = "kakao-map-sdk";

type Status = "loading" | "ready" | "error";

interface CourseMapProps {
  places: Place[];
}

export default function CourseMap({ places }: CourseMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!MAP_KEY) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    const markers: KakaoMarker[] = [];

    function initMap() {
      if (cancelled || !containerRef.current) return;
      const kakao = window.kakao;
      if (!kakao?.maps) { setStatus("error"); return; }

      kakao.maps.load(() => {
        if (cancelled || !containerRef.current) return;
        const { maps } = kakao;

        const map = new maps.Map(containerRef.current, {
          center: new maps.LatLng(37.5665, 126.978),
          level: 5,
        });

        const addressList = places
          .map((p) => p.address ?? p.location)
          .filter(Boolean) as string[];

        if (addressList.length === 0) {
          if (!cancelled) setStatus("ready");
          return;
        }

        const geocoder = new maps.services.Geocoder();
        const bounds = new maps.LatLngBounds();
        let remaining = addressList.length;

        addressList.forEach((addr) => {
          geocoder.addressSearch(addr, (result, s) => {
            if (!cancelled && s === maps.services.Status.OK && result[0]) {
              const pos = new maps.LatLng(+result[0].y, +result[0].x);
              const marker = new maps.Marker({ position: pos });
              marker.setMap(map);
              markers.push(marker);
              bounds.extend(pos);
            }
            remaining -= 1;
            if (remaining === 0 && markers.length > 0 && !cancelled) {
              map.setBounds(bounds);
            }
          });
        });

        if (!cancelled) setStatus("ready");
      });
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      if (window.kakao?.maps) {
        initMap();
      } else {
        existing.addEventListener("load", initMap);
        return () => {
          cancelled = true;
          existing.removeEventListener("load", initMap);
          markers.forEach((m) => m.setMap(null));
        };
      }
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${MAP_KEY}&libraries=services&autoload=false`;
      script.onload = initMap;
      script.onerror = () => {
        if (!cancelled) setStatus("error");
      };
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      markers.forEach((m) => m.setMap(null));
    };
  }, [places]);

  return (
    <div className="relative h-[200px] w-full rounded-[20px] overflow-hidden">
      {status === "loading" && (
        <div className="absolute inset-0">
          <CourseMapSkeleton />
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f0f4f8]">
          <span className="text-[12px] text-[#959595]">지도를 불러올 수 없어요</span>
        </div>
      )}
      <div
        ref={containerRef}
        className="h-full w-full"
        style={{ visibility: status === "ready" ? "visible" : "hidden" }}
      />
    </div>
  );
}
