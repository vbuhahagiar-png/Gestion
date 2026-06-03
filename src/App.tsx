import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { AppLayout } from './components/Layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { ChildDashboard } from './pages/ChildDashboard';
import { ParentDashboard } from './pages/ParentDashboard';
import { WalletPage } from './pages/WalletPage';
import { ChoresPage } from './pages/ChoresPage';
import { GoalsPage } from './pages/GoalsPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireParent?: boolean }> = ({
  children,
  requireParent = false,
}) => {
  const { currentUser, isParentUnlocked } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }
    if (requireParent && (!isParentUnlocked || currentUser.type !== 'parent')) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, isParentUnlocked, requireParent, navigate]);

  if (!currentUser) return null;
  if (requireParent && (!isParentUnlocked || currentUser.type !== 'parent')) return null;

  return <>{children}</>;
};

const ChildRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    } else if (currentUser.type !== 'child') {
      navigate('/parent', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.type !== 'child') return null;
  return <>{children}</>;
};

function App() {
  const { currentUser, isParentUnlocked } = useStore();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          currentUser ? (
            currentUser.type === 'parent' && isParentUnlocked ? (
              <Navigate to="/parent" replace />
            ) : currentUser.type === 'child' ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* App Layout wrapper */}
      <Route element={<AppLayout />}>
        {/* Child routes */}
        <Route
          path="/dashboard"
          element={
            <ChildRoute>
              <ChildDashboard />
            </ChildRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ChildRoute>
              <WalletPage />
            </ChildRoute>
          }
        />
        <Route
          path="/chores"
          element={
            <ChildRoute>
              <ChoresPage />
            </ChildRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ChildRoute>
              <GoalsPage />
            </ChildRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ChildRoute>
              <AchievementsPage />
            </ChildRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MarketplacePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Parent route */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute requireParent>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
