import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { logout } from "../services/authService";
import {
  generateAndSaveTodayMissions,
  getTodayMissions,
  completeMission,
  saveMissionFeedback,
  getPilotStats,
} from "../services/pilotMissionService";

import { useSearchParams } from "react-router-dom";

export default function PilotMissionsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { logout: logoutStore } = useAuthStore();
  const [searchParams] = useSearchParams();  // ← 추가!
  const goalId = searchParams.get("goalId");  // ← 쿼리 파라미터에서 goalId 받기
  
  const [missions, setMissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMissionId, setFeedbackMissionId] = useState(null);

  useEffect(() => {
    loadMissions();
  }, [user?.uid]);

  const loadMissions = async () => {
    try {
      const todayMissions = await getTodayMissions(user.uid, goalId);

      if (todayMissions.length === 0) {
  await generateAndSaveTodayMissions(user.uid, goalId);
        const newMissions = await getTodayMissions(user.uid, goalId);
        setMissions(newMissions);
      } else {
        setMissions(todayMissions);
      }

      const statsData = await getPilotStats(user.uid);
      setStats(statsData);
      
    } catch (error) {
      console.error("Failed to load missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMission = async (missionId) => {
    try {
      await completeMission(missionId);
      setMissions(prev =>
        prev.map(m =>
          m.id === missionId ? { ...m, status: "completed" } : m
        )
      );
      setFeedbackMissionId(missionId);
    } catch (error) {
      console.error("Failed to complete mission:", error);
    }
  };

  const handleFeedback = async (missionId, feedbackType) => {
    try {
      await saveMissionFeedback(missionId, goalId, user.uid, feedbackType);
      setFeedbackMissionId(null);
      
      const updatedStats = await getPilotStats(user.uid);
      setStats(updatedStats);
    } catch (error) {
      console.error("Failed to save feedback:", error);
    }
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
    <div className="max-w-2xl mx-auto p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">오늘의 미션</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded font-semibold hover:bg-red-700 transition"
        >
          로그아웃
        </button>
      </div>

      {stats && (
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg mb-8">
          <p className="text-sm text-gray-700">
            📊 <strong>{stats.goal}</strong> | 
            난이도: <strong>{stats.currentDifficulty}/5</strong> |
            완료율: <strong>{stats.completionRate}%</strong>
          </p>
        </div>
      )}

      {missions.length === 0 ? (
        <p className="text-center text-gray-500">미션이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id}>
              {feedbackMissionId !== mission.id && (
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{mission.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {mission.description}
                      </p>
                    </div>
                    <span className="text-2xl">
                      {"⭐".repeat(mission.difficulty)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      예상 시간: {mission.duration_minutes}분
                    </span>

                    {mission.status === "completed" ? (
                      <div className="bg-green-100 text-green-700 py-1 px-3 rounded font-semibold text-sm">
                        ✓ 완료됨
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteMission(mission.id)}
                        className="bg-blue-600 text-white py-1 px-4 rounded font-semibold hover:bg-blue-700 transition text-sm"
                      >
                        완료
                      </button>
                    )}
                  </div>
                </div>
              )}

              {feedbackMissionId === mission.id && (
                <div className="bg-yellow-100 p-6 rounded-lg shadow-md border-2 border-yellow-400">
                  <p className="mb-4 font-semibold text-lg">
                    "{mission.title}" 어떤가요?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFeedback(mission.id, "down")}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded font-semibold transition"
                    >
                      어려웠어요 ↓
                    </button>
                    <button
                      onClick={() => handleFeedback(mission.id, "good")}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded font-semibold transition"
                    >
                      적당해요 ✓
                    </button>
                    <button
                      onClick={() => handleFeedback(mission.id, "up")}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded font-semibold transition"
                    >
                      쉬웠어요 ↑
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div className="mt-8 bg-indigo-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-3">📊 오늘의 통계</h3>
          <div className="text-sm space-y-2">
            <p>완료한 미션: {stats.completedMissions}/{stats.totalMissions}</p>
            <p>
              피드백: 
              어려움 {stats.feedbackDistribution.down} | 
              적당 {stats.feedbackDistribution.good} | 
              쉬움 {stats.feedbackDistribution.up}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}