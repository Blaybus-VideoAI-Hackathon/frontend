import { useMemo, useState } from "react";
import type { SceneItem } from "./SceneListBox";
import SceneListBox from "./SceneListBox";
import SceneDetailBox from "./SceneDetailBox";

const initialScenes: SceneItem[] = [
  {
    id: 1,
    title: "두 캐릭터 대치",
    details: [
      { label: "행동", value: "아카이누가 용암주먹 날림" },
      { label: "포즈", value: "역동적으로 돌진하는 자세" },
      { label: "구도", value: "측면 클로즈업" },
      { label: "조명", value: "붉고 강렬한 역광" },
      { label: "무드", value: "폭발 직전의 팽팽한 긴장감" },
      { label: "시간", value: "노을이 지는 붉은 저녁" },
    ],
  },
  {
    id: 2,
    title: "아카이누 공격",
    details: [
      { label: "행동", value: "아카이누가 전방으로 강하게 돌진" },
      { label: "포즈", value: "용암을 두른 주먹을 앞으로 내민 자세" },
      { label: "구도", value: "로우 앵글" },
      { label: "조명", value: "용암빛이 강조된 붉은 조명" },
      { label: "무드", value: "위협적이고 공격적인 분위기" },
      { label: "시간", value: "전장의 붉은 석양" },
    ],
  },
  {
    id: 3,
    title: "상크스 방어",
    details: [
      { label: "행동", value: "상크스가 검으로 공격을 막아냄" },
      { label: "포즈", value: "상체를 낮추고 검을 들어 올린 자세" },
      { label: "구도", value: "정면 중근접 샷" },
      { label: "조명", value: "검과 불꽃 반사가 섞인 조명" },
      { label: "무드", value: "침착하지만 강한 긴장감" },
      { label: "시간", value: "붉은 저녁 하늘" },
    ],
  },
  {
    id: 4,
    title: "격돌",
    details: [
      { label: "행동", value: "두 힘이 정면으로 충돌" },
      { label: "포즈", value: "서로를 밀어붙이는 자세" },
      { label: "구도", value: "와이드 샷" },
      { label: "조명", value: "폭발광이 중심이 되는 강한 조명" },
      { label: "무드", value: "압도적 충돌과 에너지" },
      { label: "시간", value: "전장 한가운데" },
    ],
  },
  {
    id: 5,
    title: "전장 충격파",
    details: [
      { label: "행동", value: "충돌 후 거대한 충격파가 퍼짐" },
      { label: "포즈", value: "잔해와 파편이 사방으로 날리는 연출" },
      { label: "구도", value: "초광각 샷" },
      { label: "조명", value: "번쩍이는 충격파 중심 광원" },
      { label: "무드", value: "장대한 마무리의 여운" },
      { label: "시간", value: "석양과 연기 속의 전장" },
    ],
  },
];

export default function CutStage() {
  const [scenes, setScenes] = useState<SceneItem[]>(initialScenes);
  const [selectedSceneId, setSelectedSceneId] = useState<number>(1);

  const selectedScene = useMemo(() => {
    return scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0];
  }, [scenes, selectedSceneId]);

  const selectedSceneNumber = useMemo(() => {
    return scenes.findIndex((scene) => scene.id === selectedSceneId) + 1;
  }, [scenes, selectedSceneId]);

  const handleRemoveScene = (sceneId: number) => {
    const updatedScenes = scenes.filter((scene) => scene.id !== sceneId);
    setScenes(updatedScenes);

    if (sceneId === selectedSceneId && updatedScenes.length > 0) {
      setSelectedSceneId(updatedScenes[0].id);
    }
  };

  const handleAddScene = () => {
    const nextId = Date.now();

    setScenes((prev) => [
      ...prev,
      {
        id: nextId,
        title: `새 Scene ${prev.length + 1}`,
        details: [
          { label: "행동", value: "새로운 장면의 행동을 입력하세요." },
          { label: "포즈", value: "새로운 장면의 포즈를 입력하세요." },
          { label: "구도", value: "새로운 장면의 구도를 입력하세요." },
          { label: "조명", value: "새로운 장면의 조명을 입력하세요." },
          { label: "무드", value: "새로운 장면의 무드를 입력하세요." },
          { label: "시간", value: "새로운 장면의 시간을 입력하세요." },
        ],
      },
    ]);
  };

  if (!selectedScene) return null;

  return (
    <section className="grid items-stretch grid-cols-1 gap-4 md:grid-cols-[450px_minmax(0,1fr)]">
      <SceneListBox
        scenes={scenes}
        selectedSceneId={selectedSceneId}
        onSelectScene={setSelectedSceneId}
        onRemoveScene={handleRemoveScene}
        onAddScene={handleAddScene}
      />

      <SceneDetailBox
        sceneNumber={selectedSceneNumber}
        title={selectedScene.title}
        details={selectedScene.details}
        onRegenerateScene={() => {
          console.log("선택된 Scene만 다시 추천");
        }}
      />
    </section>
  );
}
