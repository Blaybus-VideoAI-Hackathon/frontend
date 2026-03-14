import { useState } from "react";
import LockIcon from "../../assets/icons/lock_purple.svg";

type InfoItem = {
  label: string;
  value: string;
};

const basicSettings: InfoItem[] = [
  { label: "영상 비율", value: "16:9" },
  { label: "영상 길이", value: "20초" },
  { label: "영상 스타일", value: "애니메이션 스타일" },
  { label: "영상 목적", value: "스토리형" },
];

const scenarioSettings: InfoItem[] = [
  { label: "메인 캐릭터", value: "16:9" },
  { label: "보조 캐릭터", value: "20초" },
  { label: "배경", value: "애니메이션 스타일" },
  { label: "분위기", value: "스토리형" },
  {
    label: "스토리",
    value: "대치 → 아카이누의 선공 → 상크스의 방어와 거대한 충돌",
  },
];

const storylineText =
  "정상대전의 전장이 잿빛 연기와 무너진 건물 잔해로 가득한 가운데, 전쟁의 흐름을 뒤바꿀 순간이 다가오고 있었다. 팽팽한 긴장감이 공기를 짓누르는 가운데 메인 캐릭터인 상크스가 조용히 전장 한가운데 서 있고, 그 맞은편에는 거대한 위압감을 풍기며 아카이누가 천천히 걸어 나오며 서로를 노려본다. 두 사람 사이에는 짧지만 무겁게 내려앉은 대치의 시간이 흐르고, 그 침묵을 깨듯 아카이누가 먼저 움직인다. 끓어오르는 마그마의 힘이 주먹을 감싸며 거대한 공격이 전장을 가르듯 상크스를 향해 쏟아지고, 그 순간 상크스는 흔들림 없는 눈빛으로 검을 들어 올려 공격을 막아낸다. 마그마와 패기의 힘이 정면으로 충돌하며 엄청난 폭발과 함께 거대한 충격파가 주변을 뒤흔들고, 전장은 마치 폭발 직전의 화산처럼 요동치며 두 강자의 힘이 정면으로 맞부딪히는 거대한 충돌의 중심이 된다.";

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
    <div className="space-y-1">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[140px_1fr] gap-2 text-[15px]"
        >
          <span className="font-semibold text-gray-400">{item.label}</span>
          <span className="text-gray-400">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProjectCoreToggle() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(true);

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
          isOpen ? "max-h-500 opacity-100 pt-8" : "max-h-0 opacity-0 pt-0"
        }`}
      >
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div>
            <h3 className="mb-3 text-[17px] font-semibold text-gray-200">
              기초설정
            </h3>
            <div className="rounded-[20px] border border-gray-800 p-4">
              <InfoList items={basicSettings} />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-[17px] font-semibold text-gray-200">
              영상 시나리오
            </h3>
            <div className="rounded-[20px] border border-gray-800 p-4">
              <InfoList items={scenarioSettings} />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-gray-800 px-4 py-3">
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
                ? "max-h-250 opacity-100 pt-2"
                : "max-h-0 opacity-0 pt-0"
            }`}
          >
            <p className="text-[15px] text-gray-400">{storylineText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
