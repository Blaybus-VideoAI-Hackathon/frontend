import ConfirmModal from "../ConfirmModal";

interface ApplySceneImageModalProps {
  onConfirm: () => void;
}

export default function ApplySceneImageModal({
  onConfirm,
}: ApplySceneImageModalProps) {
  return (
    <ConfirmModal
      title="선택된 이미지를 바탕으로 Scene 이미지를 반영하시겠습니까?"
      onConfirm={onConfirm}
    />
  );
}
