import React, { useState, useEffect } from "react";
import useAuthStore from "./state/authStore";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import BackgroundWrapper from "./components/layout/BackgroundWrapper";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import DatasetsPage from "./pages/Datasets/DatasetsPage";
import UploadPage from "./pages/Datasets/UploadPage";
import AuditLogsPage from "./pages/AuditLogs/AuditLogsPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import AdminPage from "./pages/Admin/AdminPanelPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";

export default function App() {
  const {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    init,
    loading,
  } = useAuthStore();

  const [currentPage, setCurrentPage] = useState("login");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 🔹 Sidebar toggle state

  // 🔹 Initialize auth listener
  useEffect(() => {
    init();
  }, [init]);

  // 🔹 Role-based access check
  const hasPermission = (requiredRoles) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // 🔹 Auto-redirect after login based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") setCurrentPage("admin");
      else if (user.role === "reviewer") setCurrentPage("audit");
      else setCurrentPage("dashboard");
    }
  }, [isAuthenticated, user]);

  // 🔹 Page routing
  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "datasets":
        return <DatasetsPage />;
      case "upload":
        return <UploadPage />;
      case "audit":
        return <AuditLogsPage />;
      case "profile":
        return <ProfilePage />;
      case "admin":
        return <AdminPage />;
      default:
        return <DashboardPage />;
    }
  };

  // 🔹 Authenticated layout
  const renderAuthenticatedLayout = () => (
    <BackgroundWrapper>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          hasPermission={hasPermission}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <Header
            onLogout={logout}
            user={user}
            onToggleSidebar={() => setIsSidebarOpen(true)}
          />
          <main className="flex-1 p-6 overflow-y-auto">{renderPage()}</main>
        </div>
      </div>
    </BackgroundWrapper>
  );

  // 🔹 Unauthenticated layout
  const renderAuthFlow = () => (
    <BackgroundWrapper>
      <div className="flex items-center justify-center min-h-screen">
        {currentPage === "signup" ? (
          <SignupPage
            onSignup={(name, email, password, role) =>
              signup(name, email, password, role)
            }
            onLoginClick={() => setCurrentPage("login")}
          />
        ) : (
          <LoginPage
            onLogin={login}
            onSignupClick={() => setCurrentPage("signup")}
          />
        )}
      </div>
    </BackgroundWrapper>
  );

  // 🔹 Final render logic
  if (loading) {
    return (
      <BackgroundWrapper>
        <div className="flex items-center justify-center min-h-screen text-cyan-300">
          Loading...
        </div>
      </BackgroundWrapper>
    );
  }

  return isAuthenticated ? renderAuthenticatedLayout() : renderAuthFlow();
}