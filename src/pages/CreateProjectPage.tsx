import { useMemo, useState } from "react";
import StepTabs from "../components/project-new/StepTabs";
import ProjectCoreToggle from "../components/project-new/ProjectCoreToggle";
import StepNavigation from "../components/project-new/StepNavigation";
import CutStage from "../components/cut/CutStage";
import { STEP_ORDER, type TabId } from "../constants/step";

export default function CreateProjectPage() {
  const [activeStep, setActiveStep] = useState<TabId>("cut");

  const currentStepIndex = useMemo(
    () => STEP_ORDER.indexOf(activeStep),
    [activeStep],
  );

  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < STEP_ORDER.length - 1;

  const handlePrev = () => {
    if (!canGoPrev) return;
    setActiveStep(STEP_ORDER[currentStepIndex - 1]);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    setActiveStep(STEP_ORDER[currentStepIndex + 1]);
  };

  // 나머지 단계는 임시로 넣었고, CutStage처럼 컴포넌트 연결하시면 좋을 것 같습니다
  const renderStageContent = () => {
    switch (activeStep) {
      case "story":
        return (
          <section className="rounded-[16px] bg-[#17181C] p-6 text-white">
            <div className="text-2xl font-bold">스토리 기획 단계</div>
          </section>
        );
      case "cut":
        return <CutStage />;
      case "image":
        return (
          <section className="rounded-[16px] bg-[#17181C] p-6 text-white">
            <div className="text-2xl font-bold">이미지 생성 단계</div>
          </section>
        );
      case "video":
        return (
          <section className="rounded-[16px] bg-[#17181C] p-6 text-white">
            <div className="text-2xl font-bold">동영상 생성 단계</div>
          </section>
        );
      case "finish":
        return (
          <section className="rounded-[16px] bg-[#17181C] p-6 text-white">
            <div className="text-2xl font-bold">최종 완성 단계</div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-5">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="text-[24px] font-bold text-white">파일명</div>
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <StepTabs activeTab={activeStep} />

        <ProjectCoreToggle />

        <div className="min-h-[640px]">{renderStageContent()}</div>

        <StepNavigation
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}
