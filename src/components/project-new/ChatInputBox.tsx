import { useState } from "react";
import ChatIcon from "../../assets/icons/chat_purple.svg";

type ChatInputBoxProps = {
  placeholder?: string;
  onSend?: (message: string) => void;
};

export default function ChatInputBox({
  placeholder = "아이디어를 자유롭게 말해주세요.",
  onSend,
}: ChatInputBoxProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSend?.(trimmedMessage);
    setMessage("");
  };

  return (
    <div className="rounded-[10px] border border-[rgba(255,255,255,0.24)] bg-transparent px-5 py-5">
      <div className="flex min-h-[112px] items-end justify-between gap-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="h-[120px] w-full resize-none bg-transparent text-[18px] leading-[1.5] text-white placeholder:text-[rgba(255,255,255,0.35)] outline-none"
        />

        <button
          type="button"
          onClick={handleSend}
          className="flex shrink-0 active:scale-[0.98]"
          aria-label="메시지 전송"
        >
          <img src={ChatIcon} alt="" className="h-10 w-10 object-contain" />
        </button>
      </div>
    </div>
  );
}
