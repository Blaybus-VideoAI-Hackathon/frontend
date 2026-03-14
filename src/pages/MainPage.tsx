import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/new");
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <p className="text-white text-lg mb-6 tracking-wide">
        당신의 이야기를 들려주세요.
      </p>

      <div className="w-full max-w-240 aspect-video bg-gray-600 rounded-sm mb-10" />

      <button
        onClick={handleCreate}
        className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all text-white text-base font-medium px-8 py-3 rounded-md"
      >
        프로젝트 생성하기
      </button>
    </div>
  );
}
