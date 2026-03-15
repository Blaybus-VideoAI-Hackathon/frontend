import SceneLabel from "../cut/SceneLabel";
import GeneratingIcon from "../../assets/icons/loading.svg";
import DoneIcon from "../../assets/icons/check_purple.svg";

type SceneImageCardProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  status: "generating" | "done";
  selected?: boolean;
  onClick?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  //   onIconClick?: () => void;
};

export default function SceneImageCard({
  sceneNumber,
  title,
  imageSrc,
  status,
  selected = false,
  onClick,
  onRegenerate,
  onEdit,
}: SceneImageCardProps) {
  const iconSrc = status === "generating" ? GeneratingIcon : DoneIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[8px] border p-4 text-left transition-colors ${
        selected
          ? "border-[#5C4DFF] bg-[rgba(92,77,255,0.45)]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.08)]"
      }`}
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

        <img src={iconSrc} alt="" className="h-5 w-5 object-contain" />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <img
          src={imageSrc}
          alt={`${title} 대표 이미지`}
          className="h-[100px] w-[132px] rounded-[8px] object-cover"
        />

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate?.();
            }}
            className="rounded-full border border-[rgba(255,255,255,0.4)] px-4 py-2 text-[14px] font-medium text-[rgba(255,255,255,0.72)] transition hover:bg-[rgba(255,255,255,0.06)]"
          >
            재생성
          </button>

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
        </div>
      </div>
    </button>
  );
}
