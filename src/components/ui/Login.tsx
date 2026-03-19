import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import useAuthStore from "../../store/Authstore";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!id.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/auth/login", {
        username: id,
        password,
      });

      const { token, user } = response.data;
      setAuth(token, user);
      navigate("/");
    } catch (err) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message
          : undefined;
      setError(message || "로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 px-8 py-10">
        {/* 로고 / 타이틀 영역 */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            로그인
          </h1>
        </div>

        {/* 아이디 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            아이디
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="아이디를 입력하세요"
            className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition duration-150"
          />
        </div>

        {/* 비밀번호 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="비밀번호를 입력하세요"
            className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition duration-150"
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p className="mb-4 text-sm text-red-500 text-center">{error}</p>
        )}

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300
            text-white text-sm font-semibold rounded-lg
            transition duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </div>
    </div>
  );
}
