import { useModalStore } from "../../../store/ModalStore";
import Button from "../Button";

interface ConfirmModalProps {
  title: string;
  description?: string;
  onConfirm: () => void;
}

export default function ConfirmModal({ title, description, onConfirm }: ConfirmModalProps) {
  const { close } = useModalStore();

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <h2 className="text-xl font-bold text-white text-center">{title}</h2>
      {description && (
        <p className="text-sm text-white/60 text-center">{description}</p>
      )}
      <div className="flex gap-3 mt-3 w-full">
        <Button variant="secondary" size="lg" className="flex-1" onClick={close}>
          아니요
        </Button>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleConfirm}>
          예
        </Button>
      </div>
    </div>
  );
}
