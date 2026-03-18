import ConfirmModal from "../ConfirmModal";

interface ApplySelectedImageModalProps {
  onConfirm: () => void;
}

export default function ApplySelectedImageModal({
  onConfirm,
}: ApplySelectedImageModalProps) {
  return (
    <ConfirmModal
      title={`선택된 이미지를 바탕으로\nScene 이미지를 반영하시겠습니까?`}
      description="선택한 이미지를 기반으로 장면의 분위기와 요소가 자동으로 설정됩니다."
      onConfirm={onConfirm}
    />
  );
}
