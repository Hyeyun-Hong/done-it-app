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
  const [searchParams] = useSearchParams();
  const goalId = searchParams.get("goalId");
  
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

      // 2초 후 페이지 새로고침
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

  const getActivityIcon = (activityType) => {
    const icons = {
      "영상시청": "🎥",
      "문제풀이": "📝",
      "독서": "📖",
      "작문": "✍️",
      "리스닝": "🎧",
      "스피킹": "🗣️",
      "학습": "📚",
      "복습": "🔄",
      "명상": "🧘",
      "운동": "🏃",
    };
    return icons[activityType] || "✨";
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      1: "text-green-600",
      2: "text-blue-600",
      3: "text-yellow-600",
      4: "text-orange-600",
      5: "text-red-600",
    };
    return colors[difficulty] || "text-gray-600";
  };

  if (loading) {
    return <div className="p-8 text-center">로드 중...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">🎯 오늘의 미션</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded font-semibold hover:bg-red-700 transition"
        >
          로그아웃
        </button>
      </div>

      {/* 목표 + 로드맵 정보 */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{stats.goal}</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="opacity-90">📅 현재 진행도</p>
              <p className="text-lg font-semibold">{stats.currentWeek}주차 / {Math.ceil(stats.totalDays / 7)}주</p>
            </div>
            <div>
              <p className="opacity-90">🎯 이번 주 포커스</p>
              <p className="text-lg font-semibold">{stats.weekFocus}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white border-opacity-30 flex justify-between">
            <div>
              <p className="opacity-90 text-xs">완료율</p>
              <p className="text-xl font-bold">{stats.completionRate}%</p>
            </div>
            <div>
              <p className="opacity-90 text-xs">난이도</p>
              <p className="text-xl font-bold">{"⭐".repeat(stats.currentDifficulty)}</p>
            </div>
            <div>
              <p className="opacity-90 text-xs">피드백</p>
              <p className="text-xs">
                ↓ {stats.feedbackDistribution.down} 
                | ✓ {stats.feedbackDistribution.good}
                | ↑ {stats.feedbackDistribution.up}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 오늘의 미션 */}
      {missions.length === 0 ? (
        <p className="text-center text-gray-500 py-8">미션이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id}>
              {feedbackMissionId !== mission.id && (
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-500">
                  {/* 미션 제목 + 활동 유형 */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">
                          {getActivityIcon(mission.activity_type)}
                        </span>
                        <h3 className="text-lg font-bold text-gray-800">
                          {mission.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 ml-8">
                        활동: {mission.activity_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl ${getDifficultyColor(mission.difficulty)}`}>
                        {"⭐".repeat(mission.difficulty)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">난이도 {mission.difficulty}/5</p>
                    </div>
                  </div>

                  {/* 미션 설명 (구체적인 방법) */}
                  <div className="bg-gray-50 p-4 rounded mb-4 border-l-2 border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {mission.description}
                    </p>
                  </div>

                  {/* 예상 시간 + 완료 버튼 */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-semibold">
                      ⏱️ 예상 시간: {mission.duration_minutes}분
                    </span>

                    {mission.status === "completed" ? (
                      <div className="bg-green-100 text-green-700 py-2 px-4 rounded font-semibold text-sm">
                        ✅ 완료됨
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCompleteMission(mission.id)}
                        className="bg-blue-600 text-white py-2 px-6 rounded font-semibold hover:bg-blue-700 transition"
                      >
                        완료
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 피드백 UI */}
              {feedbackMissionId === mission.id && (
                <div className="bg-yellow-50 p-6 rounded-lg shadow-md border-2 border-yellow-400">
                  <p className="mb-4 font-bold text-lg text-gray-800">
                    🎯 "{mission.title}" 어떤가요?
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    피드백을 주면 내일 미션이 더 적합한 난이도로 조정됩니다.
                  </p>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleFeedback(mission.id, "down")}
                      className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded font-semibold transition text-sm"
                    >
                      ↓ 어려웠어요 (내일 더 쉽게)
                    </button>
                    <button
                      onClick={() => handleFeedback(mission.id, "good")}
                      className="w-full bg-green-100 hover:bg-green-200 text-green-700 py-3 rounded font-semibold transition text-sm"
                    >
                      ✓ 적당해요 (내일도 비슷하게)
                    </button>
                    <button
                      onClick={() => handleFeedback(mission.id, "up")}
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded font-semibold transition text-sm"
                    >
                      ↑ 쉬웠어요 (내일 더 어렵게)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 통계 */}
      {stats && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-bold text-lg mb-4 text-gray-800">📊 통계</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-gray-600 mb-1">총 미션</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalMissions}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">완료</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedMissions}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">완료율</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}