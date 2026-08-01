
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
 
주간별 로드맵을 작성해줘. 각 주는 구체적인 행동 계획을 포함해야 함.
 
반드시 다음 JSON 형식으로만 응답:
\`\`\`json
{
  "roadmap": [
    {"week": 1, "phase": "기초", "focus": "기초 체력 구축", "activities": ["활동1", "활동2"]},
    {"week": 2, "phase": "기초", "focus": "기초 체력 강화", "activities": ["활동1", "활동2"]}
  ]
}
\`\`\`
 
${estimatedWeeks}주 분량의 로드맵을 만들어줘.
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
    console.log("API Response:", JSON.stringify(data).substring(0, 500));
 
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
      console.error("Failed to parse JSON from:", content.substring(0, 200));
      throw new Error("JSON not found in response");
    }
 
    const roadmapData = JSON.parse(jsonMatch[1]);
    
    if (!roadmapData.roadmap || !Array.isArray(roadmapData.roadmap)) {
      throw new Error("Invalid roadmap structure");
    }
 
    return res.status(200).json(roadmapData);
  } catch (error) {
    console.error("Roadmap generation error:", error.message);
 
    // Fallback
    const weeksTotal = estimatedWeeks || durationMonths * 4;
    const roadmap = [];
 
    for (let i = 1; i <= Math.min(weeksTotal, 12); i++) {
      const phase = Math.ceil((i / weeksTotal) * 4);
      const phaseNames = ["기초", "심화", "실전", "완성"];
      roadmap.push({
        week: i,
        phase: phaseNames[phase - 1] || "기초",
        focus: `${phaseNames[phase - 1]} 단계`,
        activities: ["기본 활동"],
      });
    }
 
    return res.status(200).json({ roadmap });
  }
}
 






