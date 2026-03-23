import { useMemo, useState } from "react";
import StepTabs from "../components/project-new/StepTabs";
import ProjectCoreToggle from "../components/project-new/ProjectCoreToggle";
import StepNavigation from "../components/project-new/StepNavigation";
import StoryStage from "../components/story/StoryStage";
import StoryPlanPage from "./StoryPlanPage";
import { type Plan } from "../api/planApi";
import { STEP_ORDER, type TabId } from "../constants/step";
import ImageStage from "../components/image&video/ImageStage";
import CutStage from "../components/cut/CutStage";
import AiChatBox from "../components/project-new/AiChatBox";
import ImageEditStage from "../components/image&video/ImageEditStage";
import VideoStage from "../components/image&video/VideoStage";
import VideoMergeStage from "../components/video/VideoMergeStage";
import { useCutScenes } from "../hooks/useCutScenes";
import { Navigate, useParams } from "react-router-dom";

type EditingScene = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  sceneId: number;
  imageId: number;
} | null;

export default function CreateProjectPage() {
  const { projectId: projectIdParam } = useParams();
  const projectId = Number(projectIdParam);

  const [activeStep, setActiveStep] = useState<TabId>("story");
  const [storySubStep, setStorySubStep] = useState<"input" | "plan">("input");
  const [storyPlans, setStoryPlans] = useState<Plan[]>([]);
  const [editingScene, setEditingScene] = useState<EditingScene>(null);

  const isValidProjectId = Number.isFinite(projectId) && projectId > 0;

  const isCutStage = activeStep === "cut";
  const isImageEditing = activeStep === "image" && editingScene !== null;

  const {
    scenes,
    selectedScene,
    selectedSceneId,
    selectedSceneNumber,
    loading,
    error,
    isDeleting,
    regeneratingSceneId,
    initialize,
    setSelectedSceneId,
    handleDeleteScene,
    handleRegenerateScene,
  } = useCutScenes({
    projectId,
    enabled: isValidProjectId && isCutStage,
  });

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
        if (storySubStep === "plan") {
          return (
            <StoryPlanPage
              plans={storyPlans}
              onPrev={() => setStorySubStep("input")}
              onNext={handleNext}
            />
          );
        }
        return (
          <StoryStage
            onSuccess={(plans) => {
              setStoryPlans(plans);
              setStorySubStep("plan");
            }}
          />
        );
      case "image":
        return (
          <ImageStage
            projectId={projectId}
            onEnterEditMode={(scene) => {
              setEditingScene(scene);
            }}
          />
        );
      case "video":
        return <VideoStage projectId={projectId} />;
      case "finish":
        return <VideoMergeStage />;
      default:
        return null;
    }
  };

  // 혹시몰라 되돌아가는 기능 넣었으나 이상하면 빼겠음
  if (!isValidProjectId) {
    return <Navigate to="/" replace />;
  }

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
            projectId={projectId}
            sceneId={editingScene.sceneId}
            imageId={editingScene.imageId}
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
              <CutStage
                scenes={scenes}
                selectedScene={selectedScene}
                selectedSceneId={selectedSceneId}
                selectedSceneNumber={selectedSceneNumber}
                loading={loading}
                error={error}
                isDeleting={isDeleting}
                regeneratingSceneId={regeneratingSceneId}
                onRetryInitialize={() => {
                  void initialize();
                }}
                onSelectScene={setSelectedSceneId}
                onDeleteScene={(sceneId) => {
                  void handleDeleteScene(sceneId);
                }}
                onRegenerateScene={(sceneId) => {
                  void handleRegenerateScene(sceneId);
                }}
              />
            </div>

            <div className="min-w-0 h-full">
              <AiChatBox
                disabled={!selectedSceneId}
                isSubmitting={regeneratingSceneId !== null}
                onSendMessage={async (message) => {
                  if (!selectedSceneId) return;
                  await handleRegenerateScene(selectedSceneId, message);
                }}
              />
            </div>
          </section>
        ) : (
          <>
            <ProjectCoreToggle />
            <div className="flex min-h-190 flex-col">
              {renderStageContent()}
            </div>
          </>
        )}
        {/* 특정 프로젝트 테스트용 */}
        {/* {!isImageEditing && (
          <StepNavigation
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )} */}

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
