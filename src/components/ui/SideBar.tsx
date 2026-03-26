import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosInstance } from "../../api/axiosInstance";

interface Project {
  id: number;
  title: string;
}

interface SidebarProps {
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const IconMenu = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconPencil = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconFolder = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ user = { name: "user 01" } }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState<Project[]>([]);

  const [isHovering, setIsHovering] = useState(false);

  // 현재 URL에서 projectId 추출
  const match = location.pathname.match(/\/projects\/(\d+)/);
  const currentProjectId = match ? Number(match[1]) : null;

  // expandedProjectId를 URL에서 직접 초기화 (effect 내 동기 setState 불필요)
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(
    currentProjectId,
  );

  // 프로젝트 목록 조회 — effect는 inline, 이벤트 핸들러용은 useCallback
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get<{ data: Project[] }>(
          "/api/projects",
        );
        setProjects(res.data?.data ?? []);
      } catch {
        // 조회 실패 시 빈 목록 유지
      }
    };
    void load();
  }, [location.pathname]);

  const handleToggleProject = (projectId: number) => {
    if (expandedProjectId === projectId) {
      setExpandedProjectId(null);
    } else {
      setExpandedProjectId(projectId);
    }
    const project = projects.find((p) => p.id === projectId);
    navigate(`/projects/${projectId}`, {
      state: { projectTitle: project?.title },
    });
  };

  const handleCreateProject = () => {
    navigate("/");
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await axiosInstance.delete(`/api/projects/${projectId}`);
      // navigate 전에 state 업데이트하여 refetch에 의한 덮어쓰기 방지
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      navigate("/");
    } catch (err) {
      console.error("프로젝트 삭제 실패:", err);
    }
  };

  return (
    <aside
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`flex flex-col h-screen bg-[#1e1e24] border-r border-white/8 shrink-0 transition-all duration-300 ease-in-out ${isHovering ? "w-55" : "w-14"} whitespace-nowrap`}
    >
      {/* 햄버거 메뉴 */}
      <div className="px-4 pt-5 pb-3">
        <button className="text-white/50 hover:text-white/80 transition-colors">
          <IconMenu />
        </button>
      </div>

      {/* 네비게이션 + 프로젝트 목록 + 유저 프로필 */}
      <nav
        className={`flex flex-col gap-1 mt-1 ${isHovering ? "px-3" : "px-2"}`}
      >
        <button
          onClick={handleCreateProject}
          className={`flex items-center py-2 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/5 transition-all duration-300 ${
            isHovering ? "gap-1 px-3" : "justify-center px-2"
          }`}
        >
          <IconPencil />

          <span
            className={`
      whitespace-nowrap overflow-hidden
      transition-all duration-300
      ${isHovering ? "opacity-100 translate-x-0 w-auto ml-2" : "opacity-0 -translate-x-2 w-0"}
    `}
          >
            프로젝트 생성
          </span>
        </button>

        <button
          className={`flex items-center py-2 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/5 transition-all duration-300 ${
            isHovering ? "gap-1 px-3" : "justify-center px-2"
          }`}
        >
          <IconFolder />
          <span
            className={`
      whitespace-nowrap overflow-hidden
      transition-all duration-300
      ${isHovering ? "opacity-100 translate-x-0 w-auto ml-2" : "opacity-0 -translate-x-2 w-0"}
    `}
          >
            프로젝트 목록
          </span>
        </button>
      </nav>

      {/* 프로젝트 목록 (열렸을 때만) */}
      {isHovering && (
        <>
          <div className="mt-3 flex-1 overflow-y-auto px-3 flex flex-col gap-0.5">
            {projects.map((project) => {
              const isActive = project.id === currentProjectId;

              return (
                <div key={project.id}>
                  <div
                    onClick={() => handleToggleProject(project.id)}
                    className={`
      group flex items-center justify-between
      pl-4 pr-3 py-2 rounded-lg text-[13px] font-medium
      transition-all duration-300 cursor-pointer
      ${
        isActive
          ? "bg-[#4c3f8a] text-white"
          : "text-white/55 hover:bg-[#4c3f8a]/40"
      }
    `}
                  >
                    {/* 제목 */}
                    <span
                      className={`
        truncate whitespace-nowrap overflow-hidden
        transition-all duration-300
        ${isHovering ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}
      `}
                    >
                      {project.title}
                    </span>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 유저 프로필 */}
          <div className="border-t border-white/8 px-4 py-3.5 flex items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#3a3a4f] shrink-0 flex items-center justify-center text-white/50 text-xs font-semibold">
                {user.name[0]}
              </div>
            )}
            <span className="text-[13px] text-white/70 truncate">
              {user.name}
            </span>
          </div>
        </>
      )}
    </aside>
  );
}
