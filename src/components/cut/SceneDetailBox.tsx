import SceneLabel from "./SceneLabel";

type SceneDetailItem = {
  label: string;
  value: string;
};

type SceneDetailBoxProps = {
  sceneNumber: number;
  title: string;
  details?: SceneDetailItem[];
  onRegenerateScene?: () => void;
};

const defaultDetails: SceneDetailItem[] = [
  { label: "행동", value: "아카이누가 용암주먹 날림" },
  { label: "포즈", value: "역동적으로 돌진하는 자세" },
  { label: "구도", value: "측면 클로즈업" },
  { label: "조명", value: "붉고 강렬한 역광" },
  { label: "무드", value: "폭발 직전의 팽팽한 긴장감" },
  { label: "시간", value: "노을이 지는 붉은 저녁" },
];

function DetailRow({ label, value }: SceneDetailItem) {
  return (
    <div className="space-y-2">
      <h3 className="text-[20px] font-bold leading-none text-white">{label}</h3>
      <p className="text-[18px] leading-[1.6] text-[rgba(255,255,255,0.72)]">
        {value}
      </p>
    </div>
  );
}

export default function SceneDetailBox({
  sceneNumber,
  title,
  details = defaultDetails,
  onRegenerateScene,
}: SceneDetailBoxProps) {
  return (
    <section className="flex min-h-[760px] w-full flex-col rounded-[8px] bg-gray-900 px-7 py-6">
      <div className="flex items-center gap-4">
        <SceneLabel sceneNumber={sceneNumber} selected />
        <div className="text-gray-100 text-[18px] font-bold">{title}</div>
      </div>

      <div className="ml-4 mt-12 flex flex-col gap-12">
        {details.map((item) => (
          <DetailRow key={item.label} label={item.label} value={item.value} />
        ))}
      </div>

      <div className="mt-auto flex justify-center pt-16">
        <button
          type="button"
          onClick={onRegenerateScene}
          className="rounded-[8px] bg-[#5C4DFF] px-8 py-4 text-[18px] font-semibold text-white transition hover:bg-[#4f41ee] active:scale-[0.98]"
        >
          Scene {sceneNumber}만 다시 추천받기
        </button>
      </div>
    </section>
  );
}
