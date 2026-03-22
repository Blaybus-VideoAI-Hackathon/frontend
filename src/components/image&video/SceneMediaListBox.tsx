import SceneMediaCard, { type SceneMediaStatus } from "./SceneMediaCard";

export type SceneMediaItem = {
  id: number;
  title: string;
  status: SceneMediaStatus;
  thumbnailSrc?: string;
  durationText?: string;
};

type SceneMediaListBoxProps = {
  items: SceneMediaItem[];
  selectedSceneId: number | null;
  mode: "image" | "video";

  onSelectScene: (sceneId: number) => void;
  onGenerateScene?: (sceneId: number) => void;
  onRegenerateScene?: (sceneId: number) => void;
  onEditScene?: (sceneId: number) => void;
};

export default function SceneMediaListBox({
  items,
  selectedSceneId,
  mode,
  onSelectScene,
  onGenerateScene,
  onRegenerateScene,
  onEditScene,
}: SceneMediaListBoxProps) {
  return (
    <section className="w-full rounded-[8px] bg-gray-900 p-5">
      <div className="mb-5 text-[18px] font-bold leading-none text-white">
        컷 구성 (스토리 흐름)
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <SceneMediaCard
            key={item.id}
            sceneNumber={index + 1}
            title={item.title}
            thumbnailSrc={item.thumbnailSrc}
            status={item.status}
            durationText={item.durationText}
            mode={mode}
            selected={item.id === selectedSceneId}
            onClick={() => onSelectScene(item.id)}
            onGenerate={() => onGenerateScene?.(item.id)}
            onRegenerate={() => onRegenerateScene?.(item.id)}
            onEdit={() => onEditScene?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
}
