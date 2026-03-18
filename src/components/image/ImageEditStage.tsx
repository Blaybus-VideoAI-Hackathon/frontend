import ImageEditCanvas from "./ImageEditCanvas";
import AiChatBox from "../project-new/AiChatBox";
import { useState } from "react";

type ImageEditStageProps = {
  sceneNumber: number;
  title: string;
  imageSrc: string;
  onCancelEdit?: () => void;
  onCompleteEdit?: () => void;
};

export default function ImageEditStage({
  sceneNumber,
  title,
  imageSrc,
  onCancelEdit,
  onCompleteEdit,
}: ImageEditStageProps) {
  const [editedImageSrc, setEditedImageSrc] = useState(imageSrc);
  const isDirty = false;

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_480px]">
      <div className="flex min-w-0 flex-col">
        <ImageEditCanvas
          sceneNumber={sceneNumber}
          title={title}
          imageSrc={editedImageSrc}
          onImageChange={setEditedImageSrc}
          onDownload={() => {
            console.log("이미지 다운로드");
          }}
        />

        <div className="mt-5 mr-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={!isDirty}
            className={`rounded-[8px] px-5 py-3 text-[14px] font-semibold transition ${
              isDirty
                ? "bg-[#4A4A4F] text-white hover:bg-[#5A5A61]"
                : "cursor-not-allowed bg-[#3A3A3D] text-[#8B8B92]"
            }`}
          >
            수정 취소
          </button>

          <button
            type="button"
            onClick={onCompleteEdit}
            className="rounded-[8px] bg-[#5C4DFF] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#4f41ee]"
          >
            수정 완료
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <AiChatBox />
      </div>
    </section>
  );
}
