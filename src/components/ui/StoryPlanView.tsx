import { useState } from "react";
import Button from "./Button";

interface StoryPlan {
  id: string;
  title: string;
  badge: string;
  mainCharacter: string;
  subCharacter: string;
  background: string;
  atmosphere: string;
  story: string;
}

const STORY_PLANS: StoryPlan[] = [
  {
    id: "A",
    title: "기획안 A",
    badge: "전투중심",
    mainCharacter: "샹크스",
    subCharacter: "아카이누",
    background: "정상대전 전장",
    atmosphere: "폭발 직전의 팽팽한 긴장감과 비장함",
    story: "대지 → 아카이누의 선공 → 샹크스의 방어와 거대한 충돌",
  },
  {
    id: "B",
    title: "기획안 B",
    badge: "긴장감 중심",
    mainCharacter: "샹크스",
    subCharacter: "아카이누",
    background: "정상대전 전장",
    atmosphere: "폭발 직전의 팽팽한 긴장감과 비장함",
    story: "대지 → 아카이누의 선공 → 샹크스의 방어와 거대한 충돌",
  },
  {
    id: "C",
    title: "기획안 C",
    badge: "숏컷 임팩트 중심",
    mainCharacter: "샹크스",
    subCharacter: "아카이누",
    background: "정상대전 전장",
    atmosphere: "폭발 직전의 팽팽한 긴장감과 비장함",
    story: "대지 → 아카이누의 선공 → 샹크스의 방어와 거대한 충돌",
  },
];

interface StoryPlanViewProps {
  onPrev?: () => void;
  onNext?: (selectedPlan: StoryPlan) => void;
}

export default function StoryPlanView({ onPrev, onNext }: StoryPlanViewProps) {
  const [selectedId, setSelectedId] = useState<string>("A");

  const selectedPlan = STORY_PLANS.find((p) => p.id === selectedId)!;

  return (
    <div className="flex flex-col h-full bg-[#1a1a1f] p-6">
      {/* 카드 목록 */}
      <div className="flex gap-4 flex-1">
        {STORY_PLANS.map((plan) => {
          const isSelected = plan.id === selectedId;
          return (
            <button
              key={plan.id}
              onClick={() => setSelectedId(plan.id)}
              className={`flex-1 rounded-2xl p-5 text-left transition-colors border
                ${
                  isSelected
                    ? "bg-[#3d2f6b] border-[#7c5cbf]"
                    : "bg-[#2a2a2f] border-transparent hover:border-[#7c5cbf]/40"
                }`}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-white font-semibold text-base">
                  {plan.title}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium
                    ${
                      isSelected
                        ? "bg-purple-600 text-white"
                        : "border border-white/30 text-white/60"
                    }`}
                >
                  {plan.badge}
                </span>
              </div>

              {/* 내용 */}
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-white/50 text-xs mb-0.5">메인 캐릭터</p>
                  <p className="text-white text-sm">{plan.mainCharacter}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-0.5">보조 캐릭터</p>
                  <p className="text-white text-sm">{plan.subCharacter}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-0.5">배경</p>
                  <p className="text-white text-sm">{plan.background}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-0.5">분위기</p>
                  <p className="text-white text-sm">{plan.atmosphere}</p>
                </div>
                <div>
                  <p className="text-white/50 text-xs mb-0.5">스토리</p>
                  <p className="text-white text-sm">{plan.story}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={() => onNext?.(selectedPlan)}>
          다음
        </Button>
      </div>
    </div>
  );
}
