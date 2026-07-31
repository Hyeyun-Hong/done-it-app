
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
 
  const { goal, durationMonths, goalAnalysis } = req.body;
 
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
 
다음 JSON 형식으로만 응답:
\`\`\`json
{
  "roadmap": [
    {
      "week": 1,
      "phase": "단계 이름",
      "focus": "이 주의 핵심 목표",
      "activities": ["구체적 활동1", "구체적 활동2"]
    }
  ]
}
\`\`\`
 
예시 (체지방 3% 감량, 8주):
- 1-2주: 기초 체력 구축 (유산소 20분 + 간단한 스트레칭)
- 3-4주: 운동 강화 (유산소 30분 + 근력운동 시작)
- 5-6주: 강도 상향 (고강도 유산소 + 중강도 근력운동)
- 7-8주: 마무리 및 체지방 감량 집중
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
 
    const roadmapData = JSON.parse(jsonMatch[1]);
    return res.status(200).json(roadmapData);
  } catch (error) {
    console.error("Roadmap generation error:", error);
 
    // 기본 로드맵
    const weeksTotal = estimatedWeeks || durationMonths * 4;
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
 
    return res.status(200).json({ roadmap });
  }
}
 






