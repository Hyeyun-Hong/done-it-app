import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pilot (설문조사용)
import PilotGoalSetupPage from "./pages/pilot/PilotGoalSetupPage";
import PilotMissionsPage from "./pages/pilot/PilotMissionsPage";

// Web (공모전용)
import OnboardingPage from "./pages/web/OnboardingPage";
import GoalSetupPage from "./pages/web/GoalSetupPage";
import HomePage from "./pages/web/HomePage";
import StatsPage from "./pages/web/StatsPage";
import MyPage from "./pages/web/MyPage";

// Auth
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 인증 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 파일럿 - 설문조사용 */}
          <Route path="/pilot/setup" element={<PilotGoalSetupPage />} />
          <Route path="/pilot/missions" element={<PilotMissionsPage />} />

          {/* 웹 - 공모전용 */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/goal-setup" element={<GoalSetupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/mypage" element={<MyPage />} />

          {/* 기본 */}
          <Route path="/" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}