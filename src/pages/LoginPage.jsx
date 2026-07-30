import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { signup, login } from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let user;
      if (isSignup) {
        user = await signup(email, password, email.split("@")[0]);
      } else {
        user = await login(email, password);
      }
      setUser(user);
      navigate("/pilot-goal-setup");
    } catch (err) {
      setError(err.message || "인증 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Done it</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
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
            {loading
              ? "처리 중..."
              : isSignup
              ? "회원가입"
              : "로그인"}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-900"
        >
          {isSignup ? "로그인으로 돌아가기" : "회원가입하기"}
        </button>
      </div>
    </div>
  );
}