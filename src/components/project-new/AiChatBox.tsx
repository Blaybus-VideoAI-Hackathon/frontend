import { useState } from "react";
import ChatInputBox from "./ChatInputBox";

type AiChatMessage = {
  id: number;
  text: string;
};

type AiChatBoxProps = {
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

export default function AiChatBox({
  disabled = false,
  isSubmitting = false,
  onSendMessage,
}: AiChatBoxProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);

  const handleSendMessage = async (message: string) => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled || isSubmitting) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmedMessage,
      },
    ]);

    try {
      await onSendMessage?.(trimmedMessage);
    } catch (error) {
      console.error("AI 수정 요청 실패:", error);
    }
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col rounded-[8px] bg-gray-900 p-6">
      <div className="mb-8 text-gray-100 text-[18px] font-bold">
        AI 수정하기
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {messages?.map((message) => (
          <UserRequestBubble key={message.id} text={message.text} />
        ))}
      </div>

      <div className="mt-4 text-[13px] text-[rgba(255,255,255,0.48)]">
        {disabled
          ? "선택된 컷씬이 없습니다."
          : isSubmitting
            ? "선택한 컷씬 정보를 AI가 다시 구성하고 있습니다..."
            : ""}
      </div>

      <div className="mt-8">
        <ChatInputBox onSend={handleSendMessage} />
      </div>
    </section>
  );
}
