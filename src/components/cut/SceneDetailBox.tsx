import type { CutSceneDetailItem } from "../../hooks/useCutScenes";
import SceneLabel from "./SceneLabel";

type SceneDetailBoxProps = {
  sceneNumber: number;
  title: string;
  details: CutSceneDetailItem[];
  isRegenerating?: boolean;
  onRegenerateScene?: () => void;
};

function DetailRow({ label, value }: CutSceneDetailItem) {
  return (
    <div className="space-y-0">
      <h3 className="text-[19px] font-bold leading-none text-white/90">
        {label}
      </h3>
      <p className="text-[18px] leading-7 text-[rgba(255,255,255,0.6)]">
        {value}
      </p>
    </div>
  );
}

export default function SceneDetailBox({
  sceneNumber,
  title,
  details,
  isRegenerating = false,
  onRegenerateScene,
}: SceneDetailBoxProps) {
  return (
    <section className="animate-scene-detail flex min-h-190 w-full flex-col rounded-[8px] bg-gray-900 px-7 py-6">
      <div className="flex items-center gap-4">
        <SceneLabel sceneNumber={sceneNumber} selected />
        <div className="text-gray-100 text-[18px] font-bold">{title}</div>
      </div>

      <div className="ml-4 mt-12 flex flex-col gap-9">
        {details.length === 0
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-20 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))
          : details.map((item) => (
              <DetailRow key={item.label} label={item.label} value={item.value} />
            ))}
      </div>

      <div className="mt-auto flex justify-center pt-16">
        <button
          type="button"
          onClick={onRegenerateScene}
          disabled={isRegenerating}
          className={`rounded-[8px] px-8 py-4 text-[18px] font-semibold text-white transition ${
            isRegenerating
              ? "cursor-not-allowed bg-[#3A3A3D] text-[#8B8B92]"
              : "bg-[#5C4DFF] hover:bg-[#4f41ee] active:scale-[0.98]"
          }`}
        >
          {isRegenerating
            ? `Scene ${sceneNumber} 재추천 중...`
            : `Scene ${sceneNumber}만 다시 추천받기`}
        </button>
      </div>
    </section>
  );
}
