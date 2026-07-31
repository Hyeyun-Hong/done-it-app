
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const {
    goal,
    roadmap,
    currentWeek,
    previousMissions,
    difficulty,
    goalAnalysis,
  } = req.body;
 
  const currentWeekData = roadmap[currentWeek - 1] || roadmap[0];
  const currentWeekFocus = currentWeekData?.focus || "목표 달성";
  const suggestedActivities = currentWeekData?.activities || [];
 
  const previousTitles = previousMissions
    .slice(-3)
    .map((m) => m.title)
    .join(", ");
 
  const difficultyGuide = {
    1: "난이도 1 (매우쉬움, 5-10분): 최소 수준",
    2: "난이도 2 (쉬움, 10-20분): 가벼운 수준",
    3: "난이도 3 (중간, 20-30분): 표준 수준",
    4: "난이도 4 (어려움, 30-45분): 도전적 수준",
    5: "난이도 5 (매우어려움, 45-60분): 최고 수준",
  };
 
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
${difficultyGuide[difficulty]}
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
      "measurement": "완료 기준"
    }
  ]
}
\`\`\`
  `;
 
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLAUDE_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
 
    if (!data.content || !data.content[0]) {
      throw new Error("Invalid response format");
    }
 
    const content = data.content[0].text;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
 
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON");
    }
 
    const missionsData = JSON.parse(jsonMatch[1]);
    return res.status(200).json(missionsData);
  } catch (error) {
    console.error("Mission generation error:", error);
    return res.status(500).json({
      missions: [
        {
          title: `${goal} - 활동 1`,
          description: `${goal}을 위한 기본 활동을 ${difficulty * 10}분 동안 수행하세요.`,
          activity_type: "기본활동",
          duration_minutes: difficulty * 10,
          difficulty,
          measurement: "완료",
        },
        {
          title: `${goal} - 활동 2`,
          description: `${goal}을 위한 활동을 ${difficulty * 10}분 동안 수행하세요.`,
          activity_type: "활동",
          duration_minutes: difficulty * 10,
          difficulty,
          measurement: "완료",
        },
        {
          title: `${goal} - 활동 3`,
          description: `${goal}을 위한 마무리 활동을 ${difficulty * 10}분 동안 수행하세요.`,
          activity_type: "복습",
          duration_minutes: difficulty * 10,
          difficulty,
          measurement: "완료",
        },
      ],
    });
  }
}
 






