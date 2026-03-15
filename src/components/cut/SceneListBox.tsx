import { useState } from "react";
import SceneTitleButton from "./SceneTitleButton";
import AddSceneButton from "./AddSceneButton";

type SceneItem = {
  id: number;
  title: string;
};

const initialScenes: SceneItem[] = [
  { id: 1, title: "두 캐릭터 대치" },
  { id: 2, title: "아카이누 공격" },
  { id: 3, title: "상크스 방어" },
  { id: 4, title: "격돌" },
  { id: 5, title: "전장 충격파" },
];

export default function SceneListBox() {
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);
  const [scenes, setScenes] = useState<SceneItem[]>(initialScenes);

  const handleRemoveScene = (id: number) => {
    const updatedScenes = scenes.filter((scene) => scene.id !== id);
    setScenes(updatedScenes);

    if (selectedSceneId === id) {
      setSelectedSceneId(updatedScenes.length > 0 ? updatedScenes[0].id : 0);
    }
  };

  return (
    <section className="w-full min-h-[760px] rounded-[8px] bg-gray-900 px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="mb-6 text-gray-100 text-[18px] font-bold">
        컷 구성 (스토리 흐름)
      </div>

      <div className="space-y-3">
        {scenes.map((scene, index) => {
          const sceneNumber = index + 1;
          const isSelected = scene.id === selectedSceneId;

          return (
            <SceneTitleButton
              key={scene.id}
              sceneNumber={sceneNumber}
              title={scene.title}
              selected={isSelected}
              onClick={() => setSelectedSceneId(scene.id)}
              onRemove={() => handleRemoveScene(scene.id)}
            />
          );
        })}

        <AddSceneButton />
      </div>
    </section>
  );
}
