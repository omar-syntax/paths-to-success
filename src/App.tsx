import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LangProvider } from "@/contexts/LangContext";
import Chatbot from "@/components/Chatbot";

// Layouts
import { StudentLayout } from "@/components/layout/StudentLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public Pages
import Index from "@/pages/Index";

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";

// Student Pages
import StudentHomePage from "@/pages/student/StudentHomePage";
import MyProjectsPage from "@/pages/student/MyProjectsPage";
import NotificationsPage from "@/pages/student/NotificationsPage";
import ProfilePage from "@/pages/student/ProfilePage";

// Admin Pages
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProjectsPage from "@/pages/admin/AdminProjectsPage";
import AddProjectPage from "@/pages/admin/AddProjectPage";
import RegistrantsPage from "@/pages/admin/RegistrantsPage";
import StatisticsPage from "@/pages/admin/StatisticsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'student' | 'admin' }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/student'} /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/student" /> : <SignupPage />} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
        <Route index element={<StudentHomePage />} />
        <Route path="my-projects" element={<MyProjectsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="projects/new" element={<AddProjectPage />} />
        <Route path="registrants" element={<RegistrantsPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
              <Chatbot />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
