import { useState } from "react";

interface SidebarProps {
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogout?: () => void;
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const IconChevronLeft = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const IconChevronRight = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const IconLogOut = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 shrink-0"
      />
    );
  }

  return (
    <div
      className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center
      text-sm font-semibold bg-linear-to-br from-violet-500 to-indigo-600
      text-white ring-2 ring-white/10"
    >
      {initials}
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function Sidebar({
  user = { name: "김유저", email: "user@test-site.ai" },
  onLogout,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        relative flex flex-col h-screen
        bg-[#0e0e13] border-r border-white/6
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-17" : "w-55"}
      `}
    >
      {/* 접기/펼치기 버튼 */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-4 z-10 w-6 h-6 rounded-full
          bg-[#1a1a24] border border-white/10 flex items-center justify-center
          text-white/50 hover:text-white hover:border-white/20
          transition-all duration-200 shadow-md"
        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
      >
        {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </button>

      {/* 공간 채우기 */}
      <div className="flex-1" />

      {/* 유저 프로필 */}
      <div className="border-t border-white/6">
        <div
          className={`flex items-center gap-3 px-4 py-3.5
            ${collapsed ? "justify-center px-0!" : ""}`}
        >
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-white/80 truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-white/30 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="shrink-0 p-1.5 rounded-md text-white/25
                  hover:text-white/60 hover:bg-white/6
                  transition-all duration-150"
                aria-label="로그아웃"
              >
                <IconLogOut />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
