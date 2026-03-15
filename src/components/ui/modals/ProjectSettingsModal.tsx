import { useState } from "react";
import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

const ASPECT_RATIOS = ["9:16", "16:9", "1:1"] as const;
const DURATIONS = ["15초", "20초", "25초", "30초"] as const;

type AspectRatio = (typeof ASPECT_RATIOS)[number];
type Duration = (typeof DURATIONS)[number];

export default function ProjectSettingsModal() {
  const { close } = useModalStore();
  const [projectName, setProjectName] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [duration, setDuration] = useState<Duration>("15초");

  const handleNext = () => {
    // TODO: 다음 단계로 이동
    close();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 프로젝트 이름 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/80">
          프로젝트 이름
        </label>
        <input
          type="text"
          placeholder="프로젝트 이름을 입력해주세요."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full bg-[#3a3a3f] border border-white/10 rounded-lg px-3 py-2
            text-sm text-white placeholder:text-white/25
            focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* 영상 비율 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/80">영상 비율</label>
        <div className="flex gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  aspectRatio === ratio
                    ? "bg-purple-600 text-white"
                    : "bg-[#3a3a3f] text-white/50 hover:text-white/80 hover:bg-[#44444a]"
                }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* 영상 길이 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/80">영상 길이</label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDuration(d)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  duration === d
                    ? "bg-purple-600 text-white"
                    : "bg-[#3a3a3f] text-white/50 hover:text-white/80 hover:bg-[#44444a]"
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="secondary" onClick={close}>
          이전
        </Button>
        <Button variant="primary" onClick={handleNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
