import SceneLabel from "../cut/SceneLabel";
import GeneratingIcon from "../../assets/icons/loading.svg";
import PlayIcon from "../../assets/icons/play_white.svg";

type SceneMediaPreviewProps = {
  sceneNumber: number;
  title: string;

  mode: "image" | "video";
  status: "idle" | "generating" | "done" | "locked";

  src?: string; // image / video thumbnail
  durationText?: string;

  onAction?: () => void; // edit or regenerate
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

  return (
    <section className="self-start w-full rounded-[8px] bg-gray-900 p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <SceneLabel sceneNumber={sceneNumber} selected />
        <div className="text-[25px] font-bold text-white">{title}</div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative overflow-hidden rounded-[8px] bg-[rgba(255,255,255,0.04)]">
        {/* DONE */}
        {isDone && src && (
          <div className="relative">
            <img
              src={src}
              alt={title}
              className="block h-auto w-full object-cover"
            />

            {/* video 전용 overlay */}
            {mode === "video" && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={PlayIcon}
                    alt=""
                    className="h-14 w-14 object-contain"
                  />
                </div>

                {durationText && (
                  <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-sm text-white">
                    {durationText}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* GENERATING */}
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

        {/* EMPTY */}
        {!isDone && !isGenerating && (
          <div className="flex h-[520px] w-full items-center justify-center">
            <div className="text-[16px] text-[rgba(255,255,255,0.4)]">
              아직 생성된 콘텐츠가 없습니다.
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="mt-6 flex justify-center">
        {mode === "image" && (
          <button
            onClick={onAction}
            disabled={!isDone}
            className={`rounded-[8px] px-6 py-3 text-[16px] font-semibold ${
              isDone
                ? "bg-[#4A4A4F] text-white hover:bg-[#5A5A61]"
                : "bg-[#3A3A3D] text-[#8B8B92] cursor-not-allowed"
            }`}
          >
            Scene {String(sceneNumber).padStart(2, "0")} 이미지 수정
          </button>
        )}

        {mode === "video" && (
          <button
            onClick={onAction}
            disabled={!isDone}
            className={`rounded-[8px] px-6 py-3 text-[16px] font-semibold ${
              isDone
                ? "bg-[#4A4A4F] text-white hover:bg-[#5A5A61]"
                : "bg-[#3A3A3D] text-[#8B8B92] cursor-not-allowed"
            }`}
          >
            Scene {String(sceneNumber).padStart(2, "0")} 영상 재생성
          </button>
        )}
      </div>
    </section>
  );
}
