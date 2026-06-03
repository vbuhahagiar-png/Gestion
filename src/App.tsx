import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { ToastProvider } from './components/UI/Toast';

// Layout
import { ParentShell, ChildShell } from './components/Layout/AppShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';

// Parent pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { TasksPage } from './pages/parent/TasksPage';
import { ChildrenPage } from './pages/parent/ChildrenPage';
import { CalendarPage } from './pages/parent/CalendarPage';
import { ShoppingListPage } from './pages/parent/ShoppingListPage';
import { SettingsPage } from './pages/parent/SettingsPage';

// Child pages
import { ChildDashboard } from './pages/child/ChildDashboard';
import { MyTasksPage } from './pages/child/MyTasksPage';
import { MyWalletPage } from './pages/child/MyWalletPage';
import { MyBadgesPage } from './pages/child/MyBadgesPage';
import { ChildCalendarPage } from './pages/child/CalendarPage';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const RootRedirect: React.FC = () => {
  const { isAuthenticated, currentUser } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  if (currentUser?.role === 'parent') return <Navigate to="/parent" replace />;
  if (currentUser?.role === 'child') return <Navigate to={`/child/${currentUser.id}`} replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter basename="/Gestion">
      <ToastProvider>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Parent routes */}
          <Route path="/parent" element={<PrivateRoute><ParentShell /></PrivateRoute>}>
            <Route index element={<ParentDashboard />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="children" element={<ChildrenPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="shopping" element={<ShoppingListPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Child routes */}
          <Route path="/child/:childId" element={<PrivateRoute><ChildShell /></PrivateRoute>}>
            <Route index element={<ChildDashboard />} />
            <Route path="tasks" element={<MyTasksPage />} />
            <Route path="wallet" element={<MyWalletPage />} />
            <Route path="badges" element={<MyBadgesPage />} />
            <Route path="calendar" element={<ChildCalendarPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
