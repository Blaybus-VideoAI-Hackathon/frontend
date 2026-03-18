import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  dot?: string; // 상태 dot 색상 (hex)
  disabled?: boolean;
}

interface DropdownSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function DropdownSelect({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
  className = "",
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 선택된 옵션 찾기
  const selected = options.find((o) => o.value === value);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange?.(opt.value);
    setIsOpen(false);
  };

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      {/* 트리거 버튼 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          "w-full flex items-center justify-between gap-2",
          "px-3 py-2 rounded-lg text-sm transition-all duration-150",
          "bg-[#1a1a1a] border text-[#e0e0e0]",
          isOpen
            ? "border-[#7c6af7] ring-2 ring-[#7c6af7]/20"
            : "border-[#2e2e2e] hover:border-[#7c6af7]",
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        {/* 선택값 표시 */}
        <span
          className={`flex items-center gap-2 truncate ${!selected ? "text-[#555]" : ""}`}
        >
          {selected?.dot && (
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: selected.dot }}
            />
          )}
          {selected ? selected.label : placeholder}
        </span>

        {/* 화살표 아이콘 */}
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="#666"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* 드롭다운 패널 */}
      <div
        className={[
          "absolute z-50 left-0 right-0 mt-1.5",
          "bg-[#181818] border border-[#2e2e2e] rounded-lg overflow-hidden",
          "transition-all duration-150 origin-top",
          isOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none",
        ].join(" ")}
        style={{ maxHeight: 240, overflowY: "auto" }}
      >
        {/* 옵션 목록 */}
        <div className="py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              onClick={() => handleSelect(opt)}
              className={[
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left",
                "transition-colors duration-100",
                opt.value === value
                  ? "text-[#a695ff] bg-[#1e1a3a]"
                  : "text-[#ccc] hover:bg-[#232323] hover:text-white",
                opt.disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer",
              ].join(" ")}
            >
              {/* 체크 아이콘 */}
              <svg
                className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${opt.value === value ? "opacity-100" : "opacity-0"}`}
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M2 7l4 4 6-7"
                  stroke="#7c6af7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* 상태 dot */}
              {opt.dot && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: opt.dot }}
                />
              )}

              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
