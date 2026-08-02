import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      emoji: "🎯",
      title: "목표를 입력하면",
      description: "AI가 자동으로 구체적인\n하루 미션을 만들어줍니다",
      color: "from-blue-400 to-blue-600"
    },
    {
      emoji: "📋",
      title: "매일 다른 미션을",
      description: "당신의 피드백에 따라\n난이도가 자동으로 조정됩니다",
      color: "from-green-400 to-green-600"
    },
    {
      emoji: "✨",
      title: "성공을 경험하세요",
      description: "작은 성공의 누적이\n큰 성장이 됩니다",
      color: "from-purple-400 to-purple-600"
    }
  ];

  const handleNext = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      navigate("/goal-setup");
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const slide = slides[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Done it</h1>
          <p className="text-gray-600">AI 맞춤 일정 추천 서비스</p>
        </div>

        {/* 슬라이드 */}
        <div
          className={`bg-gradient-to-br ${slide.color} rounded-3xl p-12 text-white text-center mb-8 min-h-96 flex flex-col justify-center`}
        >
          <div className="text-7xl mb-6">{slide.emoji}</div>
          <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg leading-relaxed whitespace-pre-line opacity-90">
            {slide.description}
          </p>
        </div>

        {/* 진행 표시 */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current ? "bg-gray-800 w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="flex-1 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← 이전
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {current === slides.length - 1 ? "시작하기 →" : "다음 →"}
          </button>
        </div>

        {/* 스킵 버튼 */}
        <button
          onClick={() => navigate("/goal-setup")}
          className="w-full mt-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-semibold"
        >
          건너뛰기
        </button>
      </div>
    </div>
  );
}