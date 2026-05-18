"use client";

import { useRef, useState } from "react";
import { trackCloseClick } from "./event_tracking";

const pretendard = "'Pretendard Variable', Pretendard, sans-serif";

interface ExportEmailModalProps {
  courseTitle: string;
  courseId: string;
  onClose: () => void;
}

export default function ExportEmailModal({
  courseTitle,
  courseId,
  onClose,
}: ExportEmailModalProps) {
  const [copied, setCopied] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyUrl = () => {
    void navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleCloseButton = () => {
    void trackCloseClick(courseId, courseTitle);
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-[90vw] max-w-[420px] rounded-[28px] bg-white px-5 md:px-[36px] pb-[36px] md:pb-[44px] pt-[36px] md:pt-[44px] shadow-[0px_20px_60px_rgba(0,0,0,0.15)]"
        style={{ fontFamily: pretendard }}
      >
        {/* X 닫기 버튼 — 터치 영역 44px 이상 확보 */}
        <button
          type="button"
          onClick={handleCloseButton}
          className="absolute right-[12px] top-[12px] flex h-[44px] w-[44px] items-center justify-center text-[24px] leading-none text-[#bbbbbb] transition-colors hover:text-[#757575]"
          aria-label="닫기"
        >
          ×
        </button>

        <div className="flex flex-col items-center gap-[28px]">
          {/* 코스 이름 */}
          <p className="text-[22px] font-semibold leading-snug text-[#2a4874] text-center">
            &lsquo;&nbsp;{courseTitle}&nbsp;&rsquo;
          </p>

          {/* Shareable URL */}
          <div className="flex w-full items-center gap-[8px] rounded-[12px] bg-[#f4f6f8] px-[14px] py-[10px]">
            <span
              className="min-w-0 flex-1 truncate text-[11px] text-[#555]"
              style={{ fontFamily: pretendard }}
            >
              {shareUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="shrink-0 rounded-full bg-[#2a4874] px-[12px] py-[5px] text-[11px] text-white transition-opacity hover:opacity-80"
              style={{ fontFamily: pretendard }}
            >
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
