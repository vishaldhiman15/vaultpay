import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { AccountsPage } from './pages/AccountsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { CardsPage } from './pages/CardsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { CompliancePage } from './pages/CompliancePage';
import { EmergencyPage } from './pages/EmergencyPage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { CryptoPage } from './pages/CryptoPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { RewardsPage } from './pages/RewardsPage';
import { WealthPage } from './pages/WealthPage';
import { VaultsPage } from './pages/VaultsPage';
import { UpiPage } from './pages/UpiPage';
import { Spinner } from './components/ui/Spinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/recover/:id" element={<RecoveryPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="upi" element={<UpiPage />} />
        <Route path="cards" element={<CardsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="ai-advisor" element={<AiAdvisorPage />} />
        <Route path="crypto" element={<CryptoPage />} />
        <Route path="rewards" element={<RewardsPage />} />
        <Route path="wealth" element={<WealthPage />} />
        <Route path="vaults" element={<VaultsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
