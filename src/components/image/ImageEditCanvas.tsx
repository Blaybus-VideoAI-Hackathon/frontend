import { useEffect, useMemo, useRef, useState } from "react";
import ImageEditToolbar from "./ImageEditToolbar";
import DownloadIcon from "../../assets/icons/download_purple.svg";
import SceneLabel from "../cut/SceneLabel";
import ImageCropEditor from "./ImageCropEditor";
import type { ImageEffectValues } from "./ImageEffectEditor";
import ImageEffectEditor from "./ImageEffectEditor";
import ImageTransformViewer from "./ImageTransformViewer";

type EditMode = "none" | "crop";

type EditState = {
  imageSrc: string;
  effects: ImageEffectValues;
};

type ImageEditCanvasProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  onDownload?: () => void;
  /** 편집(undo 포함)될 때마다 현재 imageSrc를 전달 */
  onImageChange?: (nextImageSrc: string) => void;
  /** 변경 여부(이미지+효과 모두 포함)가 바뀔 때마다 호출 */
  onDirtyChange?: (isDirty: boolean) => void;
};

const DEFAULT_EFFECTS: ImageEffectValues = {
  opacity: 100,
  brightness: 0,
  contrast: 0,
  shadow: 0,
};

function effectsEqual(a: ImageEffectValues, b: ImageEffectValues) {
  return (
    a.opacity === b.opacity &&
    a.brightness === b.brightness &&
    a.contrast === b.contrast &&
    a.shadow === b.shadow
  );
}

export default function ImageEditCanvas({
  sceneNumber,
  title,
  imageSrc,
  onDownload,
  onImageChange,
  onDirtyChange,
}: ImageEditCanvasProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const [isEffectEditorOpen, setIsEffectEditorOpen] = useState(false);
  const [editMode, setEditMode] = useState<EditMode>("none");

  const [editHistory, setEditHistory] = useState<{
    stack: EditState[];
    index: number;
  }>({
    stack: [{ imageSrc, effects: DEFAULT_EFFECTS }],
    index: 0,
  });

  const [draftEffects, setDraftEffects] =
    useState<ImageEffectValues>(DEFAULT_EFFECTS);

  // Auto-save indicator
  const [autoSavedAt, setAutoSavedAt] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentState = editHistory.stack[editHistory.index];
  const currentImageSrc = currentState.imageSrc;
  const appliedEffects = currentState.effects;

  const hasChanges =
    editHistory.index > 0 ||
    currentState.imageSrc !== imageSrc ||
    !effectsEqual(currentState.effects, DEFAULT_EFFECTS);

  // 상위에 dirty 상태 알림
  const prevHasChangesRef = useRef(hasChanges);
  useEffect(() => {
    if (prevHasChangesRef.current === hasChanges) return;
    prevHasChangesRef.current = hasChanges;
    onDirtyChange?.(hasChanges);
  }, [hasChanges, onDirtyChange]);

  const triggerAutoSave = () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    setAutoSavedAt(new Date());
    autoSaveTimerRef.current = setTimeout(() => setAutoSavedAt(null), 3000);
  };

  const pushEdit = (newState: EditState) => {
    setEditHistory((prev) => ({
      stack: [...prev.stack.slice(0, prev.index + 1), newState],
      index: prev.index + 1,
    }));
    onImageChange?.(newState.imageSrc);
    triggerAutoSave();
  };

  // Ctrl+Z / Cmd+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key !== "z") return;
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement
      ) {
        return;
      }

      e.preventDefault();
      setEditHistory((prev) => {
        const nextIndex = Math.max(0, prev.index - 1);
        onImageChange?.(prev.stack[nextIndex].imageSrc);
        return { ...prev, index: nextIndex };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onImageChange]);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (wrapperRef.current.contains(e.target as Node)) return;

      setIsToolbarVisible(false);
      setIsEffectEditorOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  const previewEffects = isEffectEditorOpen ? draftEffects : appliedEffects;

  const imageStyle = useMemo<React.CSSProperties>(() => {
    const brightnessValue = 100 + previewEffects.brightness;
    const contrastValue = 100 + previewEffects.contrast;

    return {
      opacity: previewEffects.opacity / 100,
      filter: `brightness(${brightnessValue}%) contrast(${contrastValue}%)`,
      boxShadow:
        previewEffects.shadow > 0
          ? `0 12px ${previewEffects.shadow}px rgba(0, 0, 0, 0.35)`
          : "none",
    };
  }, [previewEffects]);

  const handleOpenEffectEditor = () => {
    setDraftEffects(appliedEffects);
    setIsEffectEditorOpen(true);
  };

  const handleCancelEffectEditor = () => {
    setDraftEffects(appliedEffects);
    setIsEffectEditorOpen(false);
  };

  const handleApplyEffectEditor = () => {
    pushEdit({ imageSrc: currentImageSrc, effects: draftEffects });
    setIsEffectEditorOpen(false);
  };

  const handleCropApply = (croppedImageUrl: string) => {
    pushEdit({ imageSrc: croppedImageUrl, effects: appliedEffects });
    setEditMode("none");
  };

  const handleImageToggle = () => {
    setIsToolbarVisible((prev) => {
      const next = !prev;
      if (!next) {
        setIsEffectEditorOpen(false);
      }
      return next;
    });
  };

  return (
    <section className="w-full rounded-[8px] bg-black px-4">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SceneLabel sceneNumber={sceneNumber} selected />
          <div className="text-[24px] font-bold text-white">{title}</div>
          {autoSavedAt && (
            <span className="text-[12px] text-[#9CA3AF]">
              자동저장됨{" "}
              {autoSavedAt.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
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
          imageSrc={currentImageSrc}
          onCancel={() => setEditMode("none")}
          onApply={handleCropApply}
        />
      ) : (
        <div ref={wrapperRef} className="relative flex items-center gap-4">
          {isToolbarVisible && (
            <div className="shrink-0">
              <ImageEditToolbar
                visible
                onCropClick={() => {
                  setIsEffectEditorOpen(false);
                  setEditMode("crop");
                }}
                onEffectClick={handleOpenEffectEditor}
              />
            </div>
          )}

          <div className="relative block min-w-0 flex-1 cursor-default rounded-[10px] text-left">
            {isEffectEditorOpen && (
              <div className="absolute left-0 top-30 z-20">
                <ImageEffectEditor
                  value={draftEffects}
                  onChange={setDraftEffects}
                  onCancel={handleCancelEffectEditor}
                  onApply={handleApplyEffectEditor}
                />
              </div>
            )}

            <div className="rounded-[8px] bg-[#111111] p-3">
              <ImageTransformViewer
                imageSrc={currentImageSrc}
                alt={`${title} 편집 이미지`}
                style={imageStyle}
                selected={isToolbarVisible}
                onImageClick={handleImageToggle}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
