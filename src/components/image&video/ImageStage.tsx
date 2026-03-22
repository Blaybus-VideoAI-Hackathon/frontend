import SceneMediaListBox from "./SceneMediaListBox";
import SceneMediaPreview from "./SceneMediaPreview";
import { useImageScenes } from "../../hooks/useImageScenes";

type ImageStageProps = {
  projectId: number;
  onEnterEditMode?: (scene: {
    sceneNumber: number;
    title: string;
    imageSrc: string;
    sceneId: number;
    imageId: number;
  }) => void;
};

function LoadingPanel() {
  return (
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
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
        <div className="flex h-[620px] items-center justify-center text-[18px] text-[rgba(255,255,255,0.72)]">
          이미지 목록을 불러오는 중입니다...
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

export default function ImageStage({
  projectId,
  onEnterEditMode,
}: ImageStageProps) {
  const {
    items,
    selectedScene,
    selectedSceneId,
    selectedSceneNumber,
    loading,
    error,
    initialize,
    setSelectedSceneId,
  } = useImageScenes({
    projectId,
  });

  const handleEditScene = (sceneId: number) => {
    const targetIndex = items.findIndex((scene) => scene.id === sceneId);
    const targetScene = items[targetIndex];

    if (
      !targetScene ||
      !targetScene.thumbnailSrc ||
      targetScene.status !== "done"
    ) {
      return;
    }

    if (!targetScene.latestImageId) return;

    onEnterEditMode?.({
      sceneNumber: targetIndex + 1,
      title: targetScene.title,
      imageSrc: targetScene.thumbnailSrc,
      sceneId: targetScene.id,
      imageId: targetScene.latestImageId,
    });
  };

  if (loading && items.length === 0) {
    return <LoadingPanel />;
  }

  if (error && items.length === 0) {
    return <ErrorPanel message={error} onRetry={() => void initialize()} />;
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
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        {error && (
          <div className="rounded-[8px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
            {error}
          </div>
        )}

        <SceneMediaListBox
          items={items}
          selectedSceneId={selectedSceneId}
          mode="image"
          onSelectScene={(sceneId) => {
            const target = items.find((item) => item.id === sceneId);
            if (!target) return;

            if (
              target.status === "done" ||
              target.status === "generating" ||
              target.status === "failed"
            ) {
              setSelectedSceneId(sceneId);
            }
          }}
          onEditScene={handleEditScene}
        />
      </div>

      <SceneMediaPreview
        sceneNumber={selectedSceneNumber}
        title={selectedScene.title}
        mode="image"
        status={selectedScene.status}
        src={selectedScene.thumbnailSrc}
        onAction={() => handleEditScene(selectedScene.id)}
      />
    </section>
  );
}
