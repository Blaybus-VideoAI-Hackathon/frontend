import PlusIcon from "../../assets/icons/plus_add.svg";

type AddSceneButtonProps = {
  onClick?: () => void;
};

export default function AddSceneButton({ onClick }: AddSceneButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[58px] w-full items-center gap-3 rounded-[8px] border border-[rgba(255,255,255,0.08)] bg-transparent px-4 text-left transition hover:bg-[rgba(255,255,255,0.03)]"
    >
      <img
        src={PlusIcon}
        alt=""
        className="h-5 w-5 object-contain opacity-60"
      />
      <span className="text-[18px] font-medium text-[rgba(255,255,255,0.28)]">
        추가하기
      </span>
    </button>
  );
}
