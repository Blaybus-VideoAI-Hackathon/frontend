import { useState } from "react";
import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

const VIDEO_STYLES = [
  "애니메이션 스타일",
  "사실적인 영화 스타일",
  "일러스트 스타일",
  "3D 애니메이션 스타일",
  "미래적인 스타일",
] as const;

type VideoStyle = (typeof VIDEO_STYLES)[number];

interface VideoStyleModalProps {
  onPrev?: () => void;
  onNext?: (style: VideoStyle) => void;
}

export default function VideoStyleModal({ onPrev, onNext }: VideoStyleModalProps) {
  const { close } = useModalStore();
  const [selected, setSelected] = useState<VideoStyle>("애니메이션 스타일");

  const handlePrev = () => {
    onPrev?.();
    close();
  };

  const handleNext = () => {
    onNext?.(selected);
    close();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 타이틀 */}
      <h2 className="text-base font-semibold text-white">영상 스타일</h2>

      {/* 스타일 목록 */}
      <div className="flex flex-col gap-2">
        {VIDEO_STYLES.map((style) => (
          <button
            key={style}
            onClick={() => setSelected(style)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors
              ${
                selected === style
                  ? "bg-purple-600 text-white"
                  : "bg-[#3a3a3f] text-white/50 hover:text-white/80 hover:bg-[#44444a]"
              }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="secondary" onClick={handlePrev}>
          이전
        </Button>
        <Button variant="primary" onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
