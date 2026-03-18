import { useMemo, useState } from "react";
import SceneImageListBox, { type SceneImageItem } from "./SceneImageListBox";
import ExampleSrc from "../../assets/example.png";
import SceneImagePreview from "./SceneImagePreview";

const initialSceneImages: SceneImageItem[] = [
  {
    id: 1,
    title: "두 캐릭터 대치",
    status: "done",
    imageSrc: ExampleSrc,
  },
  {
    id: 2,
    title: "아카이누 공격",
    status: "generating",
    imageSrc: ExampleSrc,
  },
  {
    id: 3,
    title: "상크스 방어",
    status: "generating",
    imageSrc: ExampleSrc,
  },
  {
    id: 4,
    title: "격돌",
    status: "generating",
    imageSrc: ExampleSrc,
  },
  {
    id: 5,
    title: "전장충격파",
    status: "generating",
    imageSrc: ExampleSrc,
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
    useState<SceneImageItem[]>(initialSceneImages);
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

    if (!targetScene) return;

    onEnterEditMode?.({
      sceneNumber: targetIndex + 1,
      title: targetScene.title,
      imageSrc: targetScene.imageSrc,
    });
  };

  if (!selectedScene) return null;

  return (
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
      <SceneImageListBox
        items={sceneImages}
        selectedSceneId={selectedSceneId}
        onSelectScene={setSelectedSceneId}
        onRegenerateScene={handleRegenerateScene}
        onEditScene={handleEditScene}
      />

      <SceneImagePreview
        sceneNumber={selectedSceneNumber}
        title={selectedScene.title}
        imageSrc={selectedScene.imageSrc}
      />
    </section>
  );
}
