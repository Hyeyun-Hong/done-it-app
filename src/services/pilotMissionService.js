import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { getMissionsForGoal } from "./missionData";

/**
 * 난이도 계산 (피드백 기반)
 */
const calculateDifficulty = (feedbackHistory) => {
  if (!feedbackHistory || feedbackHistory.length === 0) {
    return 2; // 기본값
  }

  const recentFeedback = feedbackHistory.slice(-3);
  let score = 0;

  recentFeedback.forEach(feedback => {
    if (feedback === "down") score -= 1;
    else if (feedback === "good") score += 0;
    else if (feedback === "up") score += 1;
  });

  const avgScore = score / recentFeedback.length;
  let difficulty = 2;

  if (avgScore <= -0.5) {
    difficulty = Math.max(1, difficulty - 1);
  } else if (avgScore >= 0.5) {
    difficulty = Math.min(3, difficulty + 1);
  }

  return difficulty;
};

/**
 * 파일럿 목표 생성
 */
export const createPilotGoal = async (userId, goalData) => {
  try {
    console.log("🚀 목표 생성 시작:", goalData.title);

    const goalsRef = collection(db, "pilot_goals");
    const docRef = await addDoc(goalsRef, {
      userId,
      title: goalData.title,
      description: goalData.description,
      theme: goalData.theme,
      duration_months: goalData.duration_months,
      pilot_start_date: new Date(),
      pilot_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "active",
      current_difficulty: 2,
      feedback_history: [],
      createdAt: serverTimestamp(),
    });

    console.log("✅ 목표 생성 완료:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Create pilot goal error:", error);
    throw error;
  }
};

/**
 * 사용자의 파일럿 목표 조회 (단일)
 */
export const getPilotGoal = async (userId) => {
  try {
    const q = query(
      collection(db, "pilot_goals"),
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return null;

    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Get pilot goal error:", error);
    return null;
  }
};

/**
 * 사용자의 모든 파일럿 목표 조회
 */
export const getPilotGoals = async (userId) => {
  try {
    const q = query(
      collection(db, "pilot_goals"),
      where("userId", "==", userId),
      where("status", "==", "active")
    );
    const querySnapshot = await getDocs(q);

    const goals = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📋 모든 목표 조회:", goals.length, "개");
    return goals;
  } catch (error) {
    console.error("Get pilot goals error:", error);
    return [];
  }
};

/**
 * 오늘의 미션 생성 및 저장 (난이도별 반영)
 */
export const generateAndSaveTodayMissions = async (userId, goalId) => {
  try {
    const goalRef = doc(db, "pilot_goals", goalId);
    const goalDoc = await getDoc(goalRef);

    if (!goalDoc.exists()) {
      throw new Error("Goal not found");
    }

    const goal = { id: goalDoc.id, ...goalDoc.data() };
    console.log("📌 목표 조회:", goal.title);

    // 난이도 계산 (피드백 기반)
    const difficulty = calculateDifficulty(goal.feedback_history || []);
    console.log(`⭐ 난이도: ${difficulty}/3`);

    // 난이도별 미션 데이터 가져오기
    const missionData = getMissionsForGoal(goal.title, difficulty);

    if (!missionData) {
      console.log("⚠️ 매칭되는 미션 없음. 기본값 사용");
      var missions = [
        {
          title: goal.title + " - 활동 1",
          description: goal.title + "을(를) 위한 활동을 20분 동안 수행하세요.",
          activity_type: "활동",
          duration_minutes: 20,
          difficulty: 2,
          measurement: "완료"
        }
      ];
      var roadmap = [];
    } else {
      var missions = missionData.missions;
      var roadmap = missionData.roadmap;
    }

    console.log("✅ 미션 로드 완료:", missions.length, "개 (난이도", difficulty, ")");

    // 오늘의 미션 저장
    const today = new Date().toISOString().split("T")[0];
    const missionsRef = collection(db, "pilot_missions");

    const missionIds = [];
    for (let i = 0; i < missions.length; i++) {
      const missionRef = await addDoc(missionsRef, {
        userId,
        goalId: goal.id,
        date: today,
        order: i + 1,
        title: missions[i].title,
        description: missions[i].description,
        activity_type: missions[i].activity_type,
        duration_minutes: missions[i].duration_minutes,
        difficulty: missions[i].difficulty,
        measurement: missions[i].measurement,
        status: "pending",
        feedback: null,
        createdAt: serverTimestamp(),
      });
      missionIds.push(missionRef.id);
    }

    // 목표 정보 업데이트
    const goalUpdateRef = doc(db, "pilot_goals", goal.id);
    await updateDoc(goalUpdateRef, {
      roadmap: roadmap,
      current_difficulty: difficulty,
      last_mission_date: today,
    });

    console.log(`✅ ${missions.length}개 미션 생성 완료`);
    return missionIds;
  } catch (error) {
    console.error("❌ Generate missions error:", error);
    throw error;
  }
};

/**
 * 오늘의 미션 조회
 */
export const getTodayMissions = async (userId, goalId) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "pilot_missions"),
      where("userId", "==", userId),
      where("goalId", "==", goalId),
      where("date", "==", today)
    );

    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return missions.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error("Get today missions error:", error);
    return [];
  }
};

/**
 * 미션 완료 처리
 */
export const completeMission = async (missionId) => {
  try {
    const missionRef = doc(db, "pilot_missions", missionId);
    await updateDoc(missionRef, {
      status: "completed",
    });
  } catch (error) {
    console.error("Complete mission error:", error);
    throw error;
  }
};

/**
 * 미션 피드백 저장
 */
export const saveMissionFeedback = async (missionId, goalId, userId, feedback) => {
  try {
    const missionRef = doc(db, "pilot_missions", missionId);
    await updateDoc(missionRef, {
      feedback,
      status: "feedback_recorded",
    });

    const goalRef = doc(db, "pilot_goals", goalId);
    const goal = await getDoc(goalRef);

    if (!goal.exists()) {
      throw new Error("Goal not found");
    }

    const goalData = goal.data();
    const updatedFeedbackHistory = [...(goalData.feedback_history || []), feedback];

    await updateDoc(goalRef, {
      feedback_history: updatedFeedbackHistory,
    });

    console.log(`💬 피드백 저장: ${feedback}`);
    return true;
  } catch (error) {
    console.error("Save feedback error:", error);
    throw error;
  }
};

/**
 * 파일럿 통계 조회
 */
export const getPilotStats = async (userId) => {
  try {
    const goal = await getPilotGoal(userId);
    if (!goal) return null;

    const q = query(
      collection(db, "pilot_missions"),
      where("userId", "==", userId),
      where("goalId", "==", goal.id)
    );

    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs.map(doc => doc.data());

    const totalMissions = missions.length;
    const completedMissions = missions.filter(m => m.status === "completed").length;
    const completionRate = totalMissions > 0 ? (completedMissions / totalMissions) * 100 : 0;

    const feedbacks = missions.filter(m => m.feedback).map(m => m.feedback);
    const downCount = feedbacks.filter(f => f === "down").length;
    const goodCount = feedbacks.filter(f => f === "good").length;
    const upCount = feedbacks.filter(f => f === "up").length;

    return {
      goal: goal.title,
      totalMissions,
      completedMissions,
      completionRate: completionRate.toFixed(1),
      currentDifficulty: goal.current_difficulty,
      feedbackDistribution: {
        down: downCount,
        good: goodCount,
        up: upCount,
      },
    };
  } catch (error) {
    console.error("Get pilot stats error:", error);
    return null;
  }
};