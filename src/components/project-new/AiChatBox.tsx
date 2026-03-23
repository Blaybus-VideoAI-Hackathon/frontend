import { useEffect, useRef } from "react";
import ChatInputBox from "./ChatInputBox";
import type { SceneImageItem } from "../../types/scene";

type AiChatBoxProps = {
  images?: SceneImageItem[];
  selectedImageId?: number;
  onSelectImage?: (image: SceneImageItem) => void;
  pendingMessage?: string | null;
  disabled?: boolean;
  isSubmitting?: boolean;
  onSendMessage?: (message: string) => Promise<void> | void;
};

function UserRequestBubble({ text }: { text: string }) {
  return (
    <div className="w-full rounded-[24px] rounded-br-[0px] border border-[#5C4DFF] bg-[rgba(92,77,255,0.42)] px-6 py-5">
      <p className="text-[15px] font-semibold leading-[1.4] text-white">
        {text}
      </p>
    </div>
  );
}

function ImageHistoryCard({
  image,
  isSelected,
  onSelect,
}: {
  image: SceneImageItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const src = image.editedImageUrl || image.imageUrl;
  const label =
    image.imageNumber === 1
      ? "원본 이미지"
      : `수정 이미지 ${image.imageNumber - 1}`;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full overflow-hidden rounded-xl border-2 text-left transition ${
        isSelected
          ? "border-[#5C4DFF]"
          : "border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.3)]"
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={label}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-[rgba(255,255,255,0.06)] text-[13px] text-[rgba(255,255,255,0.36)]">
          이미지 없음
        </div>
      )}
      <div
        className={`px-3 py-2 text-[13px] font-medium ${
          isSelected ? "text-[#A89CFF]" : "text-[rgba(255,255,255,0.56)]"
        }`}
      >
        {label}
      </div>
    </button>
  );
}

export default function AiChatBox({
  images = [],
  selectedImageId,
  onSelectImage,
  pendingMessage,
  disabled = false,
  isSubmitting = false,
  onSendMessage,
}: AiChatBoxProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [images.length, pendingMessage]);

  const handleSendMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || disabled || isSubmitting) return;
    await onSendMessage?.(trimmed);
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col rounded-[8px] bg-gray-900 p-6">
      <div className="mb-8 text-[18px] font-bold text-gray-100">
        AI 수정하기
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">
        {images.map((image) => (
          <div key={image.id} className="flex flex-col gap-4">
            {image.imageNumber > 1 && image.imagePrompt && (
              <UserRequestBubble text={image.imagePrompt} />
            )}
            <ImageHistoryCard
              image={image}
              isSelected={image.id === selectedImageId}
              onSelect={() => onSelectImage?.(image)}
            />
          </div>
        ))}

        {pendingMessage && (
          <UserRequestBubble text={pendingMessage} />
        )}

        {isSubmitting && (
          <div className="flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.48)]">
            <span className="animate-pulse">AI가 이미지를 수정하고 있습니다...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="mt-4 text-[13px] text-[rgba(255,255,255,0.48)]">
        {disabled ? "선택된 컷씬이 없습니다." : ""}
      </div>

      <div className="mt-3">
        <ChatInputBox onSend={handleSendMessage} />
      </div>
    </section>
  );
}
