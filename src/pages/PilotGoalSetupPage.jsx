import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { createPilotGoal } from "../services/pilotMissionService";

export default function PilotGoalSetupPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [goal, setGoal] = useState({
    title: "",
    description: "",
    theme: "공부",
    duration_months: 3,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const themes = ["운동", "공부", "자기계발", "언어"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal(prev => ({
      ...prev,
      [name]: name === "duration_months" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createPilotGoal(user.uid, goal);
      navigate("/pilot-missions");
    } catch (err) {
      setError(err.message || "목표 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Done it 파일럿</h1>
        <p className="text-center text-gray-600 mb-8">1주일 테스트 시작</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              목표 테마
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setGoal(prev => ({ ...prev, theme }))}
                  className={`py-2 px-3 rounded-lg font-semibold transition ${
                    goal.theme === theme
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              목표 (구체적으로)
            </label>
            <input
              type="text"
              name="title"
              value={goal.title}
              onChange={handleChange}
              placeholder="예: 토익 900점 달성"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              목표 설명
            </label>
            <input
              type="text"
              name="description"
              value={goal.description}
              onChange={handleChange}
              placeholder="예: 영어 실력 향상"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              실제 목표 기간: {goal.duration_months}개월
            </label>
            <input
              type="range"
              name="duration_months"
              min="1"
              max="12"
              step="1"
              value={goal.duration_months}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              1주일 테스트이지만, 실제 목표 달성까지의 기간을 입력해주세요.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "목표 생성 중..." : "시작하기"}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          💡 TIP: 1주일 테스트 후 이 앱이 효과적인지 평가합니다.
        </p>
      </div>
    </div>
  );
}