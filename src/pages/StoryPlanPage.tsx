import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getLatestProjectPlans,
  selectProjectPlan,
  analyzeSelectedPlan,
  type GeneratedPlanItem,
} from "../api/planApi";

interface StoryPlan {
  id: string;
  planId: number;
  title: string;
  badge: string;
  mainCharacter: string;
  subCharacters: string[];
  background: string;
  atmosphere: string;
  story: string;
}

const PLAN_LABELS = ["A", "B", "C"];

function mapToPlan(plan: GeneratedPlanItem, index: number): StoryPlan {
  return {
    id: PLAN_LABELS[index] ?? String(index),
    planId: plan.planId,
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
  plans?: GeneratedPlanItem[];
  onPrev?: () => void;
  onNext?: (selectedPlanId: number) => void;
}

export default function StoryPlanPage({
  plans: plansProp,
  onPrev,
  onNext,
}: StoryPlanPageProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const [plans, setPlans] = useState<StoryPlan[]>([]);
  const [selectedId, setSelectedId] = useState<string>("A");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    const fetchPlans = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await getLatestProjectPlans({ projectId });
        const fetched = (res.data?.plans ?? []).slice(0, 3).map(mapToPlan);

        if (cancelled) return;

        setPlans(fetched);
        if (fetched.length > 0) {
          setSelectedId(fetched[0].id);
        }
      } catch {
        if (cancelled) return;

        // fallback: 혹시 부모에서 받은 plansProp이 있으면 그걸 사용
        if (plansProp && plansProp.length > 0) {
          const fallbackPlans = plansProp.slice(0, 3).map(mapToPlan);
          setPlans(fallbackPlans);
          if (fallbackPlans.length > 0) {
            setSelectedId(fallbackPlans[0].id);
          }
        } else {
          setError("기획안을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchPlans();

    return () => {
      cancelled = true;
    };
  }, [projectId, plansProp]);

  const handleNext = async () => {
    const selectedPlan = plans.find((p) => p.id === selectedId);
    if (!selectedPlan || !projectId || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      try {
        await selectProjectPlan({ projectId, planId: selectedPlan.planId });
      } catch {
        // 이미 선택된 상태면 무시
      }

      await analyzeSelectedPlan({ projectId, planId: selectedPlan.planId });
      onNext?.(selectedPlan.planId);
    } catch {
      setError("기획안 선택에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#1a1a1f] p-6">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-white/50">
          기획안을 불러오는 중...
        </div>
      ) : (
        <div className="flex flex-1 gap-4">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedId;

            return (
              <button
                key={plan.id}
                onClick={() => setSelectedId(plan.id)}
                className={`flex-1 rounded-2xl border p-5 text-left transition-colors ${
                  isSelected
                    ? "border-[#7c5cbf] bg-[#3d2f6b]"
                    : "border-transparent bg-[#2a2a2f] hover:border-[#7c5cbf]/40"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-semibold text-white">
                    {plan.title}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
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
                    <p className="mb-0.5 text-xs text-white/50">메인 캐릭터</p>
                    <p className="text-sm text-white">{plan.mainCharacter}</p>
                  </div>

                  {plan.subCharacters.length > 0 && (
                    <div>
                      <p className="mb-0.5 text-xs text-white/50">
                        보조 캐릭터
                      </p>
                      <p className="text-sm text-white">
                        {plan.subCharacters.join(", ")}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="mb-0.5 text-xs text-white/50">배경</p>
                    <p className="text-sm text-white">{plan.background}</p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-white/50">분위기</p>
                    <p className="text-sm text-white">{plan.atmosphere}</p>
                  </div>

                  <div>
                    <p className="mb-0.5 text-xs text-white/50">스토리</p>
                    <p className="text-sm text-white">{plan.story}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mt-3 text-center text-sm text-red-400">{error}</p>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className={`rounded-lg px-7 py-4 text-base font-semibold transition ${
            !isSubmitting
              ? "bg-[#3A3A3A] text-white hover:bg-[#474747]"
              : "cursor-not-allowed bg-[#2A2A2A] text-[#7A7A7A]"
          }`}
        >
          이전
        </button>

        <button
          type="button"
          onClick={() => void handleNext()}
          disabled={isSubmitting || isLoading || plans.length === 0}
          className={`rounded-lg px-7 py-4 text-base font-semibold transition ${
            isSubmitting || isLoading || plans.length === 0
              ? "cursor-not-allowed bg-[#2A2A2A] text-[#7A7A7A]"
              : "bg-[#5C4DFF] text-white hover:bg-[#4f41ee]"
          }`}
        >
          {isSubmitting ? "처리 중..." : "다음"}
        </button>
      </div>
    </div>
  );
}
