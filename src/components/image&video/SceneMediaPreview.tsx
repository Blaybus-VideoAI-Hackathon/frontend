import SceneLabel from "../cut/SceneLabel";
import GeneratingIcon from "../../assets/icons/loading.svg";

type SceneMediaPreviewProps = {
  sceneNumber: number;
  title: string;

  mode: "image" | "video";
  status: "idle" | "generating" | "done" | "locked" | "failed";

  src?: string;
  durationText?: string;

  onAction?: () => void;
};

export default function SceneMediaPreview({
  sceneNumber,
  title,
  mode,
  status,
  src,
  durationText,
  onAction,
}: SceneMediaPreviewProps) {
  const isDone = status === "done";
  const isGenerating = status === "generating";
  const isFailed = status === "failed";
  const canRetry = isDone || isFailed;

  return (
    <section className="self-start w-full rounded-[8px] bg-gray-900 p-6">
      <div className="mb-6 flex items-center gap-4">
        <SceneLabel sceneNumber={sceneNumber} selected />
        <div className="text-[25px] font-bold text-white">{title}</div>
      </div>

      <div className="relative overflow-hidden rounded-[8px] bg-[rgba(255,255,255,0.04)]">
        {isDone && src && (
          <div className="relative">
            {mode === "video" ? (
              <video
                src={src}
                className="block h-auto w-full"
                controls
                preload="metadata"
              />
            ) : (
              <img src={src} alt={title} className="block h-auto w-full" />
            )}

            {mode === "video" && durationText && (
              <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-sm text-white">
                {durationText}
              </div>
            )}
          </div>
        )}

        {isGenerating && (
          <div className="flex h-[520px] w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <img
                src={GeneratingIcon}
                alt=""
                className="h-10 w-10 object-contain"
              />
              <div className="text-[16px] text-[rgba(255,255,255,0.7)]">
                생성 중...
              </div>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="flex h-[520px] w-full items-center justify-center">
            <div className="text-[16px] text-[#FF8E8E]">
              {mode === "image"
                ? "이미지 생성에 실패했습니다. 다시 시도해주세요."
                : "영상 생성에 실패했습니다. 다시 시도해주세요."}
            </div>
          </div>
        )}

        {!isDone && !isGenerating && !isFailed && (
          <div className="flex h-[520px] w-full items-center justify-center">
            <div className="text-[16px] text-[rgba(255,255,255,0.4)]">
              아직 생성된 콘텐츠가 없습니다.
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        {mode === "image" && (
          <button
            onClick={onAction}
            disabled={!isDone}
            className={`rounded-[8px] px-6 py-3 text-[16px] font-semibold ${
              isDone
                ? "bg-[#4A4A4F] text-white hover:bg-[#5A5A61]"
                : "cursor-not-allowed bg-[#3A3A3D] text-[#8B8B92]"
            }`}
          >
            Scene {String(sceneNumber).padStart(2, "0")} 이미지 수정
          </button>
        )}

        {mode === "video" && (
          <button
            onClick={onAction}
            disabled={!canRetry}
            className={`rounded-[8px] px-6 py-3 text-[16px] font-semibold ${
              canRetry
                ? "bg-[#4A4A4F] text-white hover:bg-[#5A5A61]"
                : "cursor-not-allowed bg-[#3A3A3D] text-[#8B8B92]"
            }`}
          >
            Scene {String(sceneNumber).padStart(2, "0")}{" "}
            {isFailed ? "영상 재시도" : "영상 재생성"}
          </button>
        )}
      </div>
    </section>
  );
}
