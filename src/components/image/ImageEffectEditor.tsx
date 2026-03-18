type ImageEffectValues = {
  opacity: number; // 0 ~ 100
  brightness: number; // -100 ~ 100
  contrast: number; // -100 ~ 100
  shadow: number; // 0 ~ 50
};

type ImageEffectEditorProps = {
  value: ImageEffectValues;
  onChange: (next: ImageEffectValues) => void;
  onCancel: () => void;
  onApply: () => void;
};

type SliderRowProps = {
  label: string;
  min: number;
  max: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function SliderRow({
  label,
  min,
  max,
  value,
  suffix = "",
  onChange,
}: SliderRowProps) {
  return (
    <div className="space-y-0">
      <div className="text-[15px] font-semibold text-[#CFCFD4]">{label}</div>

      <div className="flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-2 w-full cursor-pointer accent-[#5C4DFF]"
        />

        <div className="flex h-11 min-w-[88px] items-center justify-center rounded-[10px] bg-[#2A2A2E] px-3 text-[16px] text-white">
          {value}
          {suffix}
        </div>
      </div>
    </div>
  );
}

export type { ImageEffectValues };

export default function ImageEffectEditor({
  value,
  onChange,
  onCancel,
  onApply,
}: ImageEffectEditorProps) {
  return (
    <div className="rounded-[10px] bg-[#111111] p-4">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="rounded-[8px] border border-[#3A3A3A] bg-[#1F1F1F] px-4 py-2 text-white">
          이미지 효과
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-[8px] bg-[#3A3A3D] px-4 py-2 text-white"
        >
          취소
        </button>

        <button
          type="button"
          onClick={onApply}
          className="rounded-[8px] bg-[#5C4DFF] px-4 py-2 text-white"
        >
          적용
        </button>
      </div>

      <div className="space-y-0">
        <SliderRow
          label="불투명도"
          min={0}
          max={100}
          value={value.opacity}
          suffix="%"
          onChange={(next) => onChange({ ...value, opacity: next })}
        />

        <SliderRow
          label="밝기"
          min={-100}
          max={100}
          value={value.brightness}
          onChange={(next) => onChange({ ...value, brightness: next })}
        />

        <SliderRow
          label="대비"
          min={-100}
          max={100}
          value={value.contrast}
          onChange={(next) => onChange({ ...value, contrast: next })}
        />

        <SliderRow
          label="그림자"
          min={0}
          max={50}
          value={value.shadow}
          onChange={(next) => onChange({ ...value, shadow: next })}
        />
      </div>
    </div>
  );
}
