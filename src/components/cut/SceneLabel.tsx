type SceneLabelProps = {
  sceneNumber: number;
  selected?: boolean;
};

export default function SceneLabel({
  sceneNumber,
  selected = false,
}: SceneLabelProps) {
  const formattedNumber = String(sceneNumber).padStart(2, "0");

  return (
    <div
      className={[
        "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-[15px] font-semibold transition-colors",
        selected
          ? "bg-[#5C4DFF] text-white"
          : "bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.35)]",
      ].join(" ")}
    >
      {`Scene ${formattedNumber}`}
    </div>
  );
}
