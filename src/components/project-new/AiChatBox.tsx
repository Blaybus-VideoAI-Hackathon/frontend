import { useState } from "react";
import ChatInputBox from "./ChatInputBox";

type AiChatMessage = {
  id: number;
  text: string;
};

const initialMessages: AiChatMessage[] = [
  {
    id: 1,
    text: "조명을 다르게 바꿔줘",
  },
];

function UserRequestBubble({ text }: { text: string }) {
  return (
    <div className="w-full rounded-[24px] rounded-br-[0px] border border-[#5C4DFF] bg-[rgba(92,77,255,0.42)] px-6 py-5">
      <p className="text-[15px] font-semibold leading-[1.4] text-white">
        {text}
      </p>
    </div>
  );
}

export default function AiChatBox() {
  const [messages, setMessages] = useState<AiChatMessage[]>(initialMessages);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
      },
    ]);
  };

  return (
    <section className="flex h-full min-h-0 w-full flex-col rounded-[8px] bg-gray-900 p-6">
      <div className="mb-8 text-gray-100 text-[18px] font-bold">
        AI 수정하기
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {messages.map((message) => (
          <UserRequestBubble key={message.id} text={message.text} />
        ))}
      </div>

      <div className="mt-8">
        <ChatInputBox onSend={handleSendMessage} />
      </div>
    </section>
  );
}
