export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { goal, category, duration_weeks, current_level, constraints } = req.body;

  // Claude에게 보낼 프롬프트
  const prompt = `
당신은 개인 맞춤형 목표 달성 전문가입니다.

사용자 정보:
- 목표: ${goal}
- 카테고리: ${category}
- 기간: ${duration_weeks}주
- 현재 수준: ${current_level}
- 제약사항: ${constraints || "없음"}

이 정보를 바탕으로 ${duration_weeks}주간의 구체적인 목표 달성 계획을 만들어주세요.

**필수 요구사항:**
1. ${duration_weeks}주 로드맵 (각 주차별 포커스)
2. 난이도별(1/2/3) 미션 각 3개 (총 9개)
3. 모든 미션은 매우 구체적이고 실행 가능해야 함
   - "공부하기" (❌ 너무 일반적)
   - "Python 기초 강의 영상 1강 시청 후 print() 함수 연습 5분" (✅ 구체적)

**응답 형식 (JSON만 반환):**
\`\`\`json
{
  "roadmap": [
    {
      "week": 1,
      "phase": "기초",
      "focus": "이 주의 핵심 목표",
      "activities": ["활동1", "활동2", "활동3"]
    },
    ... (${duration_weeks}주까지)
  ],
  "missions": {
    "1": [
      {
        "title": "미션 제목 (15글자 이내)",
        "description": "구체적인 설명 (시간, 방법, 목표 포함)",
        "activity_type": "활동 유형",
        "duration_minutes": 숫자,
        "difficulty": 1,
        "measurement": "완료 기준"
      },
      ... (난이도 1에서 3개)
    ],
    "2": [... 난이도 2, 3개 ...],
    "3": [... 난이도 3, 3개 ...]
  }
}
\`\`\`

**중요:**
- JSON만 반환하세요. 다른 텍스트는 절대 포함하지 않기
- 한국어로 작성
- 모든 미션은 ${current_level} 수준에 맞춰서
- 제약사항을 반드시 고려
`;

  try {
    console.log("🚀 Claude API 호출 중...");
    console.log("프롬프트:", prompt.substring(0, 200) + "...");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLAUDE_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API 에러:", errorData);
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Claude 응답 받음");

    // Claude 응답에서 JSON 추출
    const content = data.content[0].text;
    console.log("응답 내용:", content.substring(0, 300) + "...");

    // JSON 찾기
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Claude 응답에서 JSON을 찾을 수 없습니다");
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("✅ JSON 파싱 완료");

    // 응답 검증
    if (!result.roadmap || !result.missions) {
      throw new Error("응답 형식이 올바르지 않습니다");
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ 에러:", error.message);
    return res.status(500).json({
      error: error.message,
      details: "Claude API 호출에 실패했습니다. 다시 시도해주세요."
    });
  }
}