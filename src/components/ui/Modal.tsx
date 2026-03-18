import { useModalStore } from "../../store/ModalStore";

export default function Modal() {
  const { isOpen, content, close } = useModalStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={close} // 배경 클릭 시 닫기
    >
      <div
        className="bg-[#2a2a2f] rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 버블링 차단
      >
        {content}
      </div>
    </div>
  );
}
