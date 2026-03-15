import Button from "../components/ui/Button";
import { useModalStore } from "../store/ModalStore";
import ProjectCreateModal from "../components/ui/modals/ProjectCreateModal";

export default function MainPage() {
  const { open } = useModalStore();

  const handleCreate = () => {
    open(<ProjectCreateModal />);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <p className="text-white text-lg mb-6 tracking-wide">
        당신의 이야기를 들려주세요.
      </p>

      <div className="w-full max-w-240 aspect-video bg-gray-600 rounded-sm mb-10" />

      <Button onClick={handleCreate} size="lg">
        프로젝트 생성하기
      </Button>
    </div>
  );
}
