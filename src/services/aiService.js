
/**
 * Step 0: 목표 분석 (구체적 정보 추출)
 * "매일 운동하기(체지방량 3% 줄이기)" → 목표 유형, 수치, 기한, 전략 파싱
 */
export const analyzeGoal = async (goal) => {
  const prompt = `
사용자의 목표: "${goal}"
 
이 목표를 분석해서 다음 정보를 추출해줘:
 
1. 목표 유형 (예: 운동, 공부, 언어, 자기계발, 건강 등)
2. 구체적 목표 (예: "체지방 3% 감량", "토익 900점", "책 10권 읽기")
3. 목표 달성 기한 추정 (주 단위)
4. 필요한 전략/방법 (3-5개 핵심 전략)
5. 주의할 점 (실패 요인 등)
 
다음 JSON 형식으로만 응답:
\`\`\`json
{
  "goal_type": "목표 유형",
  "specific_goal": "구체적 목표",
  "estimated_weeks": 목표달성_주차_숫자,
  "strategies": ["전략1", "전략2", "전략3"],
  "key_metrics": "측정 방법",
  "pitfalls": ["실패요인1", "실패요인2"],
  "difficulty_analysis": "난이도 분석"
}
\`\`\`
 
예시:
목표: "체지방량 3% 줄이기"
응답:
{
  "goal_type": "운동/건강",
  "specific_goal": "체지방률 3% 감량",
  "estimated_weeks": 8,
  "strategies": ["유산소운동 주 3회", "근력운동 주 2회", "칼로리 관리 -500kcal/일"],
  "key_metrics": "주 1회 체지방 측정 또는 둘레 재기",
  "pitfalls": ["과도한 운동으로 번아웃", "극단적 식이제한", "근력 손실"],
  "difficulty_analysis": "초기 1-2주는 쉽지만, 후반부로 갈수록 어려워짐"
}
  `;
 
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
 
    if (!jsonMatch) {
      throw new Error("Failed to parse goal analysis");
    }
 
    const analysis = JSON.parse(jsonMatch[1]);
    console.log("📊 목표 분석 완료:", analysis);
    return analysis;
  } catch (error) {
    console.error("Goal analysis error:", error);
    return getDefaultGoalAnalysis(goal);
  }
};
 
/**
 * Step 1: 목표 분석 결과 기반 로드맵 생성
 */
export const generateRoadmap = async (goal, durationMonths, goalAnalysis) => {
  const estimatedWeeks = goalAnalysis?.estimated_weeks || durationMonths * 4;
  const strategies = goalAnalysis?.strategies || [];
  const difficulty = goalAnalysis?.difficulty_analysis || "점진적 난이도 상향";
 
  const prompt = `
사용자의 목표: "${goal}"
기간: ${durationMonths}개월 (약 ${estimatedWeeks}주)
핵심 전략: ${strategies.join(", ")}
난이도 특성: ${difficulty}
 
이 목표를 달성하기 위한 주간별 로드맵을 작성해줘.
각 주는 **구체적인 행동 계획**을 포함해야 함.
 
예시 (체지방 3% 감량, 8주):
- 1-2주: 기초 체력 구축 (유산소 20분 + 간단한 스트레칭)
- 3-4주: 운동 강화 (유산소 30분 + 근력운동 시작)
- 5-6주: 강도 상향 (고강도 유산소 + 중강도 근력운동)
- 7-8주: 마무리 및 체지방 감량 집중
 
다음 JSON 형식으로만 응답:
\`\`\`json
{
  "roadmap": [
    {
      "week": 1,
      "phase": "단계 이름",
      "focus": "이 주의 핵심 목표",
      "activities": ["구체적 활동1", "구체적 활동2"]
    },
    ...
  ]
}
\`\`\`
  `;
 
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
 
    if (!jsonMatch) {
      throw new Error("Failed to parse roadmap");
    }
 
    const roadmapData = JSON.parse(jsonMatch[1]);
    console.log("🗺️ 로드맵 생성 완료:", roadmapData.roadmap.length, "주");
    return roadmapData.roadmap;
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return getDefaultRoadmap(durationMonths);
  }
};
 
/**
 * Step 2: 로드맵 + 목표 분석 + 난이도 → 오늘의 구체적 미션 생성
 */
export const generateMissions = async (
  goal,
  roadmap,
  currentWeek,
  previousMissions,
  difficulty = 2,
  goalAnalysis = null
) => {
  // 현재 주차의 포커스와 활동 찾기
  const currentWeekData = roadmap[currentWeek - 1] || roadmap[0];
  const currentWeekFocus = currentWeekData?.focus || "목표 달성";
  const suggestedActivities = currentWeekData?.activities || [];
 
  // 어제/지난 미션 정보 (다양성 보장)
  const previousTitles = previousMissions
    .slice(-3)
    .map(m => m.title)
    .join(", ");
 
  const difficultyGuide = getDifficultyGuide(difficulty);
  const goalContext = goalAnalysis
    ? `목표 유형: ${goalAnalysis.goal_type}
주요 전략: ${goalAnalysis.strategies.join(", ")}
측정 방법: ${goalAnalysis.key_metrics}`
    : "";
 
  const prompt = `
사용자의 목표: "${goal}"
${goalContext}
 
현재 주차(${currentWeek}주): ${currentWeekFocus}
제안된 활동: ${suggestedActivities.join(", ")}
 
현재 난이도: ${difficulty}/5
어제/지난 미션: ${previousTitles || "없음"}
 
이 사용자를 위해 **오늘** 완료 가능한 구체적인 미션 3개를 생성해줘.
 
요구사항:
1. **${currentWeekFocus} 단계에 맞는 활동**만 포함
2. **이전 미션과 다른 활동** (만약 "유산소운동"을 했으면 "근력운동" 등)
3. **실제로 하는 활동을 상세히 설명** 
   - 어떤 자료? 어떤 운동? 어떤 공부 방식?
   - 구체적인 시간, 세트 수, 반복 횟수
4. **난이도별 기준:**
${difficultyGuide}
5. **목표 달성에 실질적으로 도움**이 되는 내용
6. **시간이 명확함** (정확한 분 단위)
 
다음 JSON 형식으로만 응답:
\`\`\`json
{
  "missions": [
    {
      "title": "구체적인 미션 제목",
      "description": "상세 설명: 구체적으로 무엇을 어떻게 할 것인지",
      "activity_type": "활동 유형",
      "duration_minutes": 정확한_소요시간,
      "difficulty": ${difficulty},
      "measurement": "완료 기준 (예: '3km 완주' 또는 '10개 문제 풀이')"
    }
  ]
}
\`\`\`
 
예시 (좋은 미션):
{
  "title": "런닝머신 유산소 운동",
  "description": "런닝머신에서 속도 7km/h로 30분 달리기. 중간에 2분 휴식 2회 포함. 심박수는 120-140bpm 범위 유지.",
  "activity_type": "유산소운동",
  "duration_minutes": 30,
  "difficulty": 2,
  "measurement": "총 거리 3.5km 이상 완주"
}
  `;
 
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
    const content = data.content[0].text;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
 
    if (!jsonMatch) {
      throw new Error("Failed to parse missions");
    }
 
    const missionsData = JSON.parse(jsonMatch[1]);
    console.log("✅ 미션 생성 완료:", missionsData.missions.length, "개");
    return missionsData.missions;
  } catch (error) {
    console.error("Mission generation error:", error);
    return getDefaultMissions(goal, difficulty);
  }
};
 
/**
 * 난이도별 구체적 가이드
 */
function getDifficultyGuide(difficulty) {
  const guides = {
    1: `난이도 1 (매우쉬움, 5-10분):
      - 시간: 5-10분
      - 분량: 최소 수준
      - 예: "산책 5분", "스트레칭 10분", "단어 5개 학습"`,
 
    2: `난이도 2 (쉬움, 10-20분):
      - 시간: 10-20분
      - 분량: 가벼운 수준
      - 예: "산책 20분", "유산소 20분", "기초운동"`,
 
    3: `난이도 3 (중간, 20-30분):
      - 시간: 20-30분
      - 분량: 표준 수준
      - 예: "러닝 30분", "근력운동 30분", "중강도 운동"`,
 
    4: `난이도 4 (어려움, 30-45분):
      - 시간: 30-45분
      - 분량: 도전적 수준
      - 예: "고강도 운동 45분", "장거리 러닝"`,
 
    5: `난이도 5 (매우어려움, 45-60분):
      - 시간: 45-60분
      - 분량: 최고 수준
      - 예: "최고강도 운동 60분", "대회 수준 운동"`,
  };
 
  return guides[difficulty] || guides[3];
}
 
/**
 * 난이도 자동 조정 (이전 피드백 기반)
 */
export const calculateAdjustedDifficulty = (feedbackHistory) => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return 2;
  }
 
  const recentFeedback = feedbackHistory.slice(-3);
 
  let score = 0;
  recentFeedback.forEach(feedback => {
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
 * 기본값 (API 실패 시)
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
 






