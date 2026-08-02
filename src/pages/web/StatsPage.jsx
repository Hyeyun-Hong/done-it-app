import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getPilotStats } from "../../services/pilotMissionService";
import { useEffect, useState } from "react";

export default function StatsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const statsData = await getPilotStats(user.uid);
      setStats(statsData);
    } catch (error) {
      console.error("통계 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">통계를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">통계</h1>
      </div>

      {stats ? (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
          {/* 목표 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              📌 {stats.goal}
            </h2>
            <p className="text-sm text-gray-600">
              현재 난이도: ⭐ {stats.currentDifficulty}/3
            </p>
          </div>

          {/* 완료율 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📊 완료율
            </h3>
            <div className="text-4xl font-bold text-green-600 mb-3">
              {stats.completionRate}%
            </div>
            <div className="bg-gray-200 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.completionRate}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {stats.completedMissions} / {stats.totalMissions}개 미션 완료
            </p>
          </div>

          {/* 피드백 분포 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              💬 피드백 분포
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">어려웠어요 ⬇️</span>
                  <span className="font-bold">{stats.feedbackDistribution.down}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((stats.feedbackDistribution.down +
                          stats.feedbackDistribution.good +
                          stats.feedbackDistribution.up) >
                        0
                          ? (stats.feedbackDistribution.down /
                              (stats.feedbackDistribution.down +
                                stats.feedbackDistribution.good +
                                stats.feedbackDistribution.up)) *
                            100
                          : 0) || 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">적당했어요 👍</span>
                  <span className="font-bold">{stats.feedbackDistribution.good}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((stats.feedbackDistribution.down +
                          stats.feedbackDistribution.good +
                          stats.feedbackDistribution.up) >
                        0
                          ? (stats.feedbackDistribution.good /
                              (stats.feedbackDistribution.down +
                                stats.feedbackDistribution.good +
                                stats.feedbackDistribution.up)) *
                            100
                          : 0) || 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">쉬웠어요 ⬆️</span>
                  <span className="font-bold">{stats.feedbackDistribution.up}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{
                      width: `${
                        ((stats.feedbackDistribution.down +
                          stats.feedbackDistribution.good +
                          stats.feedbackDistribution.up) >
                        0
                          ? (stats.feedbackDistribution.up /
                              (stats.feedbackDistribution.down +
                                stats.feedbackDistribution.good +
                                stats.feedbackDistribution.up)) *
                            100
                          : 0) || 0
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>아직 데이터가 없습니다</p>
        </div>
      )}

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto flex justify-around p-4">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            🏠 홈
          </button>
          <button className="text-blue-600 font-semibold">📊 통계</button>
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