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
      { week: 1, phase: "기초", focus: "금융 용어 익히기", activities: ["금융시장 구조", "투자상품 종류", "주식시장", "채권", "펀드"] },
      { week: 2, phase: "심화", focus: "계산 개념 학습", activities: ["주식 가치평가", "채권 계산", "파생상품", "옵션 전략", "대체투자"] },
      { week: 3, phase: "실전", focus: "포트폴리오·세금·법규", activities: ["포트폴리오 이론", "세금", "법규", "계산문제 100문제"] },
      { week: 4, phase: "완성", focus: "기출 반복 + 오답 보완", activities: ["기출 5회", "오답 복습", "틀린 문제만", "실전 모의고사"] }
    ],
    missions: {
      1: [ // 난이도 1 (1주차 - 금융 용어)
        {
          title: "금융시장 기초 + 금융기관 학습",
          description: "직접금융/간접금융 개념, 금융기관 종류, 금리 개념 학습. 정리 후 기초 문제 20문제 풀이. 90분.",
          activity_type: "이론학습",
          duration_minutes: 90,
          difficulty: 1,
          measurement: "금융시장 구조 완료 + 20문제"
        },
        {
          title: "투자상품 종류 정리 (예금·채권·주식·펀드)",
          description: "각 상품의 특징, 수익률, 위험도를 비교 정리. 차이점 표 만들기. 기초 문제 20문제. 80분.",
          activity_type: "이론학습",
          duration_minutes: 80,
          difficulty: 1,
          measurement: "4가지 상품 완료 + 20문제"
        },
        {
          title: "주식시장·채권·펀드 종류 학습",
          description: "KOSPI/KOSDAQ/ETF/ETN, 채권 종류(국채/회사채), 펀드 구분(공모/사모/개방형/폐쇄형) 학습. 30문제. 75분.",
          activity_type: "이론학습",
          duration_minutes: 75,
          difficulty: 1,
          measurement: "3개 파트 완료 + 30문제"
        }
      ],
      2: [ // 난이도 2 (2주차 - 계산 개념)
        {
          title: "주식 가치평가 계산 (PER·PBR·EPS·ROE)",
          description: "PER/PBR/EPS 계산 방법 학습. 실제 계산 문제 20문제. 오답 표시. 100분.",
          activity_type: "계산학습",
          duration_minutes: 100,
          difficulty: 2,
          measurement: "4가지 지표 계산 + 20문제"
        },
        {
          title: "채권·파생상품 계산 (현재가치·수익률·옵션 손익)",
          description: "채권 현재가치, 만기수익률 계산. 선물/옵션/스왑 개념. 옵션 손익 구조 그리기. 계산 25문제. 110분.",
          activity_type: "계산학습",
          duration_minutes: 110,
          difficulty: 2,
          measurement: "채권+파생상품 계산 완료 + 25문제"
        },
        {
          title: "2주차 기출 1회 풀이 + 오답 분석",
          description: "실제 기출문제 60문제를 시간 제한 없이 풀기. 채점 후 틀린 문제 10개 분석. 120분.",
          activity_type: "기출풀이",
          duration_minutes: 120,
          difficulty: 2,
          measurement: "기출 1회 완료 + 오답 분석"
        }
      ],
      3: [ // 난이도 3 (3~4주차 - 포트폴리오·법규·기출)
        {
          title: "포트폴리오 이론 + 세금 + 법규 집중 학습",
          description: "포트폴리오 이론(베타/CAPM), 투자성과(샤프지수), 세금(배당/양도), 법규(자본시장법/불공정거래) 학습. 150분.",
          activity_type: "이론학습",
          duration_minutes: 150,
          difficulty: 3,
          measurement: "포트폴리오+세금+법규 완료"
        },
        {
          title: "계산문제 집중 100문제 풀이 + 오답",
          description: "3주차 전 범위 계산문제만 100문제 풀이. 모든 오답에 대해 풀이 과정 정리. 120분.",
          activity_type: "계산학습",
          duration_minutes: 120,
          difficulty: 3,
          measurement: "100문제 완료 + 오답 정리"
        },
        {
          title: "기출 2~3회 연속 풀이 + 오답 복습",
          description: "기출 2~3회(총 120문제)를 실전처럼 시간 재고 풀이. 모든 틀린 문제 분석 정리. 180분.",
          activity_type: "기출풀이",
          duration_minutes: 180,
          difficulty: 3,
          measurement: "기출 2회 완료 + 오답 정리"
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