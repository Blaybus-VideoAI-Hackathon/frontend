import { useMemo, useState } from "react";
import ExampleSrc from "../../assets/example.png";
import type { SceneMediaItem } from "./SceneMediaListBox";
import SceneMediaListBox from "./SceneMediaListBox";
import SceneMediaPreview from "./SceneMediaPreview";

const initialSceneImages: SceneMediaItem[] = [
  {
    id: 1,
    title: "두 캐릭터 대치",
    status: "done",
    thumbnailSrc: ExampleSrc,
  },
  {
    id: 2,
    title: "아카이누 공격",
    status: "generating",
    thumbnailSrc: ExampleSrc,
  },
  {
    id: 3,
    title: "상크스 방어",
    status: "generating",
    thumbnailSrc: ExampleSrc,
  },
  {
    id: 4,
    title: "격돌",
    status: "generating",
    thumbnailSrc: ExampleSrc,
  },
  {
    id: 5,
    title: "전장충격파",
    status: "generating",
    thumbnailSrc: ExampleSrc,
  },
];

type ImageStageProps = {
  onEnterEditMode?: (scene: {
    sceneNumber: number;
    title: string;
    imageSrc: string;
  }) => void;
};

export default function ImageStage({ onEnterEditMode }: ImageStageProps) {
  const [sceneImages, setSceneImages] =
    useState<SceneMediaItem[]>(initialSceneImages);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(
    initialSceneImages[0]?.id ?? 1,
  );

  const selectedScene = useMemo(() => {
    return (
      sceneImages.find((scene) => scene.id === selectedSceneId) ??
      sceneImages[0]
    );
  }, [sceneImages, selectedSceneId]);

  const selectedSceneNumber = useMemo(() => {
    return sceneImages.findIndex((scene) => scene.id === selectedSceneId) + 1;
  }, [sceneImages, selectedSceneId]);

  const handleRegenerateScene = (sceneId: number) => {
    console.log("이미지 재생성:", sceneId);

    setSceneImages((prev) =>
      prev.map((scene) =>
        scene.id === sceneId ? { ...scene, status: "generating" } : scene,
      ),
    );
  };

  const handleEditScene = (sceneId: number) => {
    const targetIndex = sceneImages.findIndex((scene) => scene.id === sceneId);
    const targetScene = sceneImages[targetIndex];

    if (!targetScene || !targetScene.thumbnailSrc) return;

    onEnterEditMode?.({
      sceneNumber: targetIndex + 1,
      title: targetScene.title,
      imageSrc: targetScene.thumbnailSrc,
    });
  };

  if (!selectedScene || !selectedScene.thumbnailSrc) return null;

  return (
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
      <SceneMediaListBox
        items={sceneImages}
        selectedSceneId={selectedSceneId}
        mode="image"
        onSelectScene={setSelectedSceneId}
        onRegenerateScene={handleRegenerateScene}
        onEditScene={handleEditScene}
      />

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
