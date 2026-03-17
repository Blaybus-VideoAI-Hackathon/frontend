import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

interface ApplySceneImageModalProps {
  onConfirm: () => void;
}

export default function ApplySceneImageModal({ onConfirm }: ApplySceneImageModalProps) {
  const { close } = useModalStore();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <h2 className="text-lg font-semibold text-white text-center">
        선택된 이미지를 바탕으로 Scene 이미지를 반영하시겠습니까?
      </h2>

      <div className="flex gap-3 w-full">
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
