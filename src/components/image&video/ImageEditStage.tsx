import ImageEditCanvas from "./ImageEditCanvas";
import AiChatBox from "../project-new/AiChatBox";
import { useState } from "react";
import { editSceneImageWithAi } from "../../api/imageApi";

type ImageEditStageProps = {
  projectId: number;
  sceneId: number;
  imageId: number;
  sceneNumber: number;
  title: string;
  imageSrc: string;
  onCancelEdit?: () => void;
  onCompleteEdit?: () => void;
};

export default function ImageEditStage({
  projectId,
  sceneId,
  imageId,
  sceneNumber,
  title,
  imageSrc,
  onCancelEdit,
  onCompleteEdit,
}: ImageEditStageProps) {
  const [editedImageSrc, setEditedImageSrc] = useState(imageSrc);
  const [isDirty, setIsDirty] = useState(false);
  // key를 바꾸면 ImageEditCanvas가 remount되어 상태 초기화
  const [canvasKey, setCanvasKey] = useState(0);
  const [currentImageId, setCurrentImageId] = useState(imageId);
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);

  const handleCancelEdit = () => {
    setEditedImageSrc(imageSrc);
    setIsDirty(false);
    setCanvasKey((k) => k + 1);
    onCancelEdit?.();
  };

  const handleCompleteEdit = () => {
    onCompleteEdit?.();
  };

  const handleAiEditRequest = async (userEditText: string) => {
    setIsAiSubmitting(true);
    try {
      const response = await editSceneImageWithAi({
        projectId,
        sceneId,
        imageId: currentImageId,
        userEditText,
      });

      const { editedImageUrl, id } = response.data;
      if (editedImageUrl) {
        setEditedImageSrc(editedImageUrl);
        setCanvasKey((k) => k + 1);
      }
      setCurrentImageId(id);
    } finally {
      setIsAiSubmitting(false);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_480px]">
      <div className="flex min-w-0 flex-col">
        <ImageEditCanvas
          key={canvasKey}
          sceneNumber={sceneNumber}
          title={title}
          imageSrc={editedImageSrc}
          onImageChange={setEditedImageSrc}
          onDirtyChange={setIsDirty}
          onDownload={() => {
            console.log("이미지 다운로드");
          }}
        />

        <div className="mt-5 mr-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancelEdit}
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
            onClick={handleCompleteEdit}
            className="rounded-[8px] bg-[#5C4DFF] px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-[#4f41ee]"
          >
            수정 완료
          </button>
        </div>
      </div>

      <div className="min-w-0">
        <AiChatBox
          isSubmitting={isAiSubmitting}
          onSendMessage={handleAiEditRequest}
        />
      </div>
    </section>
  );
}
