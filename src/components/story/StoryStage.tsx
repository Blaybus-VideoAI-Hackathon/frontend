import { useState, useRef, type ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function StoryStage({ onSuccess }: { onSuccess?: () => void }) {
  const { projectId } = useParams<{ projectId: string }>();
  const [idea, setIdea] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = async () => {
    if (!idea.trim() || isLoading) return;
    setIsLoading(true);
    try {
      await axios.post(
        `https://hdb-backend.onrender.com/api/projects/${projectId}/plans`,
        { userPrompt: idea },
        {},
      );
      onSuccess?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <section className="flex flex-1 flex-col items-center rounded-2xl bg-[#17181C] px-6 py-10">
      {/* Headline */}
      <h1 className="mb-2.5 text-center text-[28px] font-bold tracking-tight text-white!">
        당신의 이야기를 들려주세요.
      </h1>
      <p className="mb-8 text-center text-sm leading-relaxed text-gray-500">
        떠오르는 작은 아이디어 하나만으로도 새로운 이야기가 시작됩니다. 어떤
        장면을 만들고 어떤 세계를 펼칠지, 지금 상상의 문을 열어보세요.
      </p>

      {/* Image Upload Card */}
      <div className="mb-4 flex w-full flex-1 items-center justify-center rounded-2xl border border-white/6 bg-[#161618] px-6 py-9">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex h-44 w-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-dashed border-white/12 bg-[#1e1e21] transition-colors hover:border-indigo-500/50"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          )}
        </div>

        {!previewUrl && (
          <div className="ml-7 flex flex-col items-start gap-3.5">
            <p className="text-sm text-gray-400">이미지 업로드</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-transparent px-4.5 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Idea Textarea */}
      <div className="relative w-full rounded-2xl border border-white/6 bg-[#161618] px-5 pb-4 pt-5">
        <textarea
          value={idea}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setIdea(e.target.value)
          }
          placeholder="아이디어를 자유롭게 말해주세요."
          className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#e8e8e8] outline-none placeholder:text-gray-600"
          style={{ minHeight: 140 }}
        />
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!idea.trim() || isLoading}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
            style={{
              background: idea.trim() ? "#6366f1" : "#2a2a2e",
              cursor: idea.trim() ? "pointer" : "default",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 5 5 12" />
            </svg>
          </button>
        </div>
      </div>

    </section>
  );
}
