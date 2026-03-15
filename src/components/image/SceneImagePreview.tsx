import SceneLabel from "../cut/SceneLabel";

type SelectedSceneImagePreviewProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  onEdit?: () => void;
};

export default function SelectedSceneImagePreview({
  sceneNumber,
  title,
  imageSrc,
  onEdit,
}: SelectedSceneImagePreviewProps) {
  return (
    <section className="w-full rounded-[14px] bg-[#1B1B1F] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      <div className="mb-6 flex items-center gap-4">
        <SceneLabel sceneNumber={sceneNumber} selected />
        <h2 className="text-[20px] font-bold text-white md:text-[24px]">
          {title}
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[12px] bg-black/20">
        <img
          src={imageSrc}
          alt={`${title} 대표 이미지`}
          className="h-auto w-full rounded-[12px] object-cover"
        />

        <button
          type="button"
          onClick={onEdit}
          className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(20,20,24,0.85)] transition hover:bg-[rgba(35,35,40,0.95)]"
          aria-label="이미지 수정"
        ></button>
      </div>
    </section>
  );
}
