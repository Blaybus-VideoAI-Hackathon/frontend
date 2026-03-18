import DropdownSelect from "./DropdownSelect";
import type { SelectOption } from "./DropdownSelect";

// ──────────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────────
export interface SceneCardProps {
  /** 씬 번호 (예: 3 → "Scene 03" 표시) */
  sceneNumber: number;
  /** 씬 제목 / 설명 텍스트 */
  title: string;
  /** 씬 지속 시간(초) */
  duration: number;
  /** 전환 효과 드롭다운 선택값 */
  transitionValue?: string;
  /** 전환 효과 변경 콜백 */
  onTransitionChange?: (value: string) => void;
  /** 전환 효과 옵션 목록 */
  transitionOptions?: SelectOption[];
  /** 카드 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ──────────────────────────────────────────
// 기본 전환 효과 옵션
// ──────────────────────────────────────────
const DEFAULT_TRANSITION_OPTIONS: SelectOption[] = [
  { value: "fade", label: "페이드 인/아웃" },
  { value: "cut", label: "컷 전환" },
  { value: "wipe", label: "와이프" },
  { value: "dissolve", label: "디졸브" },
  { value: "zoom", label: "줌 전환" },
  { value: "slide", label: "슬라이드" },
];

// ──────────────────────────────────────────
// 씬 번호를 "Scene 03" 형식으로 포맷
// ──────────────────────────────────────────
const formatSceneNumber = (n: number) => `Scene ${String(n).padStart(2, "0")}`;

// ──────────────────────────────────────────
// SceneCard 컴포넌트
// ──────────────────────────────────────────
export default function SceneCard({
  sceneNumber,
  title,
  duration,
  transitionValue,
  onTransitionChange,
  transitionOptions = DEFAULT_TRANSITION_OPTIONS,
  disabled = false,
  className = "",
}: SceneCardProps) {
  return (
    <div
      className={[
        // 카드 베이스
        "w-full rounded-xl p-4 flex flex-col gap-3",
        "bg-[#161616] border border-[#2a2a2a]",
        "transition-colors duration-150",
        disabled ? "opacity-50" : "hover:border-[#3a3a3a]",
        className,
      ].join(" ")}
    >
      {/* ── 상단 행: Scene 배지 ── */}
      <div className="flex items-center">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7c6af7] text-white select-none">
          {formatSceneNumber(sceneNumber)}
        </span>
      </div>

      {/* ── 중간 행: 씬 제목 + 지속시간 ── */}
      <div className="flex items-center justify-between gap-2">
        {/* 씬 제목 */}
        <span className="text-[#e0e0e0] text-sm font-medium leading-snug truncate">
          {title}
        </span>

        {/* 지속 시간 뱃지 */}
        <span className="shrink-0 px-2 py-0.5 rounded-md text-xs font-semibold text-[#aaa] bg-[#252525] border border-[#333]">
          {duration}초
        </span>
      </div>

      {/* ── 하단 행: 전환 효과 드롭다운 ── */}
      <DropdownSelect
        options={transitionOptions}
        value={transitionValue}
        onChange={onTransitionChange}
        placeholder="전환 효과를 선택해주세요."
        disabled={disabled}
      />
    </div>
  );
}
