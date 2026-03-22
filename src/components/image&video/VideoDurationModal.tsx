import { useState } from "react";

type VideoDurationModalProps = {
  open: boolean;
  sceneNumber: number;
  sceneTitle: string;
  defaultDuration?: 3 | 4 | 5;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: (duration: 3 | 4 | 5) => Promise<void> | void;
};

const OPTIONS: Array<3 | 4 | 5> = [3, 4, 5];

export default function VideoDurationModal({
  open,
  sceneNumber,
  sceneTitle,
  defaultDuration = 3,
  submitting = false,
  onClose,
  onConfirm,
}: VideoDurationModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<3 | 4 | 5>(
    defaultDuration,
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-[600px] rounded-[16px] border border-[rgba(255,255,255,0.08)] bg-[#1B1B1F] p-8 shadow-2xl">
        <div className="text-[40px] font-bold tracking-[-0.02em] text-white">
          Scene {String(sceneNumber).padStart(2, "0")}
        </div>

        <div className="mt-3 text-[16px] font-semibold text-white">
          {sceneTitle}을 몇 초 동안 보여줄까요?
        </div>

        <p className="mt-2 text-[15px] leading-[1.5] text-[rgba(255,255,255,0.68)]">
          현재 컷의 연출과 액션을 분석하여
          <br />
          가장 자연스럽게 표현될 수 있는 영상 길이를 AI가 추천해드려요.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4">
          {OPTIONS.map((duration) => {
            const selected = selectedDuration === duration;
            const recommended = duration === 3;

            return (
              <button
                key={duration}
                type="button"
                onClick={() => setSelectedDuration(duration)}
                className={`rounded-[12px] border px-4 py-5 text-center transition ${
                  selected
                    ? "border-[#5C4DFF] bg-[rgba(92,77,255,0.18)] text-[#9F93FF]"
                    : "border-[rgba(255,255,255,0.12)] bg-transparent text-[rgba(255,255,255,0.34)] hover:border-[rgba(255,255,255,0.24)] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[32px] font-bold leading-none">
                    {duration}초
                  </span>
                  {recommended && (
                    <span
                      className={`rounded-full border px-2 py-1 text-[13px] font-semibold ${
                        selected
                          ? "border-[#6D5FFF] text-[#9F93FF]"
                          : "border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.48)]"
                      }`}
                    >
                      AI 추천
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-9 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-[12px] bg-[#5A5A5F] px-8 py-4 text-[16px] font-semibold text-[rgba(255,255,255,0.72)] transition hover:bg-[#66666C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            취소
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              await onConfirm(selectedDuration);
            }}
            className="rounded-[12px] bg-[#5C4DFF] px-8 py-4 text-[16px] font-semibold text-white transition hover:bg-[#6B5DFF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "생성 중..." : "생성"}
          </button>
        </div>
      </div>
    </div>
  );
}
