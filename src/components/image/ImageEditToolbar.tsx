import CropIcon from "../../assets/icons/crop.svg";
import EffectIcon from "../../assets/icons/filter.svg";

type ImageEditToolbarProps = {
  visible?: boolean;
  onCropClick?: () => void;
  onEffectClick?: () => void;
};

export default function ImageEditToolbar({
  visible = false,
  onCropClick,
  onEffectClick,
}: ImageEditToolbarProps) {
  if (!visible) return null;

  return (
    <div className="shrink-0">
      <div className="flex flex-col items-center gap-3 rounded-[10px] bg-gray-800 px-2 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={onCropClick}
          className="flex h-10 w-10 items-center justify-center rounded-[8px] transition hover:bg-white/8"
        >
          <img src={CropIcon} alt="" className="h-5 w-5 object-contain" />
        </button>

        <button
          type="button"
          onClick={onEffectClick}
          className="flex h-10 w-10 items-center justify-center rounded-[8px] transition hover:bg-white/8"
        >
          <img src={EffectIcon} alt="" className="h-5 w-5 object-contain" />
        </button>
      </div>
    </div>
  );
}
