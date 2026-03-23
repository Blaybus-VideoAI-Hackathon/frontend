import SceneListBox from "./SceneListBox";
import SceneDetailBox from "./SceneDetailBox";
import type { CutScene } from "../../hooks/useCutScenes";

type CutStageProps = {
  scenes: CutScene[];
  selectedScene: CutScene | null;
  selectedSceneId: number | null;
  selectedSceneNumber: number;
  loading: boolean;
  isGeneratingPrompts: boolean;
  generationStatusMessage?: string | null;
  error: string | null;
  isDeleting: boolean;
  regeneratingSceneId: number | null;
  onRetryInitialize: () => void;
  onSelectScene: (sceneId: number) => void;
  onDeleteScene: (sceneId: number) => void;
  onRegenerateScene: (sceneId: number) => void;
};

function LoadingPanel() {
  return (
    <section className="grid items-stretch grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
      <div className="rounded-[8px] bg-gray-900 px-6 py-5">
        <div className="mb-6 text-[18px] font-bold text-white">
          컷 구성 (스토리 흐름)
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-14 w-full animate-pulse rounded-[8px] bg-[rgba(255,255,255,0.06)]"
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-[600px] items-center justify-center rounded-[8px] bg-gray-900">
        <div className="text-[18px] text-[rgba(255,255,255,0.72)]">
          컷씬 정보를 생성/조회 중입니다...
        </div>
      </div>
    </section>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <section className="rounded-[8px] bg-gray-900 px-7 py-10 text-center">
      <div className="text-[18px] font-semibold text-white">{message}</div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-[8px] bg-[#5C4DFF] px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-[#4f41ee]"
      >
        다시 시도
      </button>
    </section>
  );
}

export default function CutStage({
  scenes,
  selectedScene,
  selectedSceneId,
  selectedSceneNumber,
  loading,
  isGeneratingPrompts,
  generationStatusMessage,
  error,
  isDeleting,
  regeneratingSceneId,
  onRetryInitialize,
  onSelectScene,
  onDeleteScene,
  onRegenerateScene,
}: CutStageProps) {
  if (loading && scenes.length === 0) {
    return <LoadingPanel />;
  }

  if (error && scenes.length === 0) {
    return <ErrorPanel message={error} onRetry={onRetryInitialize} />;
  }

  if (!selectedScene || !selectedSceneId) {
    return (
      <section className="rounded-[8px] bg-gray-900 px-7 py-10 text-center">
        <div className="text-[18px] text-[rgba(255,255,255,0.72)]">
          생성된 컷씬이 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="grid items-stretch grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        {error && (
          <div className="rounded-[8px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
            {error}
          </div>
        )}

        <SceneListBox
          scenes={scenes}
          selectedSceneId={selectedSceneId}
          onSelectScene={onSelectScene}
          onRemoveScene={(sceneId) => {
            onDeleteScene(sceneId);
          }}
          removeDisabled={
            isDeleting || regeneratingSceneId !== null || isGeneratingPrompts
          }
        />
      </div>

      {isGeneratingPrompts ? (
        <div className="flex min-h-150 items-center justify-center rounded-lg bg-gray-900">
          <div className="text-[18px] text-[rgba(255,255,255,0.72)]">
            {generationStatusMessage ??
              "이미지/영상 프롬프트를 생성 중입니다..."}
          </div>
        </div>
      ) : (
        <SceneDetailBox
          sceneNumber={selectedSceneNumber}
          title={selectedScene.title}
          details={selectedScene.details}
          isRegenerating={regeneratingSceneId === selectedScene.id}
          onRegenerateScene={() => {
            onRegenerateScene(selectedScene.id);
          }}
        />
      )}
    </section>
  );
}
