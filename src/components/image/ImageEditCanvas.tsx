import { useMemo, useState } from "react";
import ImageEditToolbar from "./ImageEditToolbar";
import DownloadIcon from "../../assets/icons/download_purple.svg";
import SceneLabel from "../cut/SceneLabel";
import ImageCropEditor from "./ImageCropEditor";
import type { ImageEffectValues } from "./ImageEffectEditor";
import ImageEffectEditor from "./ImageEffectEditor";

type EditMode = "none" | "crop" | "effect";

type ImageEditCanvasProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  onDownload?: () => void;
  onImageChange?: (nextImageSrc: string) => void;
};

const DEFAULT_EFFECTS: ImageEffectValues = {
  opacity: 100,
  brightness: 0,
  contrast: 0,
  shadow: 0,
};

export default function ImageEditCanvas({
  sceneNumber,
  title,
  imageSrc,
  onDownload,
  onImageChange,
}: ImageEditCanvasProps) {
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("none");

  const [appliedEffects, setAppliedEffects] =
    useState<ImageEffectValues>(DEFAULT_EFFECTS);
  const [draftEffects, setDraftEffects] =
    useState<ImageEffectValues>(DEFAULT_EFFECTS);

  const imageStyle = useMemo<React.CSSProperties>(() => {
    const brightnessValue = 100 + appliedEffects.brightness;
    const contrastValue = 100 + appliedEffects.contrast;

    return {
      opacity: appliedEffects.opacity / 100,
      filter: `brightness(${brightnessValue}%) contrast(${contrastValue}%)`,
      boxShadow:
        appliedEffects.shadow > 0
          ? `0 12px ${appliedEffects.shadow}px rgba(0, 0, 0, 0.35)`
          : "none",
    };
  }, [appliedEffects]);

  const handleOpenEffectEditor = () => {
    setDraftEffects(appliedEffects);
    setEditMode("effect");
  };

  const handleCancelEffectEditor = () => {
    setDraftEffects(appliedEffects);
    setEditMode("none");
  };

  const handleApplyEffectEditor = () => {
    setAppliedEffects(draftEffects);
    setEditMode("none");
  };

  return (
    <section className="w-full rounded-[8px] bg-black px-4">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SceneLabel sceneNumber={sceneNumber} selected />
          <div className="text-[24px] font-bold text-white">{title}</div>
        </div>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[#5C4DFF] px-5 py-2.5 text-[14px] font-semibold text-[#7B6CFF] transition hover:bg-[rgba(92,77,255,0.08)]"
        >
          <img src={DownloadIcon} alt="" className="h-4 w-4 object-contain" />
          다운로드
        </button>
      </div>

      {editMode === "crop" ? (
        <ImageCropEditor
          imageSrc={imageSrc}
          onCancel={() => setEditMode("none")}
          onApply={(croppedImageUrl) => {
            onImageChange?.(croppedImageUrl);
            setEditMode("none");
          }}
        />
      ) : editMode === "effect" ? (
        <div className="space-y-4">
          <ImageEffectEditor
            value={draftEffects}
            onChange={setDraftEffects}
            onCancel={handleCancelEffectEditor}
            onApply={handleApplyEffectEditor}
          />

          <div className="rounded-[10px] bg-[#111111] p-4">
            <img
              src={imageSrc}
              alt={`${title} 효과 미리보기`}
              style={{
                opacity: draftEffects.opacity / 100,
                filter: `brightness(${100 + draftEffects.brightness}%) contrast(${100 + draftEffects.contrast}%)`,
                boxShadow:
                  draftEffects.shadow > 0
                    ? `0 12px ${draftEffects.shadow}px rgba(0, 0, 0, 0.35)`
                    : "none",
              }}
              className="block h-auto w-full rounded-[8px] object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ImageEditToolbar
            visible={isToolbarVisible}
            onCropClick={() => setEditMode("crop")}
            onEffectClick={handleOpenEffectEditor}
          />

          <button
            type="button"
            onClick={() => setIsToolbarVisible((prev) => !prev)}
            className={`block min-w-0 flex-1 rounded-[10px] p-[2px] text-left transition ${
              isToolbarVisible ? "bg-[#5C4DFF]" : "bg-transparent"
            }`}
          >
            <img
              src={imageSrc}
              alt={`${title} 편집 이미지`}
              style={imageStyle}
              className="block h-auto w-full rounded-[8px] object-cover"
            />
          </button>
        </div>
      )}
    </section>
  );
}
