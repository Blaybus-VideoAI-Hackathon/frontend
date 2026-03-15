import SceneImageCard from "./SceneImageCard";

export type SceneImageItem = {
  id: number;
  title: string;
  status: "generating" | "done";
  imageSrc: string;
};

type SceneImageListBoxProps = {
  items: SceneImageItem[];
  selectedSceneId: number;
  onSelectScene: (sceneId: number) => void;
  onRegenerateScene?: (sceneId: number) => void;
  onEditScene?: (sceneId: number) => void;
};

export default function SceneImageListBox({
  items,
  selectedSceneId,
  onSelectScene,
  onRegenerateScene,
  onEditScene,
}: SceneImageListBoxProps) {
  return (
    <section className="w-full rounded-[8px] bg-gray-900 px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="mb-5 text-[18px] font-bold leading-none text-white">
        컷 구성 (스토리 흐름)
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <SceneImageCard
            key={item.id}
            sceneNumber={index + 1}
            title={item.title}
            imageSrc={item.imageSrc}
            status={item.status}
            selected={item.id === selectedSceneId}
            onClick={() => onSelectScene(item.id)}
            onRegenerate={() => onRegenerateScene?.(item.id)}
            onEdit={() => onEditScene?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
