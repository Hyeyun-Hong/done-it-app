import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function MyPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6">
        <h1 className="text-3xl font-bold">마이페이지</h1>
      </div>

      {/* 프로필 */}
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">👤 프로필</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">이메일</p>
              <p className="text-gray-800 font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">가입일</p>
              <p className="text-gray-800 font-semibold">
                {new Date(user?.metadata?.creationTime).toLocaleDateString(
                  "ko-KR"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 설정 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⚙️ 설정</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition">
              🔔 알림 설정
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition">
              📋 약관 및 개인정보
            </button>
            <button className="w-full text-left p-3 hover:bg-gray-50 rounded transition">
              💬 피드백 보내기
            </button>
          </div>
        </div>

        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
        >
          로그아웃
        </button>

        {/* 앱 정보 */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>Done it v1.0.0</p>
          <p>© 2024 Done it. All rights reserved.</p>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto flex justify-around p-4">
          <button
            onClick={() => navigate("/home")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            🏠 홈
          </button>
          <button
            onClick={() => navigate("/stats")}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            📊 통계
          </button>
          <button className="text-purple-600 font-semibold">👤 마이페이지</button>
        </div>
      </div>
    </div>
  );
}