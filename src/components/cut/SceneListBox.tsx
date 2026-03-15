import SceneTitleButton from "./SceneTitleButton";
import AddSceneButton from "./AddSceneButton";

export type SceneDetailItem = {
  label: string;
  value: string;
};

export type SceneItem = {
  id: number;
  title: string;
  details: SceneDetailItem[];
};

type SceneListBoxProps = {
  scenes: SceneItem[];
  selectedSceneId: number;
  onSelectScene: (sceneId: number) => void;
  onRemoveScene?: (sceneId: number) => void;
  onAddScene?: () => void;
};

export default function SceneListBox({
  scenes,
  selectedSceneId,
  onSelectScene,
  onRemoveScene,
  onAddScene,
}: SceneListBoxProps) {
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
              onClick={() => onSelectScene(scene.id)}
              onRemove={() => onRemoveScene?.(scene.id)}
            />
          );
        })}

        <AddSceneButton onClick={onAddScene} />
      </div>
    </section>
  );
}
