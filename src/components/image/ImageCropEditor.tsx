import { useCallback, useMemo, useRef, useState } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
  type PercentCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { getCroppedImg } from "../../utils/cropUtils";

type CropPreset = "free" | "original" | "1:1" | "9:16" | "16:9" | "4:3" | "3:1";

type ImageCropEditorProps = {
  imageSrc: string;
  onCancel: () => void;
  onApply: (croppedImageUrl: string) => void;
};

const PRESET_OPTIONS: { label: string; value: CropPreset }[] = [
  { label: "사용자 지정", value: "free" },
  { label: "원본", value: "original" },
  { label: "1:1", value: "1:1" },
  { label: "9:16", value: "9:16" },
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "3:1", value: "3:1" },
];

function getAspectFromPreset(
  preset: CropPreset,
  naturalWidth: number,
  naturalHeight: number,
): number | undefined {
  switch (preset) {
    case "free":
      return undefined;
    case "original":
      return naturalWidth / naturalHeight;
    case "1:1":
      return 1;
    case "9:16":
      return 9 / 16;
    case "16:9":
      return 16 / 9;
    case "4:3":
      return 4 / 3;
    case "3:1":
      return 3 / 1;
    default:
      return undefined;
  }
}

function createFullImageCrop(): PercentCrop {
  return {
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
}

function createMaxAspectCrop(
  aspect: number,
  width: number,
  height: number,
): PercentCrop {
  const imageRatio = width / height;

  if (imageRatio > aspect) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          height: 100,
        },
        aspect,
        width,
        height,
      ),
      width,
      height,
    );
  }

  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 100,
      },
      aspect,
      width,
      height,
    ),
    width,
    height,
  );
}

export default function ImageCropEditor({
  imageSrc,
  onCancel,
  onApply,
}: ImageCropEditorProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [preset, setPreset] = useState<CropPreset>("free");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });

  const aspect = useMemo(
    () => getAspectFromPreset(preset, naturalSize.width, naturalSize.height),
    [preset, naturalSize],
  );

  const createInitialCrop = useCallback(
    (
      nextPreset: CropPreset,
      naturalWidth: number,
      naturalHeight: number,
      renderedWidth: number,
      renderedHeight: number,
    ): PercentCrop => {
      const nextAspect = getAspectFromPreset(
        nextPreset,
        naturalWidth,
        naturalHeight,
      );

      if (!nextAspect) {
        return createFullImageCrop();
      }

      return createMaxAspectCrop(nextAspect, renderedWidth, renderedHeight);
    },
    [],
  );

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { naturalWidth, naturalHeight, width, height } = e.currentTarget;
      imgRef.current = e.currentTarget;
      setNaturalSize({ width: naturalWidth, height: naturalHeight });

      const initialCrop = createInitialCrop(
        preset,
        naturalWidth,
        naturalHeight,
        width,
        height,
      );

      setCrop(initialCrop);
    },
    [preset, createInitialCrop],
  );

  const handlePresetChange = (nextPreset: CropPreset) => {
    setPreset(nextPreset);

    if (!imgRef.current) return;

    const nextCrop = createInitialCrop(
      nextPreset,
      imgRef.current.naturalWidth,
      imgRef.current.naturalHeight,
      imgRef.current.width,
      imgRef.current.height,
    );

    setCrop(nextCrop);
  };

  const handleApply = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) {
      return;
    }

    const croppedUrl = await getCroppedImg(imgRef.current, completedCrop);
    onApply(croppedUrl);
  };

  return (
    <div className="rounded-[10px] bg-[#111111] p-4">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value as CropPreset)}
          className="rounded-[8px] border border-[#3A3A3A] bg-[#1F1F1F] px-4 py-2 text-white outline-none"
        >
          {PRESET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-[8px] bg-[#3A3A3D] px-4 py-2 text-white"
        >
          취소
        </button>

        <button
          type="button"
          onClick={handleApply}
          className="rounded-[8px] bg-[#5C4DFF] px-4 py-2 text-white"
        >
          적용
        </button>
      </div>

      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop: PercentCrop) => setCrop(percentCrop)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={aspect}
        keepSelection
        ruleOfThirds
      >
        <img
          src={imageSrc}
          alt="crop target"
          onLoad={onImageLoad}
          className="max-h-[70vh] w-auto max-w-full object-contain"
        />
      </ReactCrop>
    </div>
  );
}
