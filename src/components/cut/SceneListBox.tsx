import type { CutScene } from "../../hooks/useCutScenes";
import SceneTitleButton from "./SceneTitleButton";

type SceneListBoxProps = {
  scenes: CutScene[];
  selectedSceneId: number;
  onSelectScene: (sceneId: number) => void;
  onRemoveScene?: (sceneId: number) => void;
  removeDisabled?: boolean;
};

export default function SceneListBox({
  scenes,
  selectedSceneId,
  onSelectScene,
  onRemoveScene,
  removeDisabled = false,
}: SceneListBoxProps) {
  return (
    <section className="h-full w-full rounded-[8px] bg-gray-900 px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="mb-6 text-[18px] font-bold text-gray-100">
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
              onClick={() => onSelectScene(scene.id)}
              onRemove={
                onRemoveScene && !removeDisabled
                  ? () => onRemoveScene(scene.id)
                  : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}
