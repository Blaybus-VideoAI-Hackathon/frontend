import ConfirmModal from "../ConfirmModal";

interface SceneDeleteModalProps {
  sceneNumber: number;
  onConfirm: () => void;
}

export default function SceneDeleteModal({
  sceneNumber,
  onConfirm,
}: SceneDeleteModalProps) {
  return (
    <ConfirmModal
      title={`Scene ${sceneNumber}를 삭제하시겠습니까?`}
      description={`Scene${sceneNumber}를 삭제하실 경우 되돌릴 수 없습니다.`}
      onConfirm={onConfirm}
    />
  );
}
