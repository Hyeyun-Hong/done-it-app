
/**
 * 목표 분석 (로컬 API 호출)
 */
export const analyzeGoal = async (goal) => {
  try {
    const response = await fetch("/api/analyzeGoal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ goal }),
    });
 
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
 
    const data = await response.json();
    console.log("📊 목표 분석 완료:", data);
    return data;
  } catch (error) {
    console.error("Goal analysis error:", error);
    return getDefaultGoalAnalysis(goal);
  }
};
 
/**
 * 로드맵 생성 (로컬 API 호출)
 */
export const generateRoadmap = async (goal, durationMonths, goalAnalysis) => {
  try {
    const response = await fetch("/api/generateRoadmap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ goal, durationMonths, goalAnalysis }),
    });
 
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
 
    const data = await response.json();
    console.log("🗺️ 로드맵 생성 완료:", data.roadmap.length, "주");
    return data.roadmap;
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return getDefaultRoadmap(durationMonths);
  }
};
 
/**
 * 미션 생성 (로컬 API 호출)
 */
export const generateMissions = async (
  goal,
  roadmap,
  currentWeek,
  previousMissions,
  difficulty = 2,
  goalAnalysis = null
) => {
  try {
    const response = await fetch("/api/generateMissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        goal,
        roadmap,
        currentWeek,
        previousMissions,
        difficulty,
        goalAnalysis,
      }),
    });
 
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
 
    const data = await response.json();
    console.log("✅ 미션 생성 완료:", data.missions.length, "개");
    return data.missions;
  } catch (error) {
    console.error("Mission generation error:", error);
    return getDefaultMissions(goal, difficulty);
  }
};
 
/**
 * 난이도 자동 조정
 */
export const calculateAdjustedDifficulty = (feedbackHistory) => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return 2;
  }
 
  const recentFeedback = feedbackHistory.slice(-3);
 
  let score = 0;
  recentFeedback.forEach((feedback) => {
    if (feedback === "down") score -= 1;
    else if (feedback === "good") score += 0;
    else if (feedback === "up") score += 1;
  });
 
  const avgScore = score / recentFeedback.length;
 
  let baseDifficulty = 2;
 
  if (avgScore <= -0.5) {
    baseDifficulty = Math.max(1, baseDifficulty - 1);
  } else if (avgScore >= 0.5) {
    baseDifficulty = Math.min(5, baseDifficulty + 1);
  }
 
  return baseDifficulty;
};
 
/**
 * 기본값
 */
function getDefaultGoalAnalysis(goal) {
  return {
    goal_type: "일반",
    specific_goal: goal,
    estimated_weeks: 4,
    strategies: ["기초부터 시작", "점진적 난이도 상향", "꾸준한 반복"],
    key_metrics: "매일 체크",
    pitfalls: ["포기"],
    difficulty_analysis: "점진적",
  };
}
 
function getDefaultRoadmap(durationMonths) {
  const weeksTotal = durationMonths * 4;
  const roadmap = [];
 
  for (let i = 1; i <= weeksTotal; i++) {
    const phase = Math.ceil((i / weeksTotal) * 4);
    const phaseNames = ["기초", "심화", "실전", "완성"];
    roadmap.push({
      week: i,
      phase: phaseNames[phase - 1],
      focus: `${phaseNames[phase - 1]} 단계`,
      activities: ["기본 활동"],
    });
  }
 
  return roadmap;
}
 
function getDefaultMissions(goal, difficulty) {
  const time = [0, 10, 20, 30, 40, 50][difficulty] || 20;
 
  return [
    {
      title: `${goal} - 활동 1`,
      description: `${goal}을 위한 기본 활동을 ${time}분 동안 수행하세요.`,
      activity_type: "기본활동",
      duration_minutes: time,
      difficulty,
      measurement: "완료",
    },
    {
      title: `${goal} - 활동 2`,
      description: `${goal}을 위한 활동을 ${time}분 동안 수행하세요.`,
      activity_type: "활동",
      duration_minutes: time,
      difficulty,
      measurement: "완료",
    },
    {
      title: `${goal} - 활동 3`,
      description: `${goal}을 위한 마무리 활동을 ${time}분 동안 수행하세요.`,
      activity_type: "복습",
      duration_minutes: time,
      difficulty,
      measurement: "완료",
    },
  ];
}
 






