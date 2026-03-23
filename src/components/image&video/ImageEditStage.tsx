import ImageEditCanvas from "./ImageEditCanvas";
import AiChatBox from "../project-new/AiChatBox";
import { useEffect, useState } from "react";
import { editSceneImageWithAi } from "../../api/imageApi";
import { getSceneImages } from "../../api/sceneApi";
import type { SceneImageItem } from "../../types/scene";

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
  const [images, setImages] = useState<SceneImageItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState(imageId);
  const [editedImageSrc, setEditedImageSrc] = useState(imageSrc);
  const [isDirty, setIsDirty] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [isAiSubmitting, setIsAiSubmitting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  useEffect(() => {
    getSceneImages({ projectId, sceneId })
      .then((res) => setImages(res.data))
      .catch(console.error);
  }, [projectId, sceneId]);

  const refreshImages = async () => {
    const res = await getSceneImages({ projectId, sceneId });
    setImages(res.data);
  };

  const handleSelectImage = (image: SceneImageItem) => {
    const src = image.editedImageUrl || image.imageUrl;
    setSelectedImageId(image.id);
    setEditedImageSrc(src);
    setCanvasKey((k) => k + 1);
    setIsDirty(false);
  };

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
    setPendingMessage(userEditText);
    setIsAiSubmitting(true);
    try {
      const response = await editSceneImageWithAi({
        projectId,
        sceneId,
        imageId: selectedImageId,
        userEditText,
      });

      const { editedImageUrl, id } = response.data;
      if (editedImageUrl) {
        setEditedImageSrc(editedImageUrl);
        setCanvasKey((k) => k + 1);
      }
      setSelectedImageId(id);
      await refreshImages();
    } finally {
      setPendingMessage(null);
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
          images={images}
          selectedImageId={selectedImageId}
          onSelectImage={handleSelectImage}
          pendingMessage={pendingMessage}
          isSubmitting={isAiSubmitting}
          onSendMessage={handleAiEditRequest}
        />
      </div>
    </section>
  );
}
