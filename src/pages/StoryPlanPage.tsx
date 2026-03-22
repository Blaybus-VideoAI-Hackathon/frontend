import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlanHistory, type ProjectPlanResponse } from "../api/planApi";
import Button from "../components/ui/Button";

interface StoryPlan {
  id: string;
  title: string;
  badge: string;
  mainCharacter: string;
  background: string;
  atmosphere: string;
  story: string;
}

const PLAN_LABELS = ["A", "B", "C"];

function mapToPlan(plan: ProjectPlanResponse, index: number): StoryPlan {
  return {
    id: PLAN_LABELS[index] ?? String(index),
    title: `기획안 ${PLAN_LABELS[index] ?? index + 1}`,
    badge: plan.theme ?? plan.style,
    mainCharacter: plan.mainCharacter,
    background: plan.background,
    atmosphere: plan.mood,
    story: plan.scenes.map((s) => s.description).join(" → "),
  };
}

interface StoryPlanPageProps {
  onPrev?: () => void;
  onNext?: () => void;
}

export default function StoryPlanPage({ onPrev, onNext }: StoryPlanPageProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [plans, setPlans] = useState<StoryPlan[]>([]);
  const [selectedId, setSelectedId] = useState<string>("A");
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchPlans = async () => {
      try {
        const result = await getPlanHistory({ projectId });
const data = result.data;
        if (!Array.isArray(data) || data.length === 0) return;
        // 첫 번째 항목의 mainCharacter가 null이면 아직 생성 중
        if (data[0].mainCharacter === null) return;

        const fetched = data.slice(0, 3).map(mapToPlan);
        setPlans(fetched);
        setSelectedId(fetched[0]?.id ?? "A");
        setIsLoading(false);

        if (intervalRef.current) clearInterval(intervalRef.current);
      } catch {
        // 재시도
      }
    };

    void fetchPlans();
    intervalRef.current = setInterval(() => void fetchPlans(), 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [projectId]);

  return (
    <div className="flex flex-col h-full bg-[#1a1a1f] p-6">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-white/50">
          기획안을 생성하는 중...
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
