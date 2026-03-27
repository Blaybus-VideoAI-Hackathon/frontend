import SceneMediaListBox from "./SceneMediaListBox";
import SceneMediaPreview from "./SceneMediaPreview";
import { useVideoScenes } from "../../hooks/useVideoScenes";

type VideoStageProps = {
  projectId: number;
};

function LoadingPanel() {
  return (
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[420px_minmax(0,1fr)]">
      <div className="rounded-[8px] bg-gray-900 p-5">
        <div className="mb-5 text-[18px] font-bold leading-none text-white">
          컷 구성 (스토리 흐름)
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-[170px] w-full animate-pulse rounded-[8px] bg-[rgba(255,255,255,0.06)]"
            />
          ))}
        </div>
      </div>

      <div className="rounded-[8px] bg-gray-900 p-6">
        <div className="flex min-h-190 items-center justify-center text-[18px] text-[rgba(255,255,255,0.72)]">
          영상 목록을 불러오는 중입니다...
        </div>
      </div>
    </section>
  );
}

export default function VideoStage({ projectId }: VideoStageProps) {
  const {
    items,
    selectedScene,
    selectedSceneId,
    selectedSceneNumber,
    loading,
    error,
    submittingSceneId,
    setSelectedSceneId,
    initialize,
    handleGenerateScene,
    handleRegenerateScene,
  } = useVideoScenes({
    projectId,
    enabled: true,
  });

  const handleSelectScene = (sceneId: number) => {
    const target = items.find((scene) => scene.id === sceneId);
    if (!target) return;
    if (target.status === "locked") return;

    setSelectedSceneId(sceneId);
  };

  if (loading && items.length === 0) {
    return <LoadingPanel />;
  }

  if (!selectedScene && items.length === 0) {
    return (
      <section className="flex min-h-190 flex-col items-center justify-center rounded-[8px] bg-gray-900 gap-4">
        <div className="text-[16px] text-[rgba(255,255,255,0.7)]">
          표시할 씬이 없습니다.
        </div>
        <button
          type="button"
          onClick={() => {
            void initialize();
          }}
          className="rounded-[8px] bg-[#5C4DFF] px-5 py-3 text-white"
        >
          다시 시도
        </button>
      </section>
    );
  }

  if (!selectedScene) return null;

  return (
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[420px_minmax(0,1fr)]">
      <SceneMediaListBox
        items={items}
        selectedSceneId={selectedSceneId}
        mode="video"
        onSelectScene={handleSelectScene}
        onGenerateScene={(sceneId) => {
          void handleGenerateScene({ sceneId });
        }}
        onRegenerateScene={(sceneId) => {
          void handleRegenerateScene({ sceneId });
        }}
      />

      <div className="flex flex-col gap-3">
        {error && (
          <div className="rounded-[8px] border border-red-500/30 bg-red-500/10 px-4 py-3 text-[14px] text-red-300">
            {error}
          </div>
        )}

        <SceneMediaPreview
          sceneNumber={selectedSceneNumber}
          title={selectedScene.title}
          mode="video"
          status={selectedScene.status}
          src={selectedScene.thumbnailSrc}
          durationText={selectedScene.durationText}
          onAction={() => {
            if (
              selectedScene.status === "done" ||
              selectedScene.status === "failed"
            ) {
              void handleRegenerateScene({ sceneId: selectedScene.id });
            }
          }}
        />

        {submittingSceneId === selectedScene.id && (
          <div className="text-center text-[14px] text-[rgba(255,255,255,0.65)]">
            영상 생성 요청을 처리 중입니다...
          </div>
        )}
      </div>
    </section>
  );
}
