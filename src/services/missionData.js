/**
 * 목표별 난이도별 미션 데이터
 */
export const missionDatabase = {
  "토익 900점": {
    roadmap: [
      { week: 1, phase: "기초", focus: "기초 어휘", activities: ["단어 학습", "리딩 연습"] },
      { week: 2, phase: "기초", focus: "기초 문법", activities: ["문법 학습", "문제 풀이"] }
    ],
    missions: {
      1: [ // 난이도 1 (쉬움)
        {
          title: "토익 영단어 50개 학습",
          description: "토익 필수 영단어 50개를 학습하고 예문 1개씩 읽기. 10분.",
          activity_type: "어휘학습",
          duration_minutes: 10,
          difficulty: 1,
          measurement: "50개 완료"
        },
        {
          title: "기초 문법 복습 - 3개 패턴",
          description: "기본 시제, 부정사, 전치사 3가지 패턴 복습. 10분.",
          activity_type: "문법학습",
          duration_minutes: 10,
          difficulty: 1,
          measurement: "3개 패턴 이해"
        },
        {
          title: "리딩 연습 - 5문제",
          description: "토익 기초 리딩 5문제를 천천히 풀기. 15분.",
          activity_type: "독해연습",
          duration_minutes: 15,
          difficulty: 1,
          measurement: "5문제 풀이"
        }
      ],
      2: [ // 난이도 2 (보통)
        {
          title: "토익 영단어 100개 학습",
          description: "토익 필수 단어 100개를 학습하고 예문 3개씩 읽기. 20분 소요.",
          activity_type: "어휘학습",
          duration_minutes: 20,
          difficulty: 2,
          measurement: "100개 완료"
        },
        {
          title: "리딩 연습 - 10문제 풀이",
          description: "토익 기출 리딩 문제 10문제를 25분 안에 풀기. 모르는 단어는 표시.",
          activity_type: "독해연습",
          duration_minutes: 25,
          difficulty: 2,
          measurement: "10문제 완료"
        },
        {
          title: "문법 복습 - 주요 패턴 5개",
          description: "시제, 가정법, 접속사 등 주요 문법 패턴 5개 복습. 15분.",
          activity_type: "문법학습",
          duration_minutes: 15,
          difficulty: 2,
          measurement: "5개 패턴 정리 완료"
        }
      ],
      3: [ // 난이도 3 (어려움)
        {
          title: "토익 영단어 150개 + 예문 분석",
          description: "150개 단어 학습 및 각 예문 분석. 문장 구조 이해. 30분.",
          activity_type: "어휘학습",
          duration_minutes: 30,
          difficulty: 3,
          measurement: "150개 완료"
        },
        {
          title: "고난이도 리딩 연습 - 20문제",
          description: "토익 고난이도 리딩 20문제를 35분 안에 풀고 분석하기.",
          activity_type: "독해연습",
          duration_minutes: 35,
          difficulty: 3,
          measurement: "20문제 + 분석 완료"
        },
        {
          title: "리스닝 연습 - 집중 청취",
          description: "토익 리스닝 Part 3, 4 각 10문제 풀이. 정확성 중심. 30분.",
          activity_type: "청취연습",
          duration_minutes: 30,
          difficulty: 3,
          measurement: "20문제 완료"
        }
      ]
    }
  },

  "체지방 3% 감량": {
    roadmap: [
      { week: 1, phase: "기초", focus: "기초 체력", activities: ["유산소 20분", "스트레칭"] },
      { week: 2, phase: "기초", focus: "근력 시작", activities: ["가벼운 근력", "유산소"] }
    ],
    missions: {
      1: [ // 난이도 1 (쉬움)
        {
          title: "산책 - 20분",
          description: "편안한 속도로 20분 산책. 심박수 100-110bpm 범위.",
          activity_type: "유산소운동",
          duration_minutes: 20,
          difficulty: 1,
          measurement: "20분 완료"
        },
        {
          title: "가벼운 스트레칭 - 15분",
          description: "전신 스트레칭 15분. 팔, 다리, 허리, 목 중심.",
          activity_type: "유연성",
          duration_minutes: 15,
          difficulty: 1,
          measurement: "15분 완료"
        },
        {
          title: "가벼운 근력 - 팔굽혀펴기 20회",
          description: "팔굽혀펴기 2세트 × 10회. 무릎 지탱 가능. 10분.",
          activity_type: "근력운동",
          duration_minutes: 10,
          difficulty: 1,
          measurement: "2세트 × 10회"
        }
      ],
      2: [ // 난이도 2 (보통)
        {
          title: "런닝머신 유산소 운동",
          description: "런닝머신 속도 7km/h로 30분 달리기. 심박수 120-140bpm.",
          activity_type: "유산소운동",
          duration_minutes: 30,
          difficulty: 2,
          measurement: "3.5km 이상 완주"
        },
        {
          title: "하체 근력운동 - 스쿼트",
          description: "스쿼트 3세트 × 15회. 각 세트 사이 1분 휴식. 20분.",
          activity_type: "근력운동",
          duration_minutes: 20,
          difficulty: 2,
          measurement: "3세트 × 15회 완료"
        },
        {
          title: "복합운동 - 버피 & 점프 스쿼트",
          description: "버피 30초 × 10회, 점프 스쿼트 20회 × 3세트. 15분.",
          activity_type: "고강도운동",
          duration_minutes: 15,
          difficulty: 2,
          measurement: "모든 세트 완료"
        }
      ],
      3: [ // 난이도 3 (어려움)
        {
          title: "고강도 인터벌 운동 - 30분",
          description: "30초 최고강도 + 30초 휴식 × 20회. 칼로리 극대화. 30분.",
          activity_type: "고강도운동",
          duration_minutes: 30,
          difficulty: 3,
          measurement: "20회 완료"
        },
        {
          title: "상체 + 하체 복합운동",
          description: "풀업 10회 × 3세트, 데드리프트 10회 × 3세트. 45분.",
          activity_type: "근력운동",
          duration_minutes: 45,
          difficulty: 3,
          measurement: "6세트 완료"
        },
        {
          title: "마라톤 연습 - 10km 러닝",
          description: "10km를 안정적인 속도로 달리기. 평균 심박수 150-160bpm. 50분.",
          activity_type: "유산소운동",
          duration_minutes: 50,
          difficulty: 3,
          measurement: "10km 완주"
        }
      ]
    }
  },
"투운사 자격증": {
    roadmap: [
      { week: 1, phase: "기초", focus: "법규 기초", activities: ["법규 학습", "용어 정리"] },
      { week: 2, phase: "심화", focus: "시험 대비", activities: ["기출문제 풀이", "약점 보완"] },
      { week: 3, phase: "실전", focus: "모의고사", activities: ["모의고사", "오답 분석"] },
      { week: 4, phase: "완성", focus: "최종 점검", activities: ["전체 복습", "시험 준비"] }
    ],
    missions: {
      1: [ // 난이도 1 (쉬움)
        {
          title: "투운사 법규 기초 학습 - 1단원",
          description: "투운사 자격증 제1단원(법규 기초) 학습. 주요 용어 10개 정리. 15분.",
          activity_type: "법규학습",
          duration_minutes: 15,
          difficulty: 1,
          measurement: "1단원 완료"
        },
        {
          title: "관광지리 기본 개념 정리",
          description: "국내 주요 관광지 20개의 특징 정리. 카드 만들기. 15분.",
          activity_type: "지리학습",
          duration_minutes: 15,
          difficulty: 1,
          measurement: "20개 지점 정리"
        },
        {
          title: "자격증 시험 정보 정리",
          description: "투운사 시험 일정, 출제 범위, 합격선 등 기본 정보 정리. 10분.",
          activity_type: "시험준비",
          duration_minutes: 10,
          difficulty: 1,
          measurement: "정보 정리 완료"
        }
      ],
      2: [ // 난이도 2 (보통)
        {
          title: "투운사 법규 학습 - 2단원",
          description: "제2단원(관광사업법) 상세 학습. 핵심 조항 15개 필기. 25분.",
          activity_type: "법규학습",
          duration_minutes: 25,
          difficulty: 2,
          measurement: "2단원 완료"
        },
        {
          title: "기출문제 풀이 - 30문제",
          description: "최근 3년 기출문제 30문제 풀이. 오답 표시. 30분.",
          activity_type: "문제풀이",
          duration_minutes: 30,
          difficulty: 2,
          measurement: "30문제 완료"
        },
        {
          title: "관광지리 + 문화상식 통합 정리",
          description: "관광지별 역사, 문화, 특산품 정리. 50개 지점. 25분.",
          activity_type: "지리학습",
          duration_minutes: 25,
          difficulty: 2,
          measurement: "50개 지점 완료"
        }
      ],
      3: [ // 난이도 3 (어려움)
        {
          title: "법규 전체 복습 및 모의고사 풀이",
          description: "1~4단원 전체 복습 후 모의고사 60문제 풀이. 50분.",
          activity_type: "모의고사",
          duration_minutes: 50,
          difficulty: 3,
          measurement: "60문제 완료"
        },
        {
          title: "오답 분석 및 약점 보강 - 집중 학습",
          description: "지난 기출문제 오답 20개를 분석하고 관련 내용 심화 학습. 40분.",
          activity_type: "문제풀이",
          duration_minutes: 40,
          difficulty: 3,
          measurement: "20개 오답 분석 완료"
        },
        {
          title: "최종 모의고사 + 채점 + 분석",
          description: "최종 모의고사 60문제 풀이, 채점, 오답 분석까지 완료. 60분.",
          activity_type: "모의고사",
          duration_minutes: 60,
          difficulty: 3,
          measurement: "모의고사 완료"
        }
      ]
    }
  },
  "책 30분 읽기": {
    roadmap: [
      { week: 1, phase: "기초", focus: "독서 습관", activities: ["가벼운 책 읽기", "요약하기"] },
      { week: 2, phase: "기초", focus: "집중력 강화", activities: ["깊이 있는 책", "필기하며 읽기"] }
    ],
    missions: {
      1: [ // 난이도 1 (쉬움)
        {
          title: "재미있는 책 읽기 - 20분",
          description: "선호하는 가벼운 소설이나 만화책 읽기. 20분.",
          activity_type: "독서",
          duration_minutes: 20,
          difficulty: 1,
          measurement: "20분 완독"
        },
        {
          title: "책 제목/챕터 목록 정리",
          description: "읽은 책의 구성을 정리하고 각 챕터 1줄 요약. 10분.",
          activity_type: "독서활동",
          duration_minutes: 10,
          difficulty: 1,
          measurement: "목록 완성"
        },
        {
          title: "책 구매 또는 도서관 방문",
          description: "다음 읽을 책을 선택하고 구매 또는 대출. 15분.",
          activity_type: "독서준비",
          duration_minutes: 15,
          difficulty: 1,
          measurement: "1권 확보"
        }
      ],
      2: [ // 난이도 2 (보통)
        {
          title: "가벼운 책 읽기 - 30분",
          description: "선호하는 소설이나 에세이를 30분 동안 읽기. 핸드폰 멀리.",
          activity_type: "독서",
          duration_minutes: 30,
          difficulty: 2,
          measurement: "30분 완독"
        },
        {
          title: "책 내용 요약 정리",
          description: "읽은 책의 핵심 내용을 A4 1장에 요약. 주요 개념 3-5개. 15분.",
          activity_type: "독서활동",
          duration_minutes: 15,
          difficulty: 2,
          measurement: "요약본 완성"
        },
        {
          title: "독서 감상문 작성",
          description: "읽은 책에 대해 자유롭게 감상문 작성. 인상 깊은 장면 2개. 20분.",
          activity_type: "창작",
          duration_minutes: 20,
          difficulty: 2,
          measurement: "감상문 완성"
        }
      ],
      3: [ // 난이도 3 (어려움)
        {
          title: "문학작품 집중 읽기 - 45분",
          description: "고전문학이나 전문서적을 45분 동안 집중해서 읽기. 필기 병행.",
          activity_type: "독서",
          duration_minutes: 45,
          difficulty: 3,
          measurement: "45분 완독"
        },
        {
          title: "책 비판적 분석 및 서평 작성",
          description: "책의 논리, 주장, 문제점을 분석하고 A4 2페이지 분량의 서평 작성. 30분.",
          activity_type: "창작",
          duration_minutes: 30,
          difficulty: 3,
          measurement: "서평 완성"
        },
        {
          title: "독서 토론 준비 및 정리",
          description: "책 내용을 바탕으로 토론 주제 5개 작성 및 주요 인용구 10개 정리. 30분.",
          activity_type: "독서활동",
          duration_minutes: 30,
          difficulty: 3,
          measurement: "토론 자료 완성"
        }
      ]
    }
  }
};

/**
 * 목표에 맞는 미션 가져오기 (난이도별)
 */
export const getMissionsForGoal = (goalTitle, difficulty = 2) => {
  // 정확한 매칭
  if (missionDatabase[goalTitle]) {
    const goalData = missionDatabase[goalTitle];
    return {
      roadmap: goalData.roadmap,
      missions: goalData.missions[difficulty] || goalData.missions[2]
    };
  }

  // 부분 매칭
  for (const [key, data] of Object.entries(missionDatabase)) {
    if (goalTitle.includes(key) || key.includes(goalTitle)) {
      return {
        roadmap: data.roadmap,
        missions: data.missions[difficulty] || data.missions[2]
      };
    }
  }

  return null;
};