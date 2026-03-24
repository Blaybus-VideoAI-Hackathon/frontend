import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { mergeProjectVideos, getFinalVideo } from "../api/videoApi";

const POLLING_INTERVAL = 3000;
const MAX_POLLING_COUNT = 20;
const SCENE_VIDEO_DURATION = 5; // 현재 서버 스펙상 각 컷 영상 5초 고정

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainSeconds = safeSeconds % 60;
  return `${minutes}:${String(remainSeconds).padStart(2, "0")}`;
}

export default function VideoCompletePage() {
  const { projectId } = useParams<{ projectId: string }>();
  const numericProjectId = Number(projectId);
  const isValidProjectId =
    Number.isFinite(numericProjectId) && numericProjectId > 0;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [storyOpen, setStoryOpen] = useState(true);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentClipTime, setCurrentClipTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [status, setStatus] = useState<
    "merging" | "polling" | "done" | "error"
  >("merging");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoUrls = useMemo(() => {
    if (!finalVideoUrl) return [];
    return finalVideoUrl
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);
  }, [finalVideoUrl]);

  const currentVideoUrl = videoUrls[currentVideoIndex] ?? null;
  const totalDuration = videoUrls.length * SCENE_VIDEO_DURATION;
  const totalCurrentTime =
    currentVideoIndex * SCENE_VIDEO_DURATION + currentClipTime;
  const progressPercent =
    totalDuration > 0 ? (totalCurrentTime / totalDuration) * 100 : 0;

  useEffect(() => {
    if (!isValidProjectId) return;

    let cancelled = false;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    async function mergeAndFetch() {
      try {
        setErrorMessage(null);
        setFinalVideoUrl(null);
        setCurrentVideoIndex(0);
        setCurrentClipTime(0);
        setIsPlaying(true);

        setStatus("merging");
        await mergeProjectVideos(numericProjectId);

        setStatus("polling");

        for (let i = 0; i < MAX_POLLING_COUNT; i += 1) {
          if (cancelled) return;

          try {
            const finalRes = await getFinalVideo(numericProjectId);
            const url = finalRes.data?.finalVideoUrl;

            if (url) {
              setFinalVideoUrl(url);
              setCurrentVideoIndex(0);
              setCurrentClipTime(0);
              setIsPlaying(true);
              setStatus("done");
              return;
            }
          } catch (error) {
            console.error("최종 영상 조회 실패:", error);
          }

          await sleep(POLLING_INTERVAL);
        }

        if (!cancelled) {
          setErrorMessage(
            "최종 영상 생성이 지연되고 있습니다. 잠시 후 다시 확인해주세요.",
          );
          setStatus("error");
        }
      } catch (e: unknown) {
        const msg =
          e instanceof Error
            ? e.message
            : "최종 영상 생성 중 오류가 발생했습니다.";
        if (!cancelled) {
          setErrorMessage(msg);
          setStatus("error");
        }
      }
    }

    void mergeAndFetch();

    return () => {
      cancelled = true;
    };
  }, [isValidProjectId, numericProjectId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !currentVideoUrl) return;

    if (isPlaying) {
      void video.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [currentVideoUrl, isPlaying]);

  const handleTogglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await video.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("영상 재생 실패:", error);
    }
  };

  const handleEnded = () => {
    if (currentVideoIndex < videoUrls.length - 1) {
      setCurrentVideoIndex((prev) => prev + 1);
      setCurrentClipTime(0);
      return;
    }

    setIsPlaying(false);
    setCurrentClipTime(SCENE_VIDEO_DURATION);
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || videoUrls.length === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = rect.width > 0 ? clickX / rect.width : 0;
    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const targetTotalTime = totalDuration * clampedRatio;

    const targetIndex = Math.min(
      Math.floor(targetTotalTime / SCENE_VIDEO_DURATION),
      Math.max(videoUrls.length - 1, 0),
    );

    const targetClipTime = targetTotalTime - targetIndex * SCENE_VIDEO_DURATION;

    setCurrentVideoIndex(targetIndex);

    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = Math.min(
        targetClipTime,
        Math.max(SCENE_VIDEO_DURATION - 0.01, 0),
      );
      setCurrentClipTime(targetClipTime);

      if (isPlaying) {
        void video.play().catch(() => {
          setIsPlaying(false);
        });
      }
    });
  };

  const storyText =
    "황소만한 전마의 발자국 소리가 귀를 가득 채우는 가운데, 전쟁의 흔적을 이비밖 스나미의 다가오고 있었다. 냉혹한 진영공의 눈빛이 창두는 가득에 빛에 해처럼 상교소소 초원의 한가락에서 사 있고, 그 밖에는해는 거대한 희잡들을 훑기이며 마이하는 긴 전향의 전이라 나를 지 사람/ 사이에서는 높지작! 들지작? 성이다는나이나 산전인 의 오고, 그 담처 삶으로, 전혀 창자들이 간절의 끊으라 그의 이기를 기어이며 표면이 고걸 성공스를 불에 취기라고, 그 소현 이르오는 끊으들이 복도으로 몰를 들이 들을 걸었을 막이다는, 마그리마 태기의 인이 창전으로 흩은좌며 높다낮 복잡 좌피의 기세가 취히들을 이른다고, 전경의 마기 육의 직면 한을가서야 마유가 두 잡지 없이 이렇이하는 누른들이 두 개의 한 충동을 불속의 아오란 증류를 용이는 한다.";

  if (!isValidProjectId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <p className="text-red-400 text-sm text-center">
          유효하지 않은 프로젝트입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-white text-2xl font-bold mb-2 text-center">
        🔥 드디어 당신만의 이야기가 완성되었어요 🔥
      </h1>
      <p className="text-gray-400 text-sm text-center">
        당신이 만든 장면이 하나의 영상으로 탄생했습니다. 완성된 결과를 감상해
        보세요
      </p>

      <div className="relative w-full max-w-2xl aspect-video bg-gray-700 rounded-lg overflow-hidden mb-6 mt-5">
        {status === "merging" || status === "polling" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <svg
              className="w-10 h-10 text-white animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-white text-sm">
              {status === "merging"
                ? "영상 병합 중..."
                : "최종 영상 불러오는 중..."}
            </p>
          </div>
        ) : status === "error" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-400 text-sm text-center px-4">
              {errorMessage}
            </p>
          </div>
        ) : currentVideoUrl ? (
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              key={currentVideoUrl}
              src={currentVideoUrl}
              autoPlay
              preload="metadata"
              className="w-full h-full object-contain"
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (!video) return;
                setCurrentClipTime(video.currentTime);
              }}
              onEnded={handleEnded}
              onLoadStart={() => {
                setCurrentClipTime(0);
              }}
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-8">
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20"
              >
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      void handleTogglePlay();
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 ml-0.5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5.14v13.72c0 .72.78 1.17 1.4.81l10.2-6.86a.94.94 0 0 0 0-1.62L9.4 4.33A.94.94 0 0 0 8 5.14Z" />
                      </svg>
                    )}
                  </button>

                  <span className="text-sm text-white tabular-nums">
                    {formatTime(totalCurrentTime)} / {formatTime(totalDuration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-300 text-sm text-center px-4">
              재생할 영상이 없습니다.
            </p>
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl bg-gray-900 rounded-lg overflow-hidden">
        <button
          onClick={() => setStoryOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-5 py-4 text-white font-semibold hover:bg-gray-800 transition-colors"
        >
          <span>스토리 라인</span>
          {storyOpen ? (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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
