import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/ui/SideBar";
import Modal from "./components/ui/Modal";
import MainPage from "./pages/MainPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import VideoCompletePage from "./pages/VideoCompletePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<MainPage />} />
                  <Route
                    path="/projects/:projectId"
                    element={<CreateProjectPage />}
                  />
                  <Route
                    path="/projects/complete"
                    element={<VideoCompletePage />}
                  />
                </Routes>
              </main>
              <Modal />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
