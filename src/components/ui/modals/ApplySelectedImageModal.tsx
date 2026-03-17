import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

interface ApplySelectedImageModalProps {
  onConfirm: () => void;
}

export default function ApplySelectedImageModal({ onConfirm }: ApplySelectedImageModalProps) {
  const { close } = useModalStore();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <h2 className="text-xl font-bold text-white text-center">
        선택된 이미지를 바탕으로{"\n"}Scene 이미지를 반영하시겠습니까?
      </h2>
      <p className="text-sm text-white/60 text-center">
        선택한 이미지를 기반으로 장면의 분위기와 요소가 자동으로 설정됩니다.
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
