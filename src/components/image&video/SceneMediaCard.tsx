import SceneLabel from "../cut/SceneLabel";
import GeneratingIcon from "../../assets/icons/loading.svg";
import DoneIcon from "../../assets/icons/check_purple.svg";
import PlayIcon from "../../assets/icons/play_white.svg";

export type SceneMediaStatus =
  | "idle"
  | "generating"
  | "done"
  | "locked"
  | "failed";

type SceneMediaCardProps = {
  sceneNumber: number;
  title: string;
  thumbnailSrc?: string;
  status: SceneMediaStatus;
  selected?: boolean;
  mode: "image" | "video";
  durationText?: string;

  onClick?: () => void;
  onGenerate?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
};

function StatusText({
  status,
  mode,
}: {
  status: SceneMediaStatus;
  mode: "image" | "video";
}) {
  if (status === "done") {
    return (
      <div className="flex items-center gap-1 text-[14px] font-medium text-[#A89CFF] mr-3 whitespace-nowrap">
        생성 완료
        <img src={DoneIcon} alt="" className="h-4 w-4 object-contain" />
      </div>
    );
  }

  if (status === "generating") {
    return (
      <div className="flex items-center gap-1 text-[14px] font-medium text-[rgba(255,255,255,0.68)] mr-3 whitespace-nowrap">
        생성 중
        <img src={GeneratingIcon} alt="" className="h-4 w-4 object-contain" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-[14px] font-medium text-[#FF8E8E]">생성 실패</div>
    );
  }

  if (status === "idle" && mode === "video") {
    return null;
  }

  return null;
}

export default function SceneMediaCard({
  sceneNumber,
  title,
  thumbnailSrc,
  status,
  selected = false,
  mode,
  durationText,
  onClick,
  onGenerate,
  onRegenerate,
  onEdit,
}: SceneMediaCardProps) {
  const isDone = status === "done";
  const isGenerating = status === "generating";
  const isIdle = status === "idle";
  const isLocked = status === "locked";
  const isFailed = status === "failed";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={`w-full rounded-[8px] border p-4 text-left transition-colors ${
        selected
          ? "border-[#5C4DFF] bg-[rgba(92,77,255,0.45)]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)]"
      } ${isLocked ? "cursor-default opacity-80" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SceneLabel sceneNumber={sceneNumber} selected={selected} />
          <span
            className={`truncate text-[18px] font-semibold ${
              selected ? "text-white" : "text-[rgba(255,255,255,0.72)]"
            }`}
          >
            {title}
          </span>
        </div>

        <StatusText status={status} mode={mode} />
      </div>

      {(thumbnailSrc || isGenerating) && (
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="relative h-[100px] w-[146px] overflow-hidden rounded-[8px] bg-[rgba(255,255,255,0.08)]">
            {thumbnailSrc ? (
              <>
                {mode === "video" ? (
                  <video
                    src={thumbnailSrc}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={thumbnailSrc}
                    alt={`${title} 썸네일`}
                    className="h-full w-full object-cover"
                  />
                )}

                {mode === "video" && isDone && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={PlayIcon}
                        alt=""
                        className="h-5 w-5 object-contain"
                      />
                    </div>

                    {durationText && (
                      <div className="absolute bottom-1 right-1 rounded-[6px] bg-black/60 px-1.5 py-0.5 text-[12px] text-white">
                        {durationText}
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={GeneratingIcon}
                  alt=""
                  className="h-5 w-5 object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {mode === "image" && isDone && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
                className="rounded-full border border-[rgba(255,255,255,0.4)] px-4 py-2 text-[14px] font-medium text-[rgba(255,255,255,0.72)] transition hover:bg-[rgba(255,255,255,0.06)]"
              >
                수정
              </button>
            )}

            {mode === "video" && (
              <>
                {isIdle && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerate?.();
                    }}
                    className="rounded-full border border-[rgba(255,255,255,0.4)] px-5 py-2 text-[14px] font-medium text-[rgba(255,255,255,0.72)] transition hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    생성
                  </button>
                )}

                {(isDone || isFailed) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRegenerate?.();
                    }}
                    className="rounded-full border border-[rgba(255,255,255,0.4)] px-5 py-2 text-[14px] font-medium text-[rgba(255,255,255,0.72)] transition hover:bg-[rgba(255,255,255,0.06)]"
                  >
                    {isFailed ? "재시도" : "재생성"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {mode === "video" &&
        (status === "idle" || status === "failed") &&
        !thumbnailSrc && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();

                if (status === "failed") {
                  onRegenerate?.();
                } else {
                  onGenerate?.();
                }
              }}
              className="rounded-full border border-[rgba(255,255,255,0.4)] px-5 py-2 text-[14px] font-medium text-[rgba(255,255,255,0.72)] transition hover:bg-[rgba(255,255,255,0.06)]"
            >
              {status === "failed" ? "재시도" : "생성"}
            </button>
          </div>
        )}
    </button>
  );
}
