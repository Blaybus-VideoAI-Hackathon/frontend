import { useMemo, useState } from "react";
import LockIcon from "../../assets/icons/lock_purple.svg";
import type { ProjectPlanningSummary } from "../../api/planApi1";

type InfoItem = {
  label: string;
  value: string;
};

type ProjectCoreToggleProps = {
  summary: ProjectPlanningSummary | null;
  loading?: boolean;
};

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-6 w-6 text-gray-100 transition-transform duration-300 ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function InfoList({ items }: { items: InfoItem[] }) {
  return (
    <div className="space-y-0.5 min-h-34">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[140px_1fr] gap-2">
          <span className="font-semibold text-[18px] text-gray-400">
            {item.label}
          </span>
          <span className="wrap-break-word text-[16px] text-gray-400">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatDuration(duration?: number) {
  if (!duration || Number.isNaN(duration)) return "-";
  return `${duration}초`;
}

function joinSubCharacters(subCharacters?: string[]) {
  if (!subCharacters || subCharacters.length === 0) return "-";
  return subCharacters.join(", ");
}

export default function ProjectCoreToggle({
  summary,
  loading = false,
}: ProjectCoreToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(true);

  const basicSettings = useMemo<InfoItem[]>(() => {
    if (!summary) {
      return [
        { label: "영상 비율", value: "-" },
        { label: "영상 길이", value: "-" },
        { label: "영상 스타일", value: "-" },
        { label: "영상 목적", value: "-" },
      ];
    }

    return [
      { label: "영상 비율", value: summary.ratio || "-" },
      { label: "영상 길이", value: formatDuration(summary.duration) },
      { label: "영상 스타일", value: summary.style || "-" },
      { label: "영상 목적", value: summary.purpose || "-" },
    ];
  }, [summary]);

  const scenarioSettings = useMemo<InfoItem[]>(() => {
    if (!summary) {
      return [
        { label: "메인 캐릭터", value: "-" },
        { label: "보조 캐릭터", value: "-" },
        { label: "배경", value: "-" },
        { label: "스토리", value: "-" },
      ];
    }

    return [
      { label: "메인 캐릭터", value: summary.mainCharacter || "-" },
      { label: "보조 캐릭터", value: joinSubCharacters(summary.subCharacters) },
      { label: "배경", value: summary.backgroundWorld || "-" },
      { label: "스토리", value: summary.storyFlow || "-" },
    ];
  }, [summary]);

  const storylineText = summary?.storyLine || "-";

  return (
    <section className="w-full rounded-lg bg-gray-900 p-5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <img src={LockIcon} alt="" className="h-5 w-5 object-contain" />
          <span className="text-[18px] font-semibold text-gray-200">
            프로젝트 핵심요소
          </span>
        </div>

        <ChevronIcon isOpen={isOpen} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-[1200px] opacity-100 pt-8" : "max-h-0 opacity-0 pt-0"
        }`}
      >
        {loading ? (
          <div className="rounded-[20px] border border-gray-800 p-4 text-[15px] text-gray-400">
            프로젝트 핵심요소를 불러오는 중...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div>
                <h3 className="mb-3 text-[17px] font-semibold text-gray-200">
                  기초설정
                </h3>
                <div className="rounded-lg border border-gray-800 p-4">
                  <InfoList items={basicSettings} />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-[17px] font-semibold text-gray-200">
                  영상 시나리오
                </h3>
                <div className="rounded-lg border border-gray-800 p-4">
                  <InfoList items={scenarioSettings} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-gray-800 px-4 py-3">
              <button
                type="button"
                onClick={() => setIsStoryOpen((prev) => !prev)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-[17px] font-semibold text-gray-300">
                  스토리 라인
                </span>
                <ChevronIcon isOpen={isStoryOpen} />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isStoryOpen
                    ? "max-h-[300px] opacity-100 pt-2"
                    : "max-h-0 opacity-0 pt-0"
                }`}
              >
                <p className="whitespace-pre-wrap text-[15px] text-gray-400">
                  {storylineText}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
