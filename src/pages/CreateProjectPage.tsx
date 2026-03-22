import { useMemo, useState } from "react";
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
import { useCutScenes } from "../hooks/useCutScenes";

type EditingScene = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
} | null;

// 추후 프로젝트 생성 api와 연결 작업 예정
const TEMP_PROJECT_ID = 4;

export default function CreateProjectPage() {
  const [activeStep, setActiveStep] = useState<TabId>("story");
  const [editingScene, setEditingScene] = useState<EditingScene>(null);

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
    projectId: TEMP_PROJECT_ID,
    enabled: isCutStage,
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
        return <StoryStage />;
      case "image":
        return (
          <ImageStage
            projectId={TEMP_PROJECT_ID}
            onEnterEditMode={(scene) => {
              setEditingScene(scene);
            }}
          />
        );
      case "video":
        return <VideoStage projectId={TEMP_PROJECT_ID} />;
      case "finish":
        return <VideoMergeStage />;
      default:
        return null;
    }
  };

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
            <div className="min-h-[760px]">{renderStageContent()}</div>
          </>
        )}

        {!isImageEditing && (
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
