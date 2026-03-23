import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteScene,
  generateScenes,
  getSceneDesign,
  getScenesByProject,
  regenerateSceneDesign,
} from "../api/sceneApi";
import type {
  Scene,
  SceneDesign,
  SceneOptionalElementsObject,
} from "../types/scene";

export type CutSceneDetailItem = {
  label: string;
  value: string;
};

export type CutScene = {
  id: number;
  title: string;
  details: CutSceneDetailItem[];
};

type UseCutScenesParams = {
  projectId: number;
  enabled?: boolean;
};

function createDetailItems(
  optionalElements: SceneOptionalElementsObject,
): CutSceneDetailItem[] {
  const items: CutSceneDetailItem[] = [];

  if (optionalElements.action) {
    items.push({ label: "행동", value: optionalElements.action });
  }
  if (optionalElements.pose) {
    items.push({ label: "포즈", value: optionalElements.pose });
  }
  if (optionalElements.camera) {
    items.push({ label: "구도", value: optionalElements.camera });
  }
  if (optionalElements.cameraMotion) {
    items.push({ label: "카메라 무빙", value: optionalElements.cameraMotion });
  }
  if (optionalElements.lighting) {
    items.push({ label: "조명", value: optionalElements.lighting });
  }
  if (optionalElements.mood) {
    items.push({ label: "무드", value: optionalElements.mood });
  }
  if (optionalElements.timeOfDay) {
    items.push({ label: "시간", value: optionalElements.timeOfDay });
  }
  if (optionalElements.effects?.length) {
    items.push({
      label: "효과",
      value: optionalElements.effects.join(", "),
    });
  }
  if (optionalElements.backgroundCharacters) {
    items.push({
      label: "배경 인물",
      value: optionalElements.backgroundCharacters,
    });
  }
  if (optionalElements.environmentDetail) {
    items.push({
      label: "환경 디테일",
      value: optionalElements.environmentDetail,
    });
  }

  return items;
}

function mapSceneToCutScene(scene: Scene, design: SceneDesign): CutScene {
  return {
    id: scene.id,
    title: design.summary || scene.summary || `Scene ${scene.sceneOrder}`,
    details: createDetailItems(design.optionalElements),
  };
}

function mapSceneDesignToCutScene(
  sceneId: number,
  design: SceneDesign,
  fallbackTitle?: string,
): CutScene {
  return {
    id: sceneId,
    title: design.summary || fallbackTitle || `Scene ${sceneId}`,
    details: createDetailItems(design.optionalElements),
  };
}

export function useCutScenes({
  projectId,
  enabled = true,
}: UseCutScenesParams) {
  const [scenes, setScenes] = useState<CutScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [regeneratingSceneId, setRegeneratingSceneId] = useState<number | null>(
    null,
  );

  // projectId가 바뀌면 이전 프로젝트의 캐시된 데이터를 초기화
  useEffect(() => {
    setScenes([]);
    setSelectedSceneId(null);
    setHasInitialized(false);
    setError(null);
  }, [projectId]);

  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let scenesResponse = await getScenesByProject({ projectId });
      let rawScenes = scenesResponse.data ?? [];

      if (rawScenes.length === 0) {
        await generateScenes({
          projectId,
        });

        scenesResponse = await getScenesByProject({ projectId });
        rawScenes = scenesResponse.data ?? [];
      }

      const orderedScenes = [...rawScenes].sort(
        (a, b) => a.sceneOrder - b.sceneOrder,
      );

      const designResponses = await Promise.all(
        orderedScenes.map((scene) =>
          getSceneDesign({
            projectId,
            sceneId: scene.id,
          }),
        ),
      );

      const mappedScenes = orderedScenes.map((scene, index) =>
        mapSceneToCutScene(scene, designResponses[index].data),
      );

      setScenes(mappedScenes);
      setSelectedSceneId((prev) => {
        if (prev && mappedScenes.some((scene) => scene.id === prev)) {
          return prev;
        }
        return mappedScenes[0]?.id ?? null;
      });
      setHasInitialized(true);
    } catch (err) {
      console.error("컷씬 초기화 실패:", err);
      setError("컷씬 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!enabled) return;
    if (hasInitialized) return;
    void initialize();
  }, [enabled, hasInitialized, initialize]);

  const handleDeleteScene = useCallback(
    async (sceneId: number) => {
      if (isDeleting) return;

      const shouldDelete = window.confirm("이 씬을 삭제하시겠습니까?");
      if (!shouldDelete) return;

      setIsDeleting(true);
      setError(null);

      try {
        await deleteScene({
          projectId,
          sceneId,
        });

        setScenes((prev) => {
          const deletedIndex = prev.findIndex((scene) => scene.id === sceneId);
          const nextScenes = prev.filter((scene) => scene.id !== sceneId);

          setSelectedSceneId((currentSelectedId) => {
            if (currentSelectedId !== sceneId) {
              return currentSelectedId;
            }

            if (nextScenes.length === 0) {
              return null;
            }

            const nextScene =
              nextScenes[deletedIndex] ??
              nextScenes[deletedIndex - 1] ??
              nextScenes[0];

            return nextScene.id;
          });

          return nextScenes;
        });
      } catch (err) {
        console.error("씬 삭제 실패:", err);
        setError("씬 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsDeleting(false);
      }
    },
    [isDeleting, projectId],
  );

  const handleRegenerateScene = useCallback(
    async (sceneId: number, userRequest?: string) => {
      if (regeneratingSceneId !== null) return;

      setRegeneratingSceneId(sceneId);
      setError(null);

      try {
        const trimmedRequest = userRequest?.trim();

        const response = await regenerateSceneDesign({
          projectId,
          sceneId,
          body: trimmedRequest
            ? {
                regenerateType: "variation",
                userRequest: trimmedRequest,
              }
            : undefined,
        });

        setScenes((prev) =>
          prev.map((scene) =>
            scene.id === sceneId
              ? mapSceneDesignToCutScene(sceneId, response.data, scene.title)
              : scene,
          ),
        );
      } catch (err) {
        console.error("씬 재추천 실패:", err);
        setError("씬 재추천에 실패했습니다. 잠시 후 다시 시도해주세요.");
        throw err;
      } finally {
        setRegeneratingSceneId(null);
      }
    },
    [projectId, regeneratingSceneId],
  );

  const selectedScene = useMemo(() => {
    if (!selectedSceneId) return scenes[0] ?? null;
    return (
      scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0] ?? null
    );
  }, [scenes, selectedSceneId]);

  const selectedSceneNumber = useMemo(() => {
    if (!selectedScene) return 0;
    return scenes.findIndex((scene) => scene.id === selectedScene.id) + 1;
  }, [scenes, selectedScene]);

  return {
    scenes,
    selectedScene,
    selectedSceneId,
    selectedSceneNumber,
    loading,
    error,
    isDeleting,
    regeneratingSceneId,
    initialize,
    setSelectedSceneId,
    handleDeleteScene,
    handleRegenerateScene,
  };
}
