import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import StepTabs from "../components/project-new/StepTabs";
import ProjectCoreToggle from "../components/project-new/ProjectCoreToggle";
import StepNavigation from "../components/project-new/StepNavigation";
import StoryStage from "../components/story/StoryStage";
import { STEP_ORDER, type TabId } from "../constants/step";
import ImageStage from "../components/image&video/ImageStage";
import CutStage from "../components/cut/CutStage";
import AiChatBox from "../components/project-new/AiChatBox";
import ImageEditStage from "../components/image&video/ImageEditStage";
import VideoStage from "../components/image&video/VideoStage";
import VideoMergeStage from "../components/video/VideoMergeStage";

type EditingScene = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
} | null;

export default function CreateProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeStep, setActiveStep] = useState<TabId>("story");
  const [editingScene, setEditingScene] = useState<EditingScene>(null);

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

  const handleCancelImageEdit = () => {
    setEditingScene(null);
  };

  const handleCompleteImageEdit = () => {
    setEditingScene(null);
  };

  const renderStageContent = () => {
    switch (activeStep) {
      case "story":
        return <StoryStage projectId={Number(projectId)} onSuccess={handleNext} />;
      case "image":
        return (
          <ImageStage
            onEnterEditMode={(scene) => {
              setEditingScene(scene);
            }}
          />
        );
      case "video":
        return <VideoStage />;
      case "finish":
        return <VideoMergeStage projectId={Number(projectId)} />;
      default:
        return null;
    }
  };

  const isCutStage = activeStep === "cut";
  const isImageEditing = activeStep === "image" && editingScene !== null;

  return (
    <main className="min-h-screen bg-black px-8 py-10">
      <div className="mx-auto flex flex-col gap-4">
        {!isImageEditing && (
          <>
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
          </>
        )}

        {isImageEditing && editingScene ? (
          <ImageEditStage
            sceneNumber={editingScene.sceneNumber}
            title={editingScene.title}
            imageSrc={editingScene.imageSrc}
            onCancelEdit={handleCancelImageEdit}
            onCompleteEdit={handleCompleteImageEdit}
          />
        ) : isCutStage ? (
          <section className="grid items-stretch grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_460px]">
            <div className="flex min-w-0 flex-col gap-4">
              <ProjectCoreToggle />
              <CutStage />
            </div>

            <div className="min-w-0 h-full">
              <AiChatBox />
            </div>
          </section>
        ) : (
          <>
            <ProjectCoreToggle />
            <div className="min-h-[760px]">{renderStageContent()}</div>
          </>
        )}

        {!isImageEditing && activeStep !== "story" && (
          <StepNavigation
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </div>
    </main>
  );
}
