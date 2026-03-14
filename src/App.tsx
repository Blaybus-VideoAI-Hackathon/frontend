import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/ui/SideBar";
import MainPage from "./pages/MainPage";

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
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
