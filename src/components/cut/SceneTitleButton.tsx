import SceneLabel from "./SceneLabel";
import CloseIcon from "../../assets/icons/close.svg";

type SceneTitleButtonProps = {
  sceneNumber: number;
  title: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
};

export default function SceneTitleButton({
  sceneNumber,
  title,
  selected = false,
  onClick,
  onRemove,
}: SceneTitleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-14 w-full items-center justify-between rounded-[8px] border px-4 transition-colors",
        selected
          ? "border-[#5C4DFF] bg-[rgba(92,77,255,0.32)]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.06)]",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        <SceneLabel sceneNumber={sceneNumber} selected={selected} />

        <span
          className={[
            "truncate text-left text-[18px] font-medium",
            selected ? "text-white" : "text-[rgba(255,255,255,0.72)]",
          ].join(" ")}
        >
          {title}
        </span>
      </div>

      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onRemove?.();
          }
        }}
        className="ml-4 inline-flex h-6 w-6 shrink-0 items-center justify-center"
      >
        <img
          src={CloseIcon}
          alt="삭제"
          className={
            selected
              ? "h-4 w-4 object-contain"
              : "h-4 w-4 object-contain opacity-90"
          }
        />
      </span>
    </button>
  );
}
