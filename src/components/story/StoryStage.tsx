import { useState, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import {
  generateProjectPlanning,
  type GeneratePlanningResult,
} from "../../api/planApi";

export default function StoryStage({
  onSuccess,
}: {
  onSuccess?: (result: GeneratePlanningResult) => void;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const [idea, setIdea] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!idea.trim() || isLoading || !projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateProjectPlanning({
        projectId,
        userPrompt: idea,
      });

      console.log("기획생성 결과:", result);
      console.log("projectId:", projectId);
      console.log("plans length:", result.data?.plans?.length);
      console.log("selectedPlanId:", result.data?.selectedPlanId);
      console.log("success:", result.success);

      if (!result.success) {
        throw new Error(result.message || "기획 생성 실패");
      }

      if (
        !result.data ||
        !result.data.plans ||
        result.data.plans.length === 0
      ) {
        throw new Error("생성된 기획안이 없습니다.");
      }
      onSuccess?.(result.data);
    } catch {
      setError("기획 생성에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col w-full justify-around items-center px-6 py-8">
      {/* Headline */}
      <div className="flex flex-col mt-20">
        <div className="text-center text-[28px] mb-2 font-bold tracking-tight text-white!">
          당신의 이야기를 들려주세요.
        </div>
        <p className="text-center text-[16px] leading-relaxed text-gray-400">
          떠오르는 작은 아이디어 하나만으로도 새로운 이야기가 시작됩니다. 어떤
          장면을 만들고 어떤 세계를 펼칠지, 지금 상상의 문을 열어보세요.
        </p>
      </div>

      {/* Idea Textarea */}
      <div className="relative w-full rounded-2xl border border-white/6 bg-[#161618] px-5 pb-4 pt-5">
        <textarea
          value={idea}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setIdea(e.target.value)
          }
          placeholder="아이디어를 자유롭게 말해주세요."
          className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#e8e8e8] outline-none placeholder:text-gray-600"
          style={{ minHeight: 140 }}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!idea.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{
              background: idea.trim() ? "#6366f1" : "#2a2a2e",
              cursor: idea.trim() ? "pointer" : "default",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 5 5 12" />
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-red-400">{error}</p>
      )}
    </section>
  );
}
