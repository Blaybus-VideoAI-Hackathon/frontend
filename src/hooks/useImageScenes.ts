import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getScenesByProject } from "../api/sceneApi";
import { generateSceneImage, getProjectImages } from "../api/imageApi";
import type { Scene } from "../types/scene";
import type { SceneImage } from "../types/image";

export type ImageSceneStatus = "idle" | "generating" | "done" | "locked" | "failed";

export type ImageSceneItem = {
  id: number; // sceneId
  title: string;
  status: ImageSceneStatus;
  thumbnailSrc?: string;
  latestImageNumber?: number;
  latestImageId?: number;
};

type SceneBase = {
  id: number;
  title: string;
  sceneOrder: number;
};

type UseImageScenesParams = {
  projectId: number;
  enabled?: boolean;
};

function getSceneTitle(scene: Scene) {
  return scene.summary || `Scene ${scene.sceneOrder}`;
}

function isGeneratingImage(image: SceneImage) {
  const status = image.status?.toUpperCase() ?? "";
  const description = image.statusDescription ?? "";

  return (
    status.includes("GENERATING") ||
    status.includes("PENDING") ||
    status.includes("PROCESSING") ||
    description.includes("생성 중")
  );
}

function isFailedImage(image: SceneImage) {
  return image.status?.toUpperCase() === "FAILED";
}

function getDisplayImageUrl(image: SceneImage) {
  return image.editedImageUrl || image.imageUrl || undefined;
}

function getLatestImageMap(images: SceneImage[]) {
  const latestMap = new Map<number, SceneImage>();

  for (const image of images) {
    const existing = latestMap.get(image.sceneId);

    if (!existing || image.imageNumber > existing.imageNumber) {
      latestMap.set(image.sceneId, image);
    }
  }

  return latestMap;
}

function buildSceneItems(sceneBases: SceneBase[], images: SceneImage[]) {
  const latestImageMap = getLatestImageMap(images);

  const blockerIndex = sceneBases.findIndex((sceneBase) => {
    const latestImage = latestImageMap.get(sceneBase.id);
    return !latestImage || isGeneratingImage(latestImage);
  });

  return sceneBases.map<ImageSceneItem>((sceneBase, index) => {
    const latestImage = latestImageMap.get(sceneBase.id);

    if (latestImage) {
      if (isGeneratingImage(latestImage)) {
        return {
          id: sceneBase.id,
          title: sceneBase.title,
          status: "generating",
          thumbnailSrc: getDisplayImageUrl(latestImage),
          latestImageNumber: latestImage.imageNumber,
          latestImageId: latestImage.id,
        };
      }

      if (isFailedImage(latestImage)) {
        return {
          id: sceneBase.id,
          title: sceneBase.title,
          status: "failed",
          latestImageNumber: latestImage.imageNumber,
          latestImageId: latestImage.id,
        };
      }

      return {
        id: sceneBase.id,
        title: sceneBase.title,
        status: "done",
        thumbnailSrc: getDisplayImageUrl(latestImage),
        latestImageNumber: latestImage.imageNumber,
        latestImageId: latestImage.id,
      };
    }

    if (blockerIndex === -1) {
      return {
        id: sceneBase.id,
        title: sceneBase.title,
        status: "done",
      };
    }

    return {
      id: sceneBase.id,
      title: sceneBase.title,
      status: index === blockerIndex ? "idle" : "locked",
    };
  });
}

export function useImageScenes({
  projectId,
  enabled = true,
}: UseImageScenesParams) {
  const [sceneBases, setSceneBases] = useState<SceneBase[]>([]);
  const [items, setItems] = useState<ImageSceneItem[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasInitialized, setHasInitialized] = useState(false);
  const [autoGeneratingSceneId, setAutoGeneratingSceneId] = useState<
    number | null
  >(null);

  const autoGenerateLockRef = useRef<number | null>(null);

  const refreshImages = useCallback(
    async (bases: SceneBase[]) => {
      const imagesResponse = await getProjectImages({ projectId });
      const allImages = imagesResponse.data ?? [];

      const nextItems = buildSceneItems(bases, allImages);
      setItems(nextItems);

      setSelectedSceneId((prev) => {
        if (prev) {
          const existing = nextItems.find((item) => item.id === prev);
          if (
            existing &&
            existing.status !== "locked" &&
            existing.status !== "idle"
          ) {
            return prev;
          }
        }

        const firstVisible =
          nextItems.find((item) => item.status === "done") ??
          nextItems.find((item) => item.status === "generating") ??
          nextItems.find((item) => item.status === "failed") ??
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
      await refreshImages(orderedScenes);
      setHasInitialized(true);
    } catch (err) {
      console.error("이미지 단계 초기화 실패:", err);
      setError("이미지 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [projectId, refreshImages]);

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
      void refreshImages(sceneBases);
    }, 3000);

    return () => {
      window.clearInterval(interval);
    };
  }, [enabled, items, refreshImages, sceneBases]);

  useEffect(() => {
    if (!enabled) return;
    if (sceneBases.length === 0) return;
    if (loading) return;

    const currentlyGenerating = items.find(
      (item) => item.status === "generating",
    );
    if (currentlyGenerating) {
      setAutoGeneratingSceneId(currentlyGenerating.id);
      autoGenerateLockRef.current = null;
      return;
    }

    const nextIdleScene = items.find((item) => item.status === "idle");
    if (!nextIdleScene) {
      setAutoGeneratingSceneId(null);
      autoGenerateLockRef.current = null;
      return;
    }

    if (autoGenerateLockRef.current === nextIdleScene.id) return;

    autoGenerateLockRef.current = nextIdleScene.id;
    setAutoGeneratingSceneId(nextIdleScene.id);

    void (async () => {
      try {
        setItems((prev) =>
          prev.map((item) =>
            item.id === nextIdleScene.id
              ? { ...item, status: "generating" }
              : item,
          ),
        );

        await generateSceneImage({
          projectId,
          sceneId: nextIdleScene.id,
        });

        await refreshImages(sceneBases);
      } catch (err) {
        console.error("씬 이미지 자동 생성 실패:", err);
        setError("씬 이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
        await refreshImages(sceneBases);
      } finally {
        autoGenerateLockRef.current = null;
        setAutoGeneratingSceneId(null);
      }
    })();
  }, [enabled, items, loading, projectId, refreshImages, sceneBases]);

  const selectedScene = useMemo(() => {
    if (!selectedSceneId) {
      return (
        items.find((item) => item.status === "done") ??
        items.find((item) => item.status === "generating") ??
        items.find((item) => item.status === "failed") ??
        null
      );
    }

    return (
      items.find((item) => item.id === selectedSceneId) ??
      items.find((item) => item.status === "done") ??
      items.find((item) => item.status === "generating") ??
      items.find((item) => item.status === "failed") ??
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
    initialize,
    setSelectedSceneId,
  };
}
