import { useMemo, useState } from "react";
import SceneMediaListBox, { type SceneMediaItem } from "./SceneMediaListBox";
import SceneMediaPreview from "./SceneMediaPreview";
import ExampleSrc from "../../assets/example.png";

const initialSceneVideos: SceneMediaItem[] = [
  {
    id: 1,
    title: "두 캐릭터 대치",
    status: "done",
    thumbnailSrc: ExampleSrc,
    durationText: "0:03",
  },
  {
    id: 2,
    title: "아카이누 공격",
    status: "generating",
  },
  {
    id: 3,
    title: "상크스 방어",
    status: "idle",
  },
  {
    id: 4,
    title: "격돌",
    status: "locked",
  },
  {
    id: 5,
    title: "전장충격파",
    status: "locked",
  },
];

export default function VideoStage() {
  const [sceneVideos, setSceneVideos] =
    useState<SceneMediaItem[]>(initialSceneVideos);

  const initialPreviewId =
    initialSceneVideos.find(
      (scene) => scene.status === "done" || scene.status === "generating",
    )?.id ??
    initialSceneVideos[0]?.id ??
    1;

  const [selectedSceneId, setSelectedSceneId] =
    useState<number>(initialPreviewId);

  const selectedScene = useMemo(() => {
    return (
      sceneVideos.find((scene) => scene.id === selectedSceneId) ??
      sceneVideos[0]
    );
  }, [sceneVideos, selectedSceneId]);

  const selectedSceneNumber = useMemo(() => {
    return sceneVideos.findIndex((scene) => scene.id === selectedSceneId) + 1;
  }, [sceneVideos, selectedSceneId]);

  const handleSelectScene = (sceneId: number) => {
    const target = sceneVideos.find((scene) => scene.id === sceneId);
    if (!target) return;

    if (target.status === "done" || target.status === "generating") {
      setSelectedSceneId(sceneId);
    }
  };

  const handleGenerateScene = (sceneId: number) => {
    setSceneVideos((prev) =>
      prev.map((scene) =>
        scene.id === sceneId ? { ...scene, status: "generating" } : scene,
      ),
    );

    setSelectedSceneId(sceneId);

    setTimeout(() => {
      setSceneVideos((prev) => {
        const currentIndex = prev.findIndex((scene) => scene.id === sceneId);

        return prev.map((scene, index) => {
          if (scene.id === sceneId) {
            return {
              ...scene,
              status: "done",
              thumbnailSrc: ExampleSrc,
              durationText: "0:03",
            };
          }

          if (index === currentIndex + 1 && scene.status === "locked") {
            return {
              ...scene,
              status: "idle",
            };
          }

          return scene;
        });
      });

      setSelectedSceneId(sceneId);
    }, 2000);
  };

  const handleRegenerateScene = (sceneId: number) => {
    setSceneVideos((prev) =>
      prev.map((scene) =>
        scene.id === sceneId ? { ...scene, status: "generating" } : scene,
      ),
    );

    setSelectedSceneId(sceneId);

    setTimeout(() => {
      setSceneVideos((prev) =>
        prev.map((scene) =>
          scene.id === sceneId
            ? {
                ...scene,
                status: "done",
                thumbnailSrc: ExampleSrc,
                durationText: "0:03",
              }
            : scene,
        ),
      );
    }, 2000);
  };

  if (!selectedScene) return null;

  return (
    <section className="grid items-start grid-cols-1 gap-4 md:grid-cols-[420px_minmax(0,1fr)]">
      <SceneMediaListBox
        items={sceneVideos}
        selectedSceneId={selectedSceneId}
        mode="video"
        onSelectScene={handleSelectScene}
        onGenerateScene={handleGenerateScene}
        onRegenerateScene={handleRegenerateScene}
      />

      <SceneMediaPreview
        sceneNumber={selectedSceneNumber}
        title={selectedScene.title}
        mode="video"
        status={selectedScene.status}
        src={selectedScene.thumbnailSrc}
        durationText={selectedScene.durationText}
        onAction={() => {
          if (selectedScene.status === "done") {
            handleRegenerateScene(selectedScene.id);
          }
        }}
      />
    </section>
  );
}
