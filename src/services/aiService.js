export const generateMissions = async (goal, duration, difficulty = 2) => {
  const prompt = `
사용자의 목표: "${goal}"
목표 달성 기간: ${duration}개월
현재 난이도 레벨: ${difficulty}/5 (1=매우쉬움, 5=매우어려움)

이 사용자를 위해 오늘 완료 가능한 구체적인 미션 3개를 생성해줘.

요구사항:
1. 각 미션은 하루 안에 완료 가능해야 함 (30분~2시간)
2. 난이도는 ${difficulty}점을 기준으로 함
3. 목표 달성에 실질적으로 도움이 되는 미션
4. 매일 다양한 활동으로 변수 주기
5. 구체적이고 측정 가능한 미션

다음 JSON 형식으로만 응답:
\`\`\`json
{
  "missions": [
    {
      "title": "미션 1 제목",
      "description": "구체적인 설명 및 지침",
      "duration_minutes": 예상_소요_시간,
      "difficulty": ${difficulty}
    },
    {
      "title": "미션 2 제목",
      "description": "구체적인 설명 및 지침",
      "duration_minutes": 예상_소요_시간,
      "difficulty": ${difficulty}
    },
    {
      "title": "미션 3 제목",
      "description": "구체적인 설명 및 지침",
      "duration_minutes": 예상_소요_시간,
      "difficulty": ${difficulty}
    }
  ]
}
\`\`\`

난이도별 예시:
- 난이도 1 (매우 쉬움): "영어 단어 5개 학습", "10분 산책"
- 난이도 2 (쉬움): "영어 문법 30분 학습", "30분 운동"
- 난이도 3 (중간): "리딩 연습 30분 + 요약", "1시간 운동"
- 난이도 4 (어려움): "모의고사 풀기", "고강도 운동 1시간"
- 난이도 5 (매우 어려움): "실전 시험", "최대강도 운동"
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
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const content = data.content[0].text;

    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Claude response");
    }

    const missionsData = JSON.parse(jsonMatch[1]);
    return missionsData.missions;
  } catch (error) {
    console.error("Mission generation error:", error);
    return getDefaultMissions(goal, difficulty);
  }
};

export const getDefaultMissions = (goal, difficulty) => {
  const missionTemplates = {
    운동: [
      { title: "유산소 운동", description: "산책 또는 조깅 30분", duration_minutes: 30, difficulty },
      { title: "근력 운동", description: "집에서 가능한 운동 (팔굽혀펴기, 스쿼트 등) 20분", duration_minutes: 20, difficulty },
      { title: "스트레칭", description: "전신 스트레칭 또는 요가 15분", duration_minutes: 15, difficulty },
    ],
    공부: [
      { title: "개념 학습", description: "교과서 또는 강의 시청 30분", duration_minutes: 30, difficulty },
      { title: "연습 문제", description: "관련 주제 연습 문제 풀기 20분", duration_minutes: 20, difficulty },
      { title: "요약 및 정리", description: "학습한 내용 정리 및 노트 작성 15분", duration_minutes: 15, difficulty },
    ],
    자기계발: [
      { title: "독서", description: "책 또는 기사 읽기 30분", duration_minutes: 30, difficulty },
      { title: "명상/마음챙김", description: "명상 또는 깊은 호흡 연습 10분", duration_minutes: 10, difficulty },
      { title: "일기 작성", description: "오늘의 배운 점 및 생각 정리하기 10분", duration_minutes: 10, difficulty },
    ],
    언어: [
      { title: "단어 학습", description: "새로운 단어 10-20개 학습 및 암기 20분", duration_minutes: 20, difficulty },
      { title: "문법 학습", description: "문법 개념 학습 및 예제 풀기 25분", duration_minutes: 25, difficulty },
      { title: "리스닝/스피킹", description: "오디오 자료 듣기 또는 발음 연습 15분", duration_minutes: 15, difficulty },
    ],
  };

  let theme = "공부";
  if (goal.includes("운동") || goal.includes("헬스") || goal.includes("요가")) theme = "운동";
  else if (goal.includes("책") || goal.includes("독서") || goal.includes("습관")) theme = "자기계발";
  else if (goal.includes("영어") || goal.includes("중국어") || goal.includes("언어")) theme = "언어";

  return missionTemplates[theme] || missionTemplates["공부"];
};

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
  }
  else if (avgScore >= 0.5) {
    baseDifficulty = Math.min(4, baseDifficulty + 1);
  }

  return baseDifficulty;
};