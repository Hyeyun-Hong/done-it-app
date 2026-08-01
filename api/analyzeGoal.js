
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const { goal } = req.body;
 
  const prompt = `
사용자의 목표: "${goal}"
 
이 목표를 분석해줘. 다음 정보를 추출:
1. 목표 유형
2. 구체적 목표
3. 달성 기한 (주 단위, 숫자만)
4. 3-5개 핵심 전략
5. 측정 방법
6. 주의사항 2개
7. 난이도 분석
 
반드시 다음 JSON 형식으로만 응답:
\`\`\`json
{
  "goal_type": "운동",
  "specific_goal": "체지방 3% 감량",
  "estimated_weeks": 8,
  "strategies": ["유산소 주 3회", "근력운동 주 2회", "칼로리 관리"],
  "key_metrics": "주 1회 체지방 측정",
  "pitfalls": ["과도한 운동", "극단적 식이제한"],
  "difficulty_analysis": "초반쉽고 후반어려움"
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
 
    if (!data.content || data.content.length === 0) {
      throw new Error("No content in response");
    }
 
    const textContent = data.content.find((c) => c.type === "text");
    if (!textContent) {
      throw new Error("No text content found");
    }
 
    const content = textContent.text;
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
 
    if (!jsonMatch || !jsonMatch[1]) {
      console.error("JSON parse failed:", content.substring(0, 200));
      throw new Error("JSON not found");
    }
 
    const analysis = JSON.parse(jsonMatch[1]);
 
    // Validate structure
    if (!analysis.goal_type || !analysis.estimated_weeks) {
      throw new Error("Invalid analysis structure");
    }
 
    return res.status(200).json(analysis);
  } catch (error) {
    console.error("Analysis error:", error.message);
 
    // Fallback
    return res.status(200).json({
      goal_type: "일반",
      specific_goal: goal,
      estimated_weeks: 4,
      strategies: ["기초부터 시작", "점진적 난이도 상향", "꾸준한 반복"],
      key_metrics: "매일 체크",
      pitfalls: ["포기", "산만함"],
      difficulty_analysis: "점진적 상향",
    });
  }
}
 






