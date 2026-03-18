import { useState } from "react";
import Button from "../components/ui/Button";

export default function VideoCompletePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyOpen, setStoryOpen] = useState(true);

  const storyText =
    "황소만한 전마의 발자국 소리가 귀를 가득 채우는 가운데, 전쟁의 흔적을 이비밖 스나미의 다가오고 있었다. 냉혹한 진영공의 눈빛이 창두는 가득에 빛에 해처럼 상교소소 초원의 한가락에서 사 있고, 그 밖에는해는 거대한 희잡들을 훑기이며 마이하는 긴 전향의 전이라 나를 지 사람/ 사이에서는 높지작! 들지작? 성이다는나이나 산전인 의 오고, 그 담처 삶으로, 전혀 창자들이 간절의 끊으라 그의 이기를 기어이며 표면이 고걸 성공스를 불에 취기라고, 그 소현 이르오는 끊으들이 복도으로 몰를 들이 들을 걸었을 막이다는, 마그리마 태기의 인이 창전으로 흩은좌며 높다낮 복잡 좌피의 기세가 취히들을 이른다고, 전경의 마기 육의 직면 한을가서야 마유가 두 잡지 없이 이렇이하는 누른들이 두 개의 한 충동을 불속의 아오란 증류를 용이는 한다.";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-10">
      {/* 제목 */}
      <h1 className="text-white text-2xl font-bold mb-2 text-center">
        🔥 드디어 당신만의 이야기가 완성되었어요 🔥
      </h1>
      <p className="text-gray-400 text-sm mb-8 text-center">
        삼성하던 장면이 하나의 영상으로 탄생했습니다. 완성된 결과를 감상하고 공유해 보세요.
      </p>

      {/* 비디오 플레이어 */}
      <div className="relative w-full max-w-2xl aspect-video bg-gray-700 rounded-lg overflow-hidden mb-6 grayscale">
        {/* 회색 이미지 영역 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && (
            <button
              onClick={() => setIsPlaying(true)}
              className="w-16 h-16 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
          )}
        </div>
        {/* 타임스탬프 */}
        <div className="absolute bottom-3 right-3 text-white text-xs bg-black/50 px-1.5 py-0.5 rounded">
          0:03
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        <Button variant="secondary" size="md" className="gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          영상 다운로드(mp4)
        </Button>
        <Button variant="secondary" size="md" className="gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          영상 공유하기
        </Button>
        <Button variant="ghost" size="md" className="gap-2 text-gray-300 hover:bg-gray-800">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          새로운 영상 만들기
        </Button>
      </div>

      {/* 스토리 라인 섹션 */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg overflow-hidden">
        <button
          onClick={() => setStoryOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-4 text-white font-semibold hover:bg-gray-800 transition-colors"
        >
          <span>스토리 라인</span>
          {storyOpen ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>
        {storyOpen && (
          <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
            {storyText}
          </div>
        )}
      </div>
    </div>
  );
}
