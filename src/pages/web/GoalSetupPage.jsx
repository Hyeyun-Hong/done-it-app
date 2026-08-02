import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createPilotGoal } from "../../services/pilotMissionService";

export default function GoalSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    goal: "",
    category: "운동",
    duration_weeks: 4,
    current_level: "초급",
    constraints: ""
  });

  const categories = [
    { value: "운동", label: "🏋️ 운동" },
    { value: "공부", label: "📚 공부" },
    { value: "언어", label: "🌐 언어" },
    { value: "취업", label: "💼 취업" },
    { value: "자기계발", label: "🌟 자기계발" },
    { value: "예술", label: "🎨 예술" },
    { value: "건강", label: "❤️ 건강" }
  ];

  const levels = [
    { value: "초급", label: "초급 (경험 없음)" },
    { value: "중급", label: "중급 (약간의 경험)" },
    { value: "고급", label: "고급 (경험 많음)" }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.goal.trim()) {
        throw new Error("목표를 입력해주세요");
      }

      console.log("📤 Claude API 요청 중...", formData);

      const response = await fetch("/api/generateMissionsAI", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "미션 생성에 실패했습니다");
      }

      const aiResult = await response.json();
      console.log("✅ Claude 응답:", aiResult);

      const goalId = await createPilotGoal(user.uid, {
        title: formData.goal,
        description: `${formData.category} - ${formData.current_level} 수준`,
        category: formData.category,
        duration_months: formData.duration_weeks / 4,
        current_level: formData.current_level,
        constraints: formData.constraints,
        roadmap: aiResult.roadmap,
        missions: aiResult.missions
      });

      console.log("🎉 목표 생성 완료:", goalId);
      navigate("/home");
    } catch (err) {
      console.error("❌ 에러:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-md mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/onboarding")}
            className="text-gray-600 hover:text-gray-800 mb-4 font-semibold"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            목표를 설정하세요
          </h1>
          <p className="text-gray-600">
            AI가 자동으로 맞춤 미션을 만들어드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 목표 입력 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📌 당신의 목표는?
            </label>
            <input
              type="text"
              placeholder="예: 체지방 3% 감량, Python 배우기, TOEFL 900점"
              value={formData.goal}
              onChange={(e) =>
                setFormData({ ...formData, goal: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
              disabled={loading}
              maxLength={100}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🏷️ 카테고리
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  disabled={loading}
                  className={`py-3 px-4 rounded-lg font-semibold transition ${
                    formData.category === cat.value
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 기간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⏱️ 목표 기간
            </label>
            <select
              value={formData.duration_weeks}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duration_weeks: parseInt(e.target.value)
                })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              disabled={loading}
            >
              <option value={2}>2주</option>
              <option value={4}>4주 (1개월)</option>
              <option value={8}>8주 (2개월)</option>
              <option value={12}>12주 (3개월)</option>
              <option value={24}>24주 (6개월)</option>
            </select>
          </div>

          {/* 현재 수준 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📊 현재 수준
            </label>
            <div className="space-y-2">
              {levels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, current_level: level.value })
                  }
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition text-left ${
                    formData.current_level === level.value
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* 제약사항 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ⚠️ 제약사항 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 하루 1시간만 가능, 장비 없음"
              value={formData.constraints}
              onChange={(e) =>
                setFormData({ ...formData, constraints: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition"
              disabled={loading}
              maxLength={50}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-semibold">오류 발생</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                AI가 미션을 만드는 중...
              </span>
            ) : (
              "✨ 맞춤 미션 생성하기"
            )}
          </button>
        </form>

        {/* 안내 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-700">
            💡 AI가 당신의 목표를 분석해서 구체적인 일일 미션을 자동으로
            만들어드립니다!
          </p>
        </div>
      </div>
    </div>
  );
}