import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthChange } from "./services/authService";
import { useAuthStore } from "./store/authStore";
import { getPilotGoals } from "./services/pilotMissionService";

import LoginPage from "./pages/LoginPage";
import PilotGoalSetupPage from "./pages/PilotGoalSetupPage";
import PilotGoalsPage from "./pages/PilotGoalsPage";
import PilotMissionsPage from "./pages/PilotMissionsPage";

function App() {
  const { user, setUser, setLoading } = useAuthStore();
  const [hasGoals, setHasGoals] = useState(null);

  useEffect(() => {
    const checkGoals = async (userId) => {
      console.log("🔍 checkGoals 호출, userId:", userId);
      try {
        const goals = await getPilotGoals(userId);
        console.log("📋 목표 조회 결과:", goals.length, "개");
        setHasGoals(goals.length > 0);
      } catch (error) {
        console.error("❌ checkGoals 에러:", error);
        setHasGoals(false);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      if (user) {
        checkGoals(user.uid);
      } else {
        setHasGoals(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [setUser, setLoading, setHasGoals]);

  if (hasGoals === null && user) {
    return <div className="p-8 text-center">로드 중...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={hasGoals ? "/pilot-goals" : "/pilot-goal-setup"} /> : <LoginPage />}
        />
        
        <Route
          path="/pilot-goal-setup"
          element={user ? <PilotGoalSetupPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/pilot-goals"
          element={user && hasGoals ? <PilotGoalsPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/pilot-missions"
          element={user ? <PilotMissionsPage /> : <Navigate to="/login" />}
        />

        <Route 
          path="/" 
          element={user ? <Navigate to={hasGoals ? "/pilot-goals" : "/pilot-goal-setup"} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;