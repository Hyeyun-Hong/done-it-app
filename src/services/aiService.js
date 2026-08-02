/**
 * 난이도 계산 (피드백 기반)
 */
export const calculateDifficulty = (feedbackHistory) => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return 2; // 기본값
  }

  const recentFeedback = feedbackHistory.slice(-3);
  let score = 0;

  recentFeedback.forEach(feedback => {
    if (feedback === "down") score -= 1;
    else if (feedback === "good") score += 0;
    else if (feedback === "up") score += 1;
  });

  const avgScore = score / recentFeedback.length;
  let difficulty = 2;

  if (avgScore <= -0.5) {
    difficulty = Math.max(1, difficulty - 1);
  } else if (avgScore >= 0.5) {
    difficulty = Math.min(3, difficulty + 1);
  }

  return difficulty;
};

/**
 * Claude AI로 미션 생성 (Vercel 백엔드 사용)
 */
export const generateMissionsAI = async (goalInfo) => {
  try {
    console.log("📤 Claude API 요청 중...", goalInfo);

    const response = await fetch("/api/generateMissionsAI", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(goalInfo)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Claude API 호출 실패");
    }

    const result = await response.json();
    console.log("✅ Claude API 응답:", result);
    
    return result;
  } catch (error) {
    console.error("❌ generateMissionsAI 에러:", error);
    throw error;
  }
};

/**
 * 난이도별 미션 선택 (하드코딩 방식 - 필요시 사용)
 */
export const selectMissionsByDifficulty = (missions, difficulty) => {
  return missions[difficulty] || missions[2];
};