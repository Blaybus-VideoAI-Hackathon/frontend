import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { getPlanHistory, type Plan } from "../api/planApi";

interface StoryPlan {
  id: string;
  title: string;
  badge: string;
  mainCharacter: string;
  subCharacters: string[];
  background: string;
  atmosphere: string;
  story: string;
}

const PLAN_LABELS = ["A", "B", "C"];

function mapToPlan(plan: Plan, index: number): StoryPlan {
  return {
    id: PLAN_LABELS[index] ?? String(index),
    title: plan.title || `기획안 ${PLAN_LABELS[index] ?? index + 1}`,
    badge: plan.focus ?? "",
    mainCharacter: plan.coreElements?.mainCharacter ?? "",
    subCharacters: plan.coreElements?.subCharacters ?? [],
    background: plan.coreElements?.backgroundWorld ?? "",
    atmosphere: plan.targetMood ?? "",
    story: plan.storyLine ?? plan.coreElements?.storyLine ?? "",
  };
}

interface StoryPlanPageProps {
  plans?: Plan[];
  onPrev?: () => void;
  onNext?: () => void;
}

export default function StoryPlanPage({
  plans: plansProp,
  onPrev,
  onNext,
}: StoryPlanPageProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [plans, setPlans] = useState<StoryPlan[]>(() =>
    plansProp && plansProp.length > 0
      ? plansProp.slice(0, 3).map(mapToPlan)
      : [],
  );
  const [selectedId, setSelectedId] = useState<string>(
    plansProp && plansProp.length > 0 ? (PLAN_LABELS[0] ?? "A") : "A",
  );
  const [isLoading, setIsLoading] = useState(
    !plansProp || plansProp.length === 0,
  );

  useEffect(() => {
    if (plansProp && plansProp.length > 0) return;
    if (!projectId) return;
    let cancelled = false;
    getPlanHistory({ projectId })
      .then((res) => {
        if (cancelled) return;
        const fetched = res.data.slice(-3).map(mapToPlan);
        setPlans(fetched);
        if (fetched.length > 0) setSelectedId(fetched[0].id);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, plansProp]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a1f] p-6">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-white/50">
          기획안을 불러오는 중...
        </div>
      ) : (
        <div className="flex gap-4 flex-1">
          {plans.map((plan) => {
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

                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-white/50 text-xs mb-0.5">메인 캐릭터</p>
                    <p className="text-white text-sm">{plan.mainCharacter}</p>
                  </div>
                  {plan.subCharacters.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">
                        보조 캐릭터
                      </p>
                      <p className="text-white text-sm">
                        {plan.subCharacters.join(", ")}
                      </p>
                    </div>
                  )}
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
      )}

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="secondary" onClick={onPrev}>
          이전
        </Button>
        <Button variant="primary" onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
}
