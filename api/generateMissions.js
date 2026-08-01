
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
 
  const currentWeekData = roadmap && roadmap[currentWeek - 1] ? roadmap[currentWeek - 1] : roadmap?.[0];
  const currentWeekFocus = currentWeekData?.focus || "목표 달성";
  const suggestedActivities = currentWeekData?.activities || [];
 
  const previousTitles =
    previousMissions && previousMissions.length > 0
      ? previousMissions
          .slice(-3)
          .map((m) => m.title)
          .join(", ")
      : "없음";
 
  const goalContext = goalAnalysis
    ? `목표 유형: ${goalAnalysis.goal_type}
주요 전략: ${(goalAnalysis.strategies || []).join(", ")}`
    : "";
 
  const prompt = `
사용자의 목표: "${goal}"
${goalContext}
 
현재 주차(${currentWeek}주): ${currentWeekFocus}
제안된 활동: ${suggestedActivities.join(", ")}
난이도: ${difficulty}/5
지난 미션: ${previousTitles}
 
이 사용자를 위해 **오늘** 완료 가능한 구체적인 미션 3개를 생성해줘.
 
매우 중요: 
- 이전 미션과 다른 활동
- 실제 구체적인 활동 설명
- 구체적인 시간, 횟수, 방법
- 목표 달성에 실질적 도움
 
반드시 다음 JSON 형식으로만 응답:
\`\`\`json
{
  "missions": [
    {
      "title": "구체적인 미션 제목",
      "description": "상세한 설명: 정확히 무엇을 어떻게 할 것인지",
      "activity_type": "활동유형",
      "duration_minutes": 정확한시간,
      "difficulty": ${difficulty},
      "measurement": "완료기준"
    },
    {
      "title": "두번째 미션",
      "description": "두번째 상세 설명",
      "activity_type": "활동유형",
      "duration_minutes": 정확한시간,
      "difficulty": ${difficulty},
      "measurement": "완료기준"
    },
    {
      "title": "세번째 미션",
      "description": "세번째 상세 설명",
      "activity_type": "활동유형",
      "duration_minutes": 정확한시간,
      "difficulty": ${difficulty},
      "measurement": "완료기준"
    }
  ]
}
\`\`\`
 
예시 (운동):
{
  "title": "런닝머신 유산소 운동",
  "description": "런닝머신에서 속도 7km/h로 30분 달리기",
  "activity_type": "유산소운동",
  "duration_minutes": 30,
  "difficulty": 2,
  "measurement": "3km 이상 완주"
}
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
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
 
    const data = await response.json();
    console.log("API Response status:", response.status);
 
    if (!data.content || data.content.length === 0) {
      throw new Error("No content in response");
    }
 
    const textContent = data.content.find((c) => c.type === "text");
    if (!textContent) {
      throw new Error("No text content found");
    }
 
    const content = textContent.text;
    console.log("Response text:", content.substring(0, 300));
 
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
 
    if (!jsonMatch || !jsonMatch[1]) {
      console.error("JSON parse failed. Content:", content);
      throw new Error("JSON not found in response");
    }
 
    const missionsData = JSON.parse(jsonMatch[1]);
 
    if (!missionsData.missions || !Array.isArray(missionsData.missions)) {
      throw new Error("Invalid missions structure");
    }
 
    return res.status(200).json(missionsData);
  } catch (error) {
    console.error("Mission generation error:", error.message);
 
    // Fallback - 기본 미션
    return res.status(200).json({
      missions: [
        {
          title: `${goal} - 기본활동 1`,
          description: `${goal}을 위한 첫 번째 활동을 ${difficulty * 10}분 동안 수행하세요.`,
          activity_type: "기본활동",
          duration_minutes: difficulty * 10,
          difficulty,
          measurement: "완료",
        },
        {
          title: `${goal} - 기본활동 2`,
          description: `${goal}을 위한 두 번째 활동을 ${difficulty * 10}분 동안 수행하세요.`,
          activity_type: "활동",
          duration_minutes: difficulty * 10,
          difficulty,
          measurement: "완료",
        },
        {
          title: `${goal} - 기본활동 3`,
          description: `${goal}을 위한 세 번째 활동을 ${difficulty * 10}분 동안 수행하세요.`,
          activity_type: "복습",
          duration_minutes: difficulty * 10,
          difficulty,
          measurement: "완료",
        },
      ],
    });
  }
}
 






