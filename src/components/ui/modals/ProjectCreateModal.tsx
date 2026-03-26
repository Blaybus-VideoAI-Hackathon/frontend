import { useState } from "react";
import axios from "axios";
import { useModalStore } from "../../../store/ModalStore";
import StepIndicator from "../StepIndicator";
import Button from "../Button";

// ─── 상수 ──────────────────────────────────────────────
const ASPECT_RATIOS = ["9:16", "16:9", "1:1"] as const;
const DURATIONS = ["15초", "20초", "25초", "30초"] as const;
const VIDEO_STYLES = [
  { label: "시네마틱", value: "cinematic" },
  { label: "리얼리즘", value: "realistic" },
  { label: "애니메이션", value: "anime" },
  { label: "3D 그래픽", value: "3D render" },
  { label: "초현실", value: "surreal" },
  {
    label: "지브리",
    value:
      "ghibli style, soft lighting, warm colors, hand-drawn animation, peaceful atmosphere",
  },
] as const;
const VIDEO_PURPOSES = [
  { label: "스토리형", value: "storytelling" },
  { label: "액션형", value: "action" },
  { label: "감정형", value: "emotional" },
  { label: "정보형", value: "informational" },
  { label: "숏폼 / 밈형", value: "short-form" },
] as const;

type AspectRatio = (typeof ASPECT_RATIOS)[number];
type Duration = (typeof DURATIONS)[number];
type VideoStyle = (typeof VIDEO_STYLES)[number]["value"];
type VideoPurpose = (typeof VIDEO_PURPOSES)[number]["value"];

const STEPS = [
  { label: "프로젝트\n설정" },
  { label: "영상\n스타일" },
  { label: "영상\n목적" },
];

// ─── Step 1: 프로젝트 설정 ──────────────────────────────
function Step1({
  projectName,
  setProjectName,
  aspectRatio,
  setAspectRatio,
  duration,
  setDuration,
  onNext,
}: {
  projectName: string;
  setProjectName: (v: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (v: AspectRatio) => void;
  duration: Duration;
  setDuration: (v: Duration) => void;
  onNext: () => void;
}) {
  const isProjectNameEmpty = !projectName.trim();

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
          className="w-full hover:bg-[#3a3a3f]/30 border border-white/10 rounded-lg px-3 py-2
            text-sm text-white placeholder:text-white/25
            focus:outline-none focus:border-[#5C4DFF] transition-colors"
        />
      </div>

      {/* 영상 비율 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/80">영상 비율</label>
        <div className="flex gap-2 mr-25.5">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  aspectRatio === ratio
                    ? "bg-[#4f46e9]/30 border border-[#4F46E9] text-white"
                    : "border border-[#3C3C3C] text-white/50 hover:text-white/80 hover:bg-[#44444a]/30"
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
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors
                ${
                  duration === d
                    ? "bg-[#4f46e9]/30 border border-[#4F46E9] text-white"
                    : "border border-[#3C3C3C] text-white/50 hover:text-white/80 hover:bg-[#44444a]/30"
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-1">
        <Button
          variant={isProjectNameEmpty ? "secondary" : "primary"}
          onClick={onNext}
          disabled={isProjectNameEmpty}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: 영상 스타일 ────────────────────────────────
function Step2({
  selected,
  setSelected,
  onPrev,
  onNext,
}: {
  selected: VideoStyle;
  setSelected: (v: VideoStyle) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[18px] font-semibold text-white">영상 스타일</div>
      <div className="flex flex-col gap-2">
        {VIDEO_STYLES.map((style) => (
          <button
            key={style.value}
            onClick={() => setSelected(style.value)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors
              ${
                selected === style.value
                  ? "bg-[#4f46e9]/30 border border-[#4F46E9] text-white"
                  : "border border-[#3C3C3C] text-white/50 hover:text-white/80 hover:bg-[#44444a]/30"
              }`}
          >
            {style.label}
          </button>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="secondary" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: 영상 목적 ─────────────────────────────────
function Step3({
  selected,
  setSelected,
  onPrev,
  onSubmit,
  isLoading,
  error,
}: {
  selected: VideoPurpose;
  setSelected: (v: VideoPurpose) => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-[18px] font-semibold text-white">영상 목적</div>
      <div className="flex flex-col gap-2">
        {VIDEO_PURPOSES.map((purpose) => (
          <button
            key={purpose.value}
            onClick={() => setSelected(purpose.value)}
            className={`w-full px-4 py-3 rounded-lg text-sm font-medium text-left transition-colors
              ${
                selected === purpose.value
                  ? "bg-[#4f46e9]/30 border border-[#4F46E9] text-white"
                  : "border border-[#3C3C3C] text-white/50 hover:text-white/80 hover:bg-[#44444a]/30"
              }`}
          >
            {purpose.label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="secondary" onClick={onPrev} disabled={isLoading}>
          이전
        </Button>
        <Button variant="primary" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "생성 중..." : "프로젝트 생성하기"}
        </Button>
      </div>
    </div>
  );
}

export default function ProjectCreateModal({
  onComplete,
}: {
  onComplete?: (project: { id: number; title: string }) => void;
}) {
  const { close } = useModalStore();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1 state
  const [projectName, setProjectName] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [duration, setDuration] = useState<Duration>("15초");

  // Step 2 state
  const [videoStyle, setVideoStyle] = useState<VideoStyle>("cinematic");

  // Step 3 state
  const [videoPurpose, setVideoPurpose] =
    useState<VideoPurpose>("storytelling");

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    try {
      const durationSeconds = parseInt(duration);
      const response = await axios.post(
        "https://hdb-backend.onrender.com/api/projects",
        {
          title: projectName,
          style: videoStyle,
          ratio: aspectRatio,
          purpose: videoPurpose,
          duration: durationSeconds,
        },
        {},
      );

      const createdProjectId = response.data?.data?.id;

      if (!createdProjectId) {
        throw new Error("프로젝트 ID를 받지 못했습니다.");
      }

      close();
      onComplete?.({
        id: createdProjectId,
        title: projectName,
      });
    } catch {
      setError("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <StepIndicator steps={STEPS} currentStep={step} variant="dark" />

      {step === 0 && (
        <Step1
          projectName={projectName}
          setProjectName={setProjectName}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          duration={duration}
          setDuration={setDuration}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <Step2
          selected={videoStyle}
          setSelected={setVideoStyle}
          onPrev={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step3
          selected={videoPurpose}
          setSelected={setVideoPurpose}
          onPrev={() => setStep(1)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}
