import DownloadIcon from "../../assets/icons/download_purple.svg";
import SceneLabel from "../cut/SceneLabel";

type ImageEditCanvasProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  onDownload?: () => void;
  onImageChange?: (nextImageSrc: string) => void;
  onDirtyChange?: (isDirty: boolean) => void;
};

export default function ImageEditCanvas({
  sceneNumber,
  title,
  imageSrc,
  onDownload,
}: ImageEditCanvasProps) {
  return (
    <section className="w-full rounded-[8px] bg-black px-4">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SceneLabel sceneNumber={sceneNumber} selected />
          <div className="text-[24px] font-bold text-white">{title}</div>
        </div>

        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-[8px] border border-[#5C4DFF] px-5 py-2.5 text-[14px] font-semibold text-[#7B6CFF] transition hover:bg-[rgba(92,77,255,0.08)]"
        >
          <img src={DownloadIcon} alt="" className="h-4 w-4 object-contain" />
          다운로드
        </button>
      </div>

      <div className="rounded-[8px] bg-[#111111] p-3">
        <img
          src={imageSrc}
          alt={`${title} 이미지`}
          className="w-full rounded-[8px] object-contain"
        />
      </div>
    </section>
  );
}
