/**
 * 목표별 구체적 미션 데이터 (하드코딩)
 */
export const missionDatabase = {
  "토익 900점": {
    roadmap: [
      { week: 1, phase: "기초", focus: "기초 어휘", activities: ["단어 학습", "리딩 연습"] },
      { week: 2, phase: "기초", focus: "기초 문법", activities: ["문법 학습", "문제 풀이"] }
    ],
    missions: [
      {
        title: "토익 영단어 100개 학습",
        description: "토익 필수 단어 100개를 학습하고 예문 3개씩 읽기. 앱이나 단어장 활용. 20분 소요.",
        activity_type: "어휘학습",
        duration_minutes: 20,
        difficulty: 2,
        measurement: "100개 완료"
      },
      {
        title: "리딩 연습 - 10문제 풀이",
        description: "토익 기출 리딩 문제 10문제를 25분 안에 풀기. 모르는 단어는 표시하고 나중에 정리하기.",
        activity_type: "독해연습",
        duration_minutes: 25,
        difficulty: 2,
        measurement: "10문제 완료"
      },
      {
        title: "문법 복습 - 주요 패턴 5개",
        description: "시제, 가정법, 접속사 등 주요 문법 패턴 5개를 복습하고 예문 각 3개씩 정리하기. 15분.",
        activity_type: "문법학습",
        duration_minutes: 15,
        difficulty: 2,
        measurement: "5개 패턴 정리 완료"
      }
    ]
  },

  "체지방 3% 감량": {
    roadmap: [
      { week: 1, phase: "기초", focus: "기초 체력", activities: ["유산소 20분", "스트레칭"] },
      { week: 2, phase: "기초", focus: "근력 시작", activities: ["가벼운 근력", "유산소"] }
    ],
    missions: [
      {
        title: "런닝머신 유산소 운동",
        description: "런닝머신에서 속도 7km/h로 30분 달리기. 중간에 2분 휴식 2회 포함. 심박수는 120-140bpm 범위 유지.",
        activity_type: "유산소운동",
        duration_minutes: 30,
        difficulty: 2,
        measurement: "3.5km 이상 완주"
      },
      {
        title: "하체 근력운동 - 스쿠트",
        description: "스쿼트 3세트 × 15회. 각 세트 사이 1분 휴식. 무릎이 발끝보다 앞으로 나가지 않게 주의. 20분.",
        activity_type: "근력운동",
        duration_minutes: 20,
        difficulty: 2,
        measurement: "3세트 × 15회 완료"
      },
      {
        title: "복합운동 - 버피 & 점프 스쿼트",
        description: "버피 30초 × 10회, 점프 스쿼트 20회 × 3세트. 최대한 빠르게 수행. 고강도 운동으로 칼로리 소모 극대화. 15분.",
        activity_type: "고강도운동",
        duration_minutes: 15,
        difficulty: 2,
        measurement: "모든 세트 완료"
      }
    ]
  },

  "책 30분 읽기": {
    roadmap: [
      { week: 1, phase: "기초", focus: "독서 습관", activities: ["가벼운 책 읽기", "요약하기"] },
      { week: 2, phase: "기초", focus: "집중력 강화", activities: ["깊이 있는 책", "필기하며 읽기"] }
    ],
    missions: [
      {
        title: "가벼운 책 읽기 - 30분",
        description: "선호하는 소설이나 에세이를 30분 동안 읽기. 핸드폰은 멀리하고 조용한 환경에서. 읽은 페이지 기록하기.",
        activity_type: "독서",
        duration_minutes: 30,
        difficulty: 2,
        measurement: "30분 완독"
      },
      {
        title: "책 내용 요약 정리",
        description: "읽은 책의 핵심 내용을 A4 1장에 요약 정리. 주요 개념 3-5개, 느낀점 1개 포함. 15분.",
        activity_type: "독서활동",
        duration_minutes: 15,
        difficulty: 2,
        measurement: "요약본 완성"
      },
      {
        title: "독서 감상문 작성",
        description: "읽은 책에 대해 자유롭게 감상문 작성. 인상 깊은 장면 2개, 배운 점 1개, 추천 대상 포함. 20분.",
        activity_type: "창작",
        duration_minutes: 20,
        difficulty: 2,
        measurement: "감상문 완성"
      }
    ]
  }
};

/**
 * 목표에 맞는 미션 가져오기
 */
export const getMissionsForGoal = (goalTitle) => {
  // 정확한 매칭
  if (missionDatabase[goalTitle]) {
    return missionDatabase[goalTitle];
  }

  // 부분 매칭 (예: "토익" 포함)
  for (const [key, data] of Object.entries(missionDatabase)) {
    if (goalTitle.includes(key) || key.includes(goalTitle)) {
      return data;
    }
  }

  // 매칭 실패 시 기본값
  return null;
};