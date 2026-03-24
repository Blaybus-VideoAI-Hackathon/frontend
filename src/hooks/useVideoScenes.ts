import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getScenesByProject } from "../api/sceneApi";
import { generateSceneVideo, getProjectVideos } from "../api/videoApi";
import type { Scene } from "../types/scene";
import type { SceneVideo } from "../types/video";

export type VideoSceneStatus =
  | "idle"
  | "generating"
  | "done"
  | "locked"
  | "failed";

export type VideoSceneItem = {
  id: number; // sceneId
  title: string;
  status: VideoSceneStatus;
  thumbnailSrc?: string;
  durationText?: string;
  latestVideoId?: number;
  latestDuration?: number;
};

type SceneBase = {
  id: number;
  title: string;
  sceneOrder: number;
};

type UseVideoScenesParams = {
  projectId: number;
  enabled?: boolean;
};

type GenerateVideoParams = {
  sceneId: number;
};

function getSceneTitle(scene: Scene) {
  return scene.summary || `Scene ${scene.sceneOrder}`;
}

function normalizeVideoStatus(video?: SceneVideo) {
  return video?.status?.toUpperCase() ?? "";
}

function isGeneratingVideo(video?: SceneVideo) {
  const status = normalizeVideoStatus(video);
  return status === "PENDING" || status === "GENERATING";
}

function isCompletedVideo(video?: SceneVideo) {
  return normalizeVideoStatus(video) === "COMPLETED";
}

function isFailedVideo(video?: SceneVideo) {
  return normalizeVideoStatus(video) === "FAILED";
}

function formatDurationText(duration?: number) {
  if (!duration || Number.isNaN(duration)) return undefined;
  return `0:${String(duration).padStart(2, "0")}`;
}

function getLatestVideoMap(videos: SceneVideo[]) {
  const latestMap = new Map<number, SceneVideo>();

  for (const video of videos) {
    const existing = latestMap.get(video.sceneId);

    if (!existing || video.id > existing.id) {
      latestMap.set(video.sceneId, video);
    }
  }

  return latestMap;
}

function buildSceneItems(sceneBases: SceneBase[], videos: SceneVideo[]) {
  const latestVideoMap = getLatestVideoMap(videos);

  const blockerIndex = sceneBases.findIndex((sceneBase) => {
    const latestVideo = latestVideoMap.get(sceneBase.id);

    if (!latestVideo) return true;
    if (isGeneratingVideo(latestVideo)) return true;
    if (isFailedVideo(latestVideo)) return true;
    if (!isCompletedVideo(latestVideo)) return true;

    return false;
  });

  return sceneBases.map<VideoSceneItem>((sceneBase, index) => {
    const latestVideo = latestVideoMap.get(sceneBase.id);

    if (latestVideo) {
      if (isGeneratingVideo(latestVideo)) {
        return {
          id: sceneBase.id,
          title: sceneBase.title,
          status: "generating",
          thumbnailSrc: latestVideo.videoUrl || undefined,
          durationText: formatDurationText(latestVideo.duration),
          latestVideoId: latestVideo.id,
          latestDuration: latestVideo.duration,
        };
      }

      if (isFailedVideo(latestVideo)) {
        return {
          id: sceneBase.id,
          title: sceneBase.title,
          status: "failed",
          latestVideoId: latestVideo.id,
          latestDuration: latestVideo.duration,
          durationText: formatDurationText(latestVideo.duration),
        };
      }

      if (isCompletedVideo(latestVideo)) {
        return {
          id: sceneBase.id,
          title: sceneBase.title,
          status: "done",
          thumbnailSrc: latestVideo.videoUrl || undefined,
          durationText: formatDurationText(latestVideo.duration),
          latestVideoId: latestVideo.id,
          latestDuration: latestVideo.duration,
        };
      }
    }

    return {
      id: sceneBase.id,
      title: sceneBase.title,
      status: index === blockerIndex ? "idle" : "locked",
    };
  });
}

export function useVideoScenes({
  projectId,
  enabled = true,
}: UseVideoScenesParams) {
  const [sceneBases, setSceneBases] = useState<SceneBase[]>([]);
  const [items, setItems] = useState<VideoSceneItem[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasInitialized, setHasInitialized] = useState(false);
  const [autoGeneratingSceneId, setAutoGeneratingSceneId] = useState<
    number | null
  >(null);
  const [submittingSceneId, setSubmittingSceneId] = useState<number | null>(
    null,
  );

  const autoGenerateLockRef = useRef<number | null>(null);

  const refreshVideos = useCallback(
    async (bases: SceneBase[]) => {
      const videosResponse = await getProjectVideos({ projectId });
      const allVideos = videosResponse.data ?? [];

      const nextItems = buildSceneItems(bases, allVideos);
      setItems(nextItems);

      setSelectedSceneId((prev) => {
        if (prev) {
          const existing = nextItems.find((item) => item.id === prev);
          if (existing && existing.status !== "locked") {
            return prev;
          }
        }

        const firstVisible =
          nextItems.find((item) => item.status === "done") ??
          nextItems.find((item) => item.status === "generating") ??
          nextItems.find((item) => item.status === "failed") ??
          nextItems.find((item) => item.status === "idle") ??
          null;

        return firstVisible?.id ?? null;
      });

      return nextItems;
    },
    [projectId],
  );

  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const scenesResponse = await getScenesByProject({ projectId });
      const rawScenes = scenesResponse.data ?? [];

      const orderedScenes = [...rawScenes]
        .sort((a, b) => a.sceneOrder - b.sceneOrder)
        .map<SceneBase>((scene) => ({
          id: scene.id,
          title: getSceneTitle(scene),
          sceneOrder: scene.sceneOrder,
        }));

      setSceneBases(orderedScenes);
      await refreshVideos(orderedScenes);
      setHasInitialized(true);
    } catch (err) {
      console.error("영상 단계 초기화 실패:", err);
      setError("영상 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [projectId, refreshVideos]);

  useEffect(() => {
    if (!enabled) return;
    if (hasInitialized) return;
    void initialize();
  }, [enabled, hasInitialized, initialize]);

  useEffect(() => {
    if (!enabled) return;
    if (sceneBases.length === 0) return;
    if (!items.some((item) => item.status === "generating")) return;

    const interval = window.setInterval(() => {
      void refreshVideos(sceneBases);
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [enabled, items, refreshVideos, sceneBases]);

  useEffect(() => {
    if (!enabled) return;
    if (loading) return;
    if (sceneBases.length === 0) return;

    const firstScene = sceneBases[0];
    if (!firstScene) return;

    const firstSceneItem = items.find((item) => item.id === firstScene.id);
    if (!firstSceneItem) return;

    const hasGeneratingScene = items.some(
      (item) => item.status === "generating",
    );
    if (hasGeneratingScene) {
      const generatingScene = items.find(
        (item) => item.status === "generating",
      );
      setAutoGeneratingSceneId(generatingScene?.id ?? null);
      return;
    }

    // Scene 01이 아직 한 번도 생성되지 않은 경우에만 자동 생성
    if (firstSceneItem.status !== "idle") {
      setAutoGeneratingSceneId(null);
      autoGenerateLockRef.current = null;
      return;
    }

    if (autoGenerateLockRef.current === firstScene.id) return;

    autoGenerateLockRef.current = firstScene.id;
    setAutoGeneratingSceneId(firstScene.id);
    setSelectedSceneId(firstScene.id);

    void (async () => {
      try {
        setItems((prev) =>
          prev.map((item) =>
            item.id === firstScene.id
              ? { ...item, status: "generating" }
              : item,
          ),
        );

        await generateSceneVideo({
          projectId,
          sceneId: firstScene.id,
        });

        await refreshVideos(sceneBases);
      } catch (err) {
        console.error("Scene 01 자동 영상 생성 실패:", err);
        setError(
          "첫 번째 씬 영상 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
        );
        await refreshVideos(sceneBases);
      } finally {
        autoGenerateLockRef.current = null;
        setAutoGeneratingSceneId(null);
      }
    })();
  }, [enabled, items, loading, projectId, refreshVideos, sceneBases]);

  const submitGenerate = useCallback(
    async ({ sceneId }: GenerateVideoParams) => {
      const target = items.find((item) => item.id === sceneId);
      if (!target) return;

      if (items.some((item) => item.status === "generating")) {
        return;
      }

      setError(null);
      setSubmittingSceneId(sceneId);
      setSelectedSceneId(sceneId);

      try {
        setItems((prev) =>
          prev.map((item) =>
            item.id === sceneId ? { ...item, status: "generating" } : item,
          ),
        );

        await generateSceneVideo({
          projectId,
          sceneId,
        });

        await refreshVideos(sceneBases);
      } catch (err) {
        console.error("씬 영상 생성 실패:", err);
        setError("씬 영상 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        await refreshVideos(sceneBases);
      } finally {
        setSubmittingSceneId(null);
      }
    },
    [items, projectId, refreshVideos, sceneBases],
  );

  const selectedScene = useMemo(() => {
    if (!selectedSceneId) {
      return (
        items.find((item) => item.status === "done") ??
        items.find((item) => item.status === "generating") ??
        items.find((item) => item.status === "failed") ??
        items.find((item) => item.status === "idle") ??
        null
      );
    }

    return (
      items.find((item) => item.id === selectedSceneId) ??
      items.find((item) => item.status === "done") ??
      items.find((item) => item.status === "generating") ??
      items.find((item) => item.status === "failed") ??
      items.find((item) => item.status === "idle") ??
      null
    );
  }, [items, selectedSceneId]);

  const selectedSceneNumber = useMemo(() => {
    if (!selectedScene) return 0;
    return items.findIndex((item) => item.id === selectedScene.id) + 1;
  }, [items, selectedScene]);

  return {
    items,
    selectedScene,
    selectedSceneId,
    selectedSceneNumber,
    loading,
    error,
    autoGeneratingSceneId,
    submittingSceneId,
    initialize,
    setSelectedSceneId,
    handleGenerateScene: submitGenerate,
    handleRegenerateScene: submitGenerate,
  };
}
