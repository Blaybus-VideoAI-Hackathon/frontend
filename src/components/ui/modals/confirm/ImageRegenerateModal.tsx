import ConfirmModal from "../ConfirmModal";

interface ImageRegenerateModalProps {
  onConfirm: () => void;
}

export default function ImageRegenerateModal({
  onConfirm,
}: ImageRegenerateModalProps) {
  return (
    <ConfirmModal
      title="이미지를 재생성하시겠습니까?"
      description="재생성을 하실 경우 지금의 이미지는 되돌릴 수 없습니다."
      onConfirm={onConfirm}
    />
  );
}
