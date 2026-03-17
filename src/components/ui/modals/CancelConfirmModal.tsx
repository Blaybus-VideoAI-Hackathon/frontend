import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

interface CancelConfirmModalProps {
  onConfirm: () => void;
}

export default function CancelConfirmModal({ onConfirm }: CancelConfirmModalProps) {
  const { close } = useModalStore();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <h2 className="text-xl font-bold text-white text-center">
        변경사항을 취소하시겠습니까?
      </h2>
      <p className="text-sm text-white/60 text-center">
        취소하실 경우 변경사항을 되돌릴 수 없습니다.
      </p>

      <div className="flex gap-3 mt-3 w-full">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={close}
        >
          아니요
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleConfirm}
        >
          예
        </Button>
      </div>
    </div>
  );
}
