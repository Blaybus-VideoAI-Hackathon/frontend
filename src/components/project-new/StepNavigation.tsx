type StepNavigationProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

export default function StepNavigation({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
}: StepNavigationProps) {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev}
        className={`rounded-lg px-7 py-4 text-base font-semibold transition ${
          canGoPrev
            ? "bg-[#3A3A3A] text-white hover:bg-[#474747]"
            : "cursor-not-allowed bg-[#2A2A2A] text-[#7A7A7A]"
        }`}
      >
        이전
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canGoNext}
        className={`rounded-lg px-7 py-4 text-base font-semibold transition ${
          canGoNext
            ? "bg-[#5C4DFF] text-white hover:bg-[#4f41ee]"
            : "cursor-not-allowed bg-[#2A2A2A] text-[#7A7A7A]"
        }`}
      >
        다음
      </button>
    </div>
  );
}
