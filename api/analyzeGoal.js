
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const { goal } = req.body;
 
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
        max_tokens: 1500,
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
 
    const analysis = JSON.parse(jsonMatch[1]);
    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return res.status(500).json({
      error: error.message,
      goal_type: "일반",
      specific_goal: goal,
      estimated_weeks: 4,
      strategies: ["기초부터 시작", "점진적 난이도 상향"],
      key_metrics: "매일 체크",
      pitfalls: ["포기"],
      difficulty_analysis: "점진적",
    });
  }
}
 






