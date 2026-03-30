import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import ToastContainer from "./components/ui/ToastContainer";
import DashboardPage from "./pages/DashboardPage";
import BoardPage from "./pages/BoardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter >
      <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>

        <Sidebar />

        {/* Mobile sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>


      <ToastContainer />
    </BrowserRouter>
  );
}
