import SceneLabel from "../cut/SceneLabel";

type SceneImagePreviewProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
};

export default function SceneImagePreview({
  sceneNumber,
  title,
  imageSrc,
}: SceneImagePreviewProps) {
  return (
    <section className="self-start w-full rounded-[8px] bg-gray-900 p-6">
      <div className="mb-6 flex items-center gap-4">
        <SceneLabel sceneNumber={sceneNumber} selected />
        <div className="text-[25px] font-bold text-white">{title}</div>
      </div>

      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={`${title} 대표 이미지`}
          className="block h-auto w-full rounded-[8px] object-cover"
        />
      </div>
    </section>
  );
}
