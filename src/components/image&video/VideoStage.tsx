import { useMemo, useState } from "react";
import SceneMediaListBox from "./SceneMediaListBox";
import SceneMediaPreview from "./SceneMediaPreview";
import VideoDurationModal from "./VideoDurationModal";
import { useVideoScenes } from "../../hooks/useVideoScenes";

type VideoStageProps = {
  projectId: number;
};

type DurationModalState = {
  sceneId: number;
  mode: "generate" | "regenerate";
} | null;

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

  const [durationModal, setDurationModal] = useState<DurationModalState>(null);

  const modalScene = useMemo(() => {
    if (!durationModal) return null;
    return items.find((item) => item.id === durationModal.sceneId) ?? null;
  }, [durationModal, items]);

  const modalSceneNumber = useMemo(() => {
    if (!modalScene) return 0;
    return items.findIndex((item) => item.id === modalScene.id) + 1;
  }, [items, modalScene]);

  const handleSelectScene = (sceneId: number) => {
    const target = items.find((scene) => scene.id === sceneId);
    if (!target) return;
    if (target.status === "locked") return;

    setSelectedSceneId(sceneId);
  };

  const openGenerateModal = (sceneId: number) => {
    setDurationModal({
      sceneId,
      mode: "generate",
    });
  };

  const openRegenerateModal = (sceneId: number) => {
    setDurationModal({
      sceneId,
      mode: "regenerate",
    });
  };

  if (loading && items.length === 0) {
    return (
      <section className="flex h-[760px] items-center justify-center rounded-[8px] bg-gray-900">
        <div className="text-[16px] text-[rgba(255,255,255,0.7)]">
          영상 목록을 불러오는 중...
        </div>
      </section>
    );
  }

  if (!selectedScene && items.length === 0) {
    return (
      <section className="flex h-[760px] flex-col items-center justify-center rounded-[8px] bg-gray-900 gap-4">
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
    <>
      <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[420px_minmax(0,1fr)]">
        <SceneMediaListBox
          items={items}
          selectedSceneId={selectedSceneId}
          mode="video"
          onSelectScene={handleSelectScene}
          onGenerateScene={openGenerateModal}
          onRegenerateScene={openRegenerateModal}
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
                openRegenerateModal(selectedScene.id);
              }
            }}
          />
        </div>
      </section>

      <VideoDurationModal
        key={
          durationModal
            ? `${durationModal.mode}-${durationModal.sceneId}-${modalScene?.latestDuration ?? 3}`
            : "video-duration-modal"
        }
        open={durationModal !== null && modalScene !== null}
        sceneNumber={modalSceneNumber}
        sceneTitle={modalScene?.title ?? ""}
        defaultDuration={
          modalScene?.latestDuration === 3 ||
          modalScene?.latestDuration === 4 ||
          modalScene?.latestDuration === 5
            ? modalScene.latestDuration
            : 3
        }
        submitting={
          modalScene?.id !== undefined && submittingSceneId === modalScene.id
        }
        onClose={() => setDurationModal(null)}
        onConfirm={async (duration) => {
          if (!durationModal) return;

          if (durationModal.mode === "generate") {
            await handleGenerateScene({
              sceneId: durationModal.sceneId,
              duration,
            });
          } else {
            await handleRegenerateScene({
              sceneId: durationModal.sceneId,
              duration,
            });
          }

          setDurationModal(null);
        }}
      />
    </>
  );
}
