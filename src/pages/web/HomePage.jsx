import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getPilotGoal,
  getTodayMissions,
  completeMission,
  saveMissionFeedback
} from "../../services/pilotMissionService";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goal, setGoal] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMission, setFeedbackMission] = useState(null);

  useEffect(() => {
    loadMissions();
  }, [user]);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const goalData = await getPilotGoal(user.uid);
      setGoal(goalData);

      if (goalData) {
        const missionsData = await getTodayMissions(user.uid, goalData.id);
        setMissions(missionsData);
      }
    } catch (error) {
      console.error("미션 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteMission = async (missionId) => {
    try {
      await completeMission(missionId);
      setMissions(
        missions.map((m) =>
          m.id === missionId ? { ...m, status: "completed" } : m
        )
      );
    } catch (error) {
      console.error("미션 완료 실패:", error);
    }
  };

  const handleFeedback = async (missionId, feedback) => {
    try {
      await saveMissionFeedback(missionId, goal.id, user.uid, feedback);
      setFeedbackMission(null);
      setMissions(
        missions.map((m) =>
          m.id === missionId ? { ...m, feedback } : m
        )
      );
    } catch (error) {
      console.error("피드백 저장 실패:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">미션을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            목표를 설정해주세요
          </h2>
          <button
            onClick={() => navigate("/goal-setup")}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg"
          >
            목표 설정하러 가기
          </button>
        </div>
      </div>
    );
  }

  const completedCount = missions.filter((m) => m.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6">
        <h1 className="text-3xl font-bold mb-2">{goal.title}</h1>
        <p className="text-green-100">
          오늘의 미션: {completedCount}/{missions.length}개 완료
        </p>
        <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${(completedCount / missions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 미션 목록 */}
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        {missions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>오늘의 미션이 없습니다</p>
          </div>
        ) : (
          missions.map((mission, idx) => (
            <div
              key={mission.id}
              className={`rounded-lg shadow transition ${
                mission.status === "completed"
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "bg-white hover:shadow-lg"
              } p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {idx === 0 ? "⭐" : idx === 1 ? "⭐⭐" : "⭐⭐⭐"}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800">
                      {mission.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {mission.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span>⏱️ {mission.duration_minutes}분</span>
                <span>•</span>
                <span>📊 난이도: {mission.difficulty}/3</span>
              </div>

              {mission.status === "completed" ? (
                <div className="bg-green-100 border border-green-400 p-3 rounded mb-4">
                  <p className="text-green-700 font-semibold">✅ 완료했습니다!</p>
                </div>
              ) : (
                <button
                  onClick={() => handleCompleteMission(mission.id)}
                  className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition mb-4"
                >
                  미션 완료
                </button>
              )}

              {/* 피드백 */}
              {feedbackMission === mission.id && (
                <div className="space-y-2 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700">
                    어땠나요?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFeedback(mission.id, "down")}
                      className="flex-1 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600"
                    >
                      어려웠어요 ⬇️
                    </button>
                    <button
                      onClick={() => handleFeedback(mission.id, "good")}
                      className="flex-1 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600"
                    >
                      적당했어요 👍
                    </button>
                    <button
                      onClick={() => handleFeedback(mission.id, "up")}
                      className="flex-1 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600"
                    >
                      쉬웠어요 ⬆️
                    </button>
                  </div>
                </div>
              )}

              {!feedbackMission &&
                mission.status === "completed" &&
                !mission.feedback && (
                  <button
                    onClick={() => setFeedbackMission(mission.id)}
                    className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    피드백 남기기
                  </button>
                )}

              {mission.feedback && (
                <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                  피드백:{" "}
                  {mission.feedback === "down"
                    ? "어려웠어요"
                    : mission.feedback === "good"
                    ? "적당했어요"
                    : "쉬웠어요"}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto flex justify-around p-4">
          <button className="text-green-600 font-semibold">🏠 홈</button>
          <button
            onClick={() => navigate("/stats")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            📊 통계
          </button>
          <button
            onClick={() => navigate("/mypage")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            👤 마이페이지
          </button>
        </div>
      </div>
    </div>
  );
}