import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/ui/SideBar";
import Modal from "./components/ui/Modal";
import MainPage from "./pages/MainPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import VideoCompletePage from "./pages/VideoCompletePage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar
          user={{ name: "김유저", email: "user@test-site.ai" }}
          onLogout={() => console.log("로그아웃")}
        />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/projects/new" element={<CreateProjectPage />} />
            <Route path="/projects/complete" element={<VideoCompletePage />} />
          </Routes>
        </main>
      </div>
      <Modal />
    </BrowserRouter>
  );
}

export default App;
