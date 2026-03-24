import StoryIcon from "../../assets/icons/story.svg?react";
import CutIcon from "../../assets/icons/cut.svg?react";
import ImageIcon from "../../assets/icons/image.svg?react";
import VideoIcon from "../../assets/icons/video.svg?react";
// import FinishIcon from "../../assets/icons/finish.svg?react";
import Line from "../../assets/line.svg";
import type { TabId } from "../../constants/step";

const TABS: {
  id: TabId;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { id: "story", label: "스토리 기획", Icon: StoryIcon },
  { id: "cut", label: "컷 설계", Icon: CutIcon },
  { id: "image", label: "이미지 생성", Icon: ImageIcon },
  { id: "video", label: "동영상 생성", Icon: VideoIcon },
  // { id: "finish", label: "동영상 병합", Icon: FinishIcon },
];

type StepTabsProps = {
  activeTab: TabId;
};

export default function StepTabs({ activeTab }: StepTabsProps) {
  return (
    <div className="flex items-center gap-2 w-full">
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="flex flex-1 items-center gap-2">
            <div
              aria-current={isActive ? "step" : undefined}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-6 py-5 transition-colors ${
                isActive
                  ? "border-[#251bdf] bg-[rgba(79,70,233,0.4)] text-[#a49ff4]"
                  : "border-[#3c3c3c] bg-[rgba(135,135,135,0.1)] text-[#3c3c3c]"
              }`}
            >
              <tab.Icon className="size-6 shrink-0" />
              <span className="whitespace-nowrap text-lg font-bold">
                {tab.label}
              </span>
            </div>

            {index < TABS.length - 1 && <img src={Line} alt="" />}
          </div>
        );
      })}
    </div>
  );
}
