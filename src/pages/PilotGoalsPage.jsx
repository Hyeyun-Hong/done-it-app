import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getPilotGoals } from "../services/pilotMissionService";
import { logout } from "../services/authService";

export default function PilotGoalsPage() {
  const { user } = useAuthStore();
  const { logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, [user?.uid]);

  const loadGoals = async () => {
    try {
      const userGoals = await getPilotGoals(user.uid);
      setGoals(userGoals);
      console.log("📋 목표 로드됨:", userGoals.length, "개");
    } catch (error) {
      console.error("Failed to load goals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalClick = (goalId) => {
    navigate(`/pilot-missions?goalId=${goalId}`);
  };

  const handleNewGoal = () => {
    navigate("/pilot-goal-setup");
  };

  const handleLogout = async () => {
    try {
      await logout();
      logoutStore();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">로드 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">내 목표들</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded font-semibold hover:bg-red-700 transition"
          >
            로그아웃
          </button>
        </div>

        {/* 목표 목록 */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 mb-4">아직 설정한 목표가 없습니다.</p>
            <button
              onClick={handleNewGoal}
              className="bg-blue-600 text-white py-2 px-6 rounded font-semibold hover:bg-blue-700 transition"
            >
              + 첫 목표 설정하기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map(goal => (
              <div
                key={goal.id}
                onClick={() => handleGoalClick(goal.id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{goal.title}</h2>
                    <p className="text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📊 테마: {goal.theme}</span>
                      <span>⏱️ 기간: {goal.duration_months}개월</span>
                      <span>⭐ 난이도: {goal.current_difficulty}/5</span>
                    </div>
                  </div>
                  <span className="text-3xl">→</span>
                </div>
              </div>
            ))}

            
          </div>
        )}
      </div>
    </div>
  );
}