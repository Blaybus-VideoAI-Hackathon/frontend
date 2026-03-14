import { useState } from "react";
import StoryIcon from "../../assets/icons/story.svg?react";
import CutIcon from "../../assets/icons/cut.svg?react";
import ImageIcon from "../../assets/icons/image.svg?react";
import VideoIcon from "../../assets/icons/video.svg?react";
import FinishIcon from "../../assets/icons/finish.svg?react";
import Line from "../../assets/line.svg";

type TabId = "story" | "cut" | "image" | "video" | "finish";

const TABS: {
  id: TabId;
  label: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  { id: "story", label: "스토리 기획", Icon: StoryIcon },
  { id: "cut", label: "컷 설계", Icon: CutIcon },
  { id: "image", label: "이미지 생성", Icon: ImageIcon },
  { id: "video", label: "동영상 생성", Icon: VideoIcon },
  { id: "finish", label: "최종 완성", Icon: FinishIcon },
];

type StepTabsProps = {
  defaultTab?: TabId;
  onChange?: (tab: TabId) => void;
};

export default function StepTabs({
  defaultTab = "story",
  onChange,
}: StepTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const handleClick = (id: TabId) => {
    setActiveTab(id);
    onChange?.(id);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {TABS.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <div key={tab.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => handleClick(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 px-6 py-5 rounded-lg border transition-colors cursor-pointer ${
                isActive
                  ? "bg-[rgba(79,70,233,0.4)] border-[#251bdf] text-[#a49ff4]"
                  : "bg-[rgba(135,135,135,0.1)] border-[#3c3c3c] text-[#3c3c3c] hover:bg-[rgba(135,135,135,0.15)]"
              }`}
            >
              <tab.Icon className="size-6 shrink-0" />
              <span className="font-bold text-lg whitespace-nowrap">
                {tab.label}
              </span>
            </button>
            {index < TABS.length - 1 && <img src={Line} />}
          </div>
        );
      })}
    </div>
  );
}
