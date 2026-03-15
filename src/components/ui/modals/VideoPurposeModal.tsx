import { useState } from "react";
import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

const VIDEO_PURPOSES = [
  "스토리형",
  "액션형",
  "감성형",
  "정보형",
  "수묵 / 질감",
] as const;

type VideoPurpose = (typeof VIDEO_PURPOSES)[number];

interface VideoPurposeModalProps {
  onSubmit?: (purpose: VideoPurpose) => void;
}

export default function VideoPurposeModal({ onSubmit }: VideoPurposeModalProps) {
  const { close } = useModalStore();
  const [selected, setSelected] = useState<VideoPurpose>("스토리형");

  const handleSubmit = () => {
    onSubmit?.(selected);
    close();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 타이틀 */}
      <h2 className="text-base font-semibold text-white">영상 목적</h2>

      {/* 목적 목록 */}
      <div className="flex flex-col gap-2">
        {VIDEO_PURPOSES.map((purpose) => (
          <button
            key={purpose}
            onClick={() => setSelected(purpose)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors
              ${
                selected === purpose
                  ? "bg-purple-600 text-white"
                  : "bg-[#3a3a3f] text-white/50 hover:text-white/80 hover:bg-[#44444a]"
              }`}
          >
            {purpose}
          </button>
        ))}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end mt-1">
        <Button variant="primary" onClick={handleSubmit}>
          프로젝트 생성하기
        </Button>
      </div>
    </div>
  );
}
