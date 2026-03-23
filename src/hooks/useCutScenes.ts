import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteScene,
  generateSceneDesign,
  generateScenePrompt,
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
  selectedPlanId?: number | null;
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
  selectedPlanId,
}: UseCutScenesParams) {
  const [scenes, setScenes] = useState<CutScene[]>([]);
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [generationStatusMessage, setGenerationStatusMessage] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [regeneratingSceneId, setRegeneratingSceneId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    setScenes([]);
    setSelectedSceneId(null);
    setHasInitialized(false);
    setError(null);
    setIsGeneratingPrompts(false);
    setGenerationStatusMessage(null);
  }, [projectId]);

  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsGeneratingPrompts(false);
    setGenerationStatusMessage(null);

    try {
      let scenesResponse = await getScenesByProject({ projectId });
      let rawScenes = scenesResponse.data ?? [];

      let isNewlyGenerated = false;
      if (rawScenes.length === 0) {
        await generateScenes({
          projectId,
          body: { selectedPlanId: selectedPlanId ?? 0 },
        });

        scenesResponse = await getScenesByProject({ projectId });
        rawScenes = scenesResponse.data ?? [];
        isNewlyGenerated = true;
      }

      const orderedScenes = [...rawScenes].sort(
        (a, b) => a.sceneOrder - b.sceneOrder,
      );

      const basicScenes: CutScene[] = orderedScenes.map((scene) => ({
        id: scene.id,
        title: scene.summary || `Scene ${scene.sceneOrder}`,
        details: [],
      }));

      setScenes(basicScenes);
      setSelectedSceneId((prev) => {
        if (prev && basicScenes.some((s) => s.id === prev)) return prev;
        return basicScenes[0]?.id ?? null;
      });
      setLoading(false);

      // Phase 2: 신규 생성된 씬이면 프롬프트 → 컷설계 순서대로 생성
      if (isNewlyGenerated) {
        setIsGeneratingPrompts(true);

        for (const scene of orderedScenes) {
          try {
            setGenerationStatusMessage(
              "이미지/영상 프롬프트를 생성 중입니다...",
            );
            await generateScenePrompt({ projectId, sceneId: scene.id });

            setGenerationStatusMessage("컷 상세 정보를 생성 중입니다...");
            await generateSceneDesign({
              projectId,
              sceneId: scene.id,
              body: {
                designRequest:
                  scene.summary || `Scene ${scene.sceneOrder} 상세 설계 생성`,
              },
            });
          } catch (err) {
            console.warn(`Scene ${scene.id} 프롬프트/컷설계 생성 실패:`, err);
          }
        }

        setIsGeneratingPrompts(false);
        setGenerationStatusMessage(null);
      }

      // Phase 3: 상세 조회
      const designResponses = await Promise.all(
        orderedScenes.map(async (scene) => {
          try {
            return await getSceneDesign({
              projectId,
              sceneId: scene.id,
            });
          } catch (err) {
            // 기존 프로젝트인데 아직 설계가 안 된 씬이면 fallback 생성 후 재조회
            if (!isNewlyGenerated) {
              await generateSceneDesign({
                projectId,
                sceneId: scene.id,
                body: {
                  designRequest:
                    scene.summary || `Scene ${scene.sceneOrder} 상세 설계 생성`,
                },
              });

              return await getSceneDesign({
                projectId,
                sceneId: scene.id,
              });
            }

            throw err;
          }
        }),
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
      setIsGeneratingPrompts(false);
      setGenerationStatusMessage(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, selectedPlanId]);

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
    isGeneratingPrompts,
    generationStatusMessage,
    error,
    isDeleting,
    regeneratingSceneId,
    initialize,
    setSelectedSceneId,
    handleDeleteScene,
    handleRegenerateScene,
  };
}
