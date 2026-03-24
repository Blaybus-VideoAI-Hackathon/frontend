import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { useModalStore } from "../store/ModalStore";
import ProjectCreateModal from "../components/ui/modals/ProjectCreateModal";

export default function MainPage() {
  const { open } = useModalStore();
  const navigate = useNavigate();

  const handleCreate = () => {
    open(
      <ProjectCreateModal
        onComplete={(project) =>
          navigate(`/projects/${project.id}`, {
            state: { projectTitle: project.title },
          })
        }
      />,
    );
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <p className="text-white text-lg">당신의 이야기를 들려주세요.</p>

      <div className="mt-6">
        <Button onClick={handleCreate} size="lg">
          프로젝트 생성하기
        </Button>
      </div>
    </div>
  );
}
