import ConfirmModal from "../ConfirmModal";

interface CancelModalProps {
  onConfirm: () => void;
}

export default function CancelModal({ onConfirm }: CancelModalProps) {
  return (
    <ConfirmModal
      title="변경사항을 취소하시겠습니까?"
      description="취소하실 경우 변경사항을 되돌릴 수 없습니다."
      onConfirm={onConfirm}
    />
  );
}
