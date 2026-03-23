import { useEffect, useMemo, useState } from "react";
import StepTabs from "../components/project-new/StepTabs";
import ProjectCoreToggle from "../components/project-new/ProjectCoreToggle";
import StepNavigation from "../components/project-new/StepNavigation";
import StoryStage from "../components/story/StoryStage";
import StoryPlanPage from "./StoryPlanPage";
import { type GeneratedPlanItem } from "../api/planApi";
import { STEP_ORDER, type TabId } from "../constants/step";
import ImageStage from "../components/image&video/ImageStage";
import CutStage from "../components/cut/CutStage";
import AiChatBox from "../components/project-new/AiChatBox";
import ImageEditStage from "../components/image&video/ImageEditStage";
import VideoStage from "../components/image&video/VideoStage";
import VideoMergeStage from "../components/video/VideoMergeStage";
import { useCutScenes } from "../hooks/useCutScenes";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  getProjectPlans,
  getProjectPlanningSummary,
  type ProjectPlanningSummary,
} from "../api/planApi1";

type EditingScene = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  sceneId: number;
  imageId: number;
} | null;

export default function CreateProjectPage() {
  const { projectId: projectIdParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const projectId = Number(projectIdParam);
  const routeState = location.state as { projectTitle?: string } | null;
  const projectTitle = routeState?.projectTitle ?? "파일명";

  const [activeStep, setActiveStep] = useState<TabId>("story");
  const [storySubStep, setStorySubStep] = useState<"input" | "plan">("input");
  const [storyPlans, setStoryPlans] = useState<GeneratedPlanItem[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [editingScene, setEditingScene] = useState<EditingScene>(null);

  const [hasStoryPlans, setHasStoryPlans] = useState(false);
  const [plansLoading, setPlansLoading] = useState(false);

  const [planningSummary, setPlanningSummary] =
    useState<ProjectPlanningSummary | null>(null);
  const [planningSummaryLoading, setPlanningSummaryLoading] = useState(false);

  const isValidProjectId = Number.isFinite(projectId) && projectId > 0;

  const isCutStage = activeStep === "cut";
  const isStoryStage = activeStep === "story";
  const isImageEditing = activeStep === "image" && editingScene !== null;

  const {
    scenes,
    selectedScene,
    selectedSceneId,
    selectedSceneNumber,
    loading,
    isGeneratingPrompts,
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
    selectedPlanId: selectedPlanId ?? planningSummary?.selectedPlanId ?? null,
  });

  useEffect(() => {
    setActiveStep("story");
    setEditingScene(null);
  }, [location.key]);

  useEffect(() => {
    if (!isValidProjectId) return;
    if (!isStoryStage) return;

    let mounted = true;

    const fetchPlans = async () => {
      setPlansLoading(true);

      try {
        const response = await getProjectPlans({ projectId });
        const plans = response.data ?? [];

        if (!mounted) return;
        setHasStoryPlans(plans.length > 0);
      } catch (err) {
        console.error("기획 이력 조회 실패:", err);
        if (!mounted) return;
        setHasStoryPlans(false);
      } finally {
        if (mounted) {
          setPlansLoading(false);
        }
      }
    };

    void fetchPlans();

    return () => {
      mounted = false;
    };
  }, [isStoryStage, isValidProjectId, projectId]);

  useEffect(() => {
    if (!isValidProjectId) return;
    if (isStoryStage) return;

    let mounted = true;

    const fetchPlanningSummary = async () => {
      setPlanningSummaryLoading(true);

      try {
        const response = await getProjectPlanningSummary({ projectId });

        if (!mounted) return;
        setPlanningSummary(response.data ?? null);
      } catch (err) {
        console.error("프로젝트 핵심요소 조회 실패:", err);
        if (!mounted) return;
        setPlanningSummary(null);
      } finally {
        if (mounted) {
          setPlanningSummaryLoading(false);
        }
      }
    };

    void fetchPlanningSummary();

    return () => {
      mounted = false;
    };
  }, [isStoryStage, isValidProjectId, projectId, hasStoryPlans]);

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
    if (activeStep === "video") {
      void navigate(`/projects/${projectId}/complete`);
      return;
    }
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
              onNext={(planId) => {
                setSelectedPlanId(planId);
                handleNext();
              }}
            />
          );
        }
        return (
          <StoryStage
            onSuccess={(result) => {
              setStoryPlans(result.plans);
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

  if (!isValidProjectId) {
    return <Navigate to="/" replace />;
  }

  const shouldShowStepNavigation =
    !isImageEditing && (!isStoryStage || (!plansLoading && hasStoryPlans));

  return (
    <main className="min-h-screen bg-black px-8 py-10">
      <div className="mx-auto flex flex-col gap-4">
        {!isImageEditing && (
          <>
            <div className="flex items-center gap-2">
              <div className="text-[24px] font-bold text-white">
                {projectTitle}
              </div>
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
              <ProjectCoreToggle
                summary={planningSummary}
                loading={planningSummaryLoading}
              />
              <CutStage
                scenes={scenes}
                selectedScene={selectedScene}
                selectedSceneId={selectedSceneId}
                selectedSceneNumber={selectedSceneNumber}
                loading={loading}
                isGeneratingPrompts={isGeneratingPrompts}
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
            {activeStep !== "story" && (
              <ProjectCoreToggle
                summary={planningSummary}
                loading={planningSummaryLoading}
              />
            )}
            <div className="flex min-h-190 flex-col">
              {renderStageContent()}
            </div>
          </>
        )}

        {shouldShowStepNavigation && (
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
