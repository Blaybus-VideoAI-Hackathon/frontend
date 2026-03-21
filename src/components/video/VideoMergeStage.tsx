import { useState } from "react";
import axios from "axios";
import SceneCard from "../ui/SceneCard";
import type { SelectOption } from "../ui/DropdownSelect";
// ──────────────────────────────────────────
// 전환 효과 옵션
// ──────────────────────────────────────────
const TRANSITION_OPTIONS: SelectOption[] = [
  { value: "cut", label: "Cut" },
  { value: "cross-dissolve", label: "Cross dissolve" },
  { value: "fade", label: "Fade" },
  { value: "wipe", label: "Wipe" },
  { value: "zoom", label: "Zoom" },
  { value: "slide", label: "Slide" },
];

// ──────────────────────────────────────────
// 씬 데이터 (예시)
// ──────────────────────────────────────────
const INITIAL_SCENES = [
  { number: 1, title: "두 캐릭터 대치", duration: 3.5 },
  { number: 2, title: "아카이누 공격", duration: 4 },
  { number: 3, title: "샹크스 방어", duration: 5 },
  { number: 4, title: "격돌", duration: 5 },
  { number: 5, title: "전쟁충격파", duration: 4 },
];

// ──────────────────────────────────────────
// SceneConnector: 씬 사이 + 연결 아이콘
// ──────────────────────────────────────────
function SceneConnector() {
  return (
    <div className="flex items-center justify-center py-1">
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#1e1e1e]">
        <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
          <path
            d="M6 2v8M2 6h8"
            stroke="#555"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────
// VideoMergeStage
// ──────────────────────────────────────────
export default function VideoMergeStage({ projectId }: { projectId: number }) {
  const [transitions, setTransitions] = useState<Record<number, string>>({
    1: "cut",
    2: "cross-dissolve",
  });
  const [isMerging, setIsMerging] = useState(false);
  const handleTransitionChange = (sceneNumber: number, value: string) => {
    setTransitions((prev) => ({ ...prev, [sceneNumber]: value }));
  };

  const handleMerge = async () => {
    if (isMerging) return;
    setIsMerging(true);
    try {
      await axios.post(
        `https://hdb-backend.onrender.com/api/projects/${projectId}/videos/merge`,
        { skipMissingVideos: false, outputFormat: "mp4", outputQuality: 720 },
        {},
      );
    } finally {
      setIsMerging(false);
    }
  };

  const totalDuration = INITIAL_SCENES.reduce((sum, s) => sum + s.duration, 0);

  return (
    <section className="flex gap-4 rounded-2xl bg-[#17181C] p-6">
      {/* ── 왼쪽: 영상 미리보기 영역 ── */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* 영상 플레이어 */}
        <div className="relative w-full overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "16/9" }}>
          {/* 플레이어 컨트롤 */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-linear-to-t from-black/80 to-transparent px-4 py-3">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
                <path d="M6 3.5v9L13 8 6 3.5z" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="h-1 w-full rounded-full bg-white/20">
                <div className="h-full w-0 rounded-full bg-[#7c6af7]" />
              </div>
            </div>
            <span className="text-xs text-white/60">0:00 / 0:02</span>
          </div>
        </div>

        {/* Scene 01 스토리 흐름 */}
        <div className="rounded-xl border border-[#2a2a2a] bg-[#161616] px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                <rect x="1" y="1" width="14" height="14" rx="2" fill="#7c6af7" opacity="0.3" stroke="#7c6af7" strokeWidth="1.2" />
                <path d="M4 5h8M4 8h5" stroke="#a695ff" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-semibold text-white">Scene 01 스토리 흐름</span>
            </div>
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
              <path d="M4 6l4 4 4-4" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 오른쪽: 컷 구성(스토리 흐름) 패널 ── */}
      <div
        className="flex w-65 shrink-0 flex-col gap-0 rounded-xl border border-[#2a2a2a] bg-[#161616] p-4"
      >
        {/* 패널 헤더 */}
        <h3 className="mb-3 text-sm font-semibold text-white">
          컷 구성(스토리 흐름)
        </h3>

        {/* 씬 리스트 + 연결자 */}
        <div className="flex flex-col">
          {INITIAL_SCENES.map((scene, index) => (
            <div key={scene.number}>
              <SceneCard
                sceneNumber={scene.number}
                title={scene.title}
                duration={scene.duration}
                transitionValue={transitions[scene.number]}
                onTransitionChange={(val) =>
                  handleTransitionChange(scene.number, val)
                }
                transitionOptions={TRANSITION_OPTIONS}
              />
              {index < INITIAL_SCENES.length - 1 && <SceneConnector />}
            </div>
          ))}
        </div>

        {/* 영상 병합 버튼 */}
        <button
          type="button"
          onClick={handleMerge}
          disabled={isMerging}
          className="mt-4 w-full rounded-xl bg-[#7c6af7] py-3 text-sm font-bold text-white transition-colors hover:bg-[#6b5ce7] active:bg-[#5a4cd6] disabled:opacity-60"
        >
          {isMerging ? "병합 중..." : `${totalDuration}초 영상 병합`}
        </button>
      </div>
    </section>
  );
}
