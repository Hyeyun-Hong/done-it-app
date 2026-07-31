
/**
 * Step 1: 목표 → 로드맵 생성
 */
export const generateRoadmap = async (goal, durationMonths) => {
  const prompt = `
사용자의 목표: "${goal}"
기간: ${durationMonths}개월
 
이 목표를 달성하기 위한 주간별 로드맵을 작성해줘.
 
예시 (토익 900점, 3개월):
- 1-2주: 기초 문법 + 단어 1000개
- 3-4주: 기초 문법 완성 + 단어 2000개
- 5-6주: LC/RC 기초 연습
- 7-8주: 모의고사 풀기
- 9-12주: 실전 연습
 
다음 JSON 형식으로만 응답:
\`\`\`json
{
  "roadmap": [
    {
      "week": 1,
      "title": "주차 제목",
      "focus": "이 주의 핵심 목표"
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
        max_tokens: 2000,
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
    return roadmapData.roadmap;
  } catch (error) {
    console.error("Roadmap generation error:", error);
    return getDefaultRoadmap(durationMonths);
  }
};
 
/**
 * Step 2: 로드맵 + 난이도 + 이전 미션 → 오늘의 구체적 미션
 */
export const generateMissions = async (
  goal,
  roadmap,
  currentWeek,
  previousMissions,
  difficulty = 2
) => {
  // 현재 주차의 포커스 찾기
  const currentWeekFocus = roadmap[currentWeek - 1]?.focus || "목표 달성";
 
  // 어제 한 미션 정보 (다양성 보장)
  const previousTitles = previousMissions
    .slice(-3)
    .map(m => m.title)
    .join(", ");
 
  const difficultyGuide = getDifficultyGuide(difficulty);
 
  const prompt = `
사용자의 목표: "${goal}"
현재 주차 포커스: "${currentWeekFocus}"
현재 난이도: ${difficulty}/5
어제/지난 미션: ${previousTitles}
 
이 사용자를 위해 **오늘** 완료 가능한 구체적인 미션 3개를 생성해줘.
 
요구사항:
1. **이전 미션과 완전히 다른 활동** (만약 "단어학습"을 했으면 "문법연습" 등)
2. **실제로 하는 활동을 상세히 설명** (어떤 자료? 어떤 방식?)
3. **난이도별 기준을 따를 것:**
${difficultyGuide}
4. **목표 달성에 실질적으로 도움**
5. **시간이 명확함** (정확한 분 단위)
 
다음 JSON 형식으로만 응답:
\`\`\`json
{
  "missions": [
    {
      "title": "구체적인 미션 제목",
      "description": "상세 설명: 어떤 자료를 사용하고, 어떤 방식으로 할 것인지",
      "activity_type": "활동 유형 (예: 영상시청, 문제풀이, 독서, 작문 등)",
      "duration_minutes": 정확한_소요시간_숫자,
      "difficulty": ${difficulty}
    },
    {
      "title": "구체적인 미션 제목",
      "description": "상세 설명",
      "activity_type": "활동 유형",
      "duration_minutes": 정확한_소요시간_숫자,
      "difficulty": ${difficulty}
    },
    {
      "title": "구체적인 미션 제목",
      "description": "상세 설명",
      "activity_type": "활동 유형",
      "duration_minutes": 정확한_소요시간_숫자,
      "difficulty": ${difficulty}
    }
  ]
}
\`\`\`
 
예시 (좋은 미션):
❌ "영어 공부 30분"
✅ "BBC News 오늘의 기사 1개 읽고, 모르는 단어 5개 정리하기 (15분)"
 
❌ "수학 문제 풀기"
✅ "칸아카데미 미적분 기초 강의 시청 + 연습문제 3개 풀이 (25분)"
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
        max_tokens: 2000,
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
      - 예: "영어 단어 3개 학습", "유튜브 숏폼 영상 1개 시청", "5분 스트레칭"`,
    
    2: `난이도 2 (쉬움, 10-20분):
      - 시간: 10-20분
      - 분량: 가벼운 수준
      - 예: "EasyEnglish 영상 1개 + 단어 5개 정리", "연습문제 5개", "20분 산책"`,
    
    3: `난이도 3 (중간, 20-30분):
      - 시간: 20-30분
      - 분량: 표준 수준
      - 예: "BBC News 기사 읽기 + 단어 정리", "실전 문제 10개", "30분 운동"`,
    
    4: `난이도 4 (어려움, 30-45분):
      - 시간: 30-45분
      - 분량: 도전적 수준
      - 예: "모의고사 1세트 풀기", "1시간 집중 학습", "고강도 운동"`,
    
    5: `난이도 5 (매우어려움, 45-60분):
      - 시간: 45-60분
      - 분량: 최고 수준
      - 예: "실전 시험 풀기", "어려운 책 1시간 읽기", "최고강도 운동"`,
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
 
  // 최근 3일 피드백만 사용
  const recentFeedback = feedbackHistory.slice(-3);
  
  let score = 0;
  recentFeedback.forEach(feedback => {
    if (feedback === "down") score -= 1;      // 어려웠음
    else if (feedback === "good") score += 0; // 적당함
    else if (feedback === "up") score += 1;   // 쉬웠음
  });
 
  const avgScore = score / recentFeedback.length;
 
  let baseDifficulty = 2;
 
  // 평균적으로 "어려웠음" → 난이도 낮추기
  if (avgScore <= -0.5) {
    baseDifficulty = Math.max(1, baseDifficulty - 1);
  }
  // 평균적으로 "쉬웠음" → 난이도 올리기
  else if (avgScore >= 0.5) {
    baseDifficulty = Math.min(5, baseDifficulty + 1);
  }
 
  return baseDifficulty;
};
 
/**
 * 기본 로드맵 (API 실패 시)
 */
function getDefaultRoadmap(durationMonths) {
  const weeksTotal = durationMonths * 4;
  const roadmap = [];
 
  for (let i = 1; i <= weeksTotal; i++) {
    const phase = Math.ceil((i / weeksTotal) * 4);
    const phaseNames = ["기초", "심화", "실전", "완성"];
    roadmap.push({
      week: i,
      title: `${i}주차`,
      focus: `${phaseNames[phase - 1]} 단계`,
    });
  }
 
  return roadmap;
}
 
/**
 * 기본 미션 (API 실패 시)
 */
function getDefaultMissions(goal, difficulty) {
  const difficultyLevels = {
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50,
  };
 
  const time = difficultyLevels[difficulty] || 20;
 
  return [
    {
      title: `${goal} 학습 - 기초`,
      description: `${goal}의 기초 내용을 ${time}분 동안 학습하세요.`,
      activity_type: "학습",
      duration_minutes: time,
      difficulty,
    },
    {
      title: `${goal} 문제 풀이`,
      description: `${goal} 관련 연습 문제 풀이 ${time}분`,
      activity_type: "문제풀이",
      duration_minutes: time,
      difficulty,
    },
    {
      title: `${goal} 정리 및 복습`,
      description: `오늘 학습한 내용 정리 및 복습 ${time}분`,
      activity_type: "복습",
      duration_minutes: time,
      difficulty,
    },
  ];
}
 






