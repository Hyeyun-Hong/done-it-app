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
import { generateMissions, calculateAdjustedDifficulty } from "./aiService";

/**
 * 파일럿 목표 생성
 */
export const createPilotGoal = async (userId, goalData) => {
  try {
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

    return docRef.id;
  } catch (error) {
    console.error("Create pilot goal error:", error);
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
 * 사용자의 모든 파일럿 목표 조회 (여러 개)
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
 * 오늘의 미션 생성 및 저장 (goalId 기반)
 */
export const generateAndSaveTodayMissions = async (userId, goalId) => {
  try {
    const goalRef = doc(db, "pilot_goals", goalId);
    const goalDoc = await getDoc(goalRef);
    
    if (!goalDoc.exists()) {
      throw new Error("Goal not found");
    }
    
    const goal = { id: goalDoc.id, ...goalDoc.data() };

    const currentDifficulty = calculateAdjustedDifficulty(goal.feedback_history);

    const missions = await generateMissions(
      goal.title,
      goal.duration_months,
      currentDifficulty
    );

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
        duration_minutes: missions[i].duration_minutes,
        difficulty: missions[i].difficulty,
        status: "pending",
        feedback: null,
        createdAt: serverTimestamp(),
      });
      missionIds.push(missionRef.id);
    }

    const goalUpdateRef = doc(db, "pilot_goals", goal.id);
    await updateDoc(goalUpdateRef, {
      current_difficulty: currentDifficulty,
    });

    return missionIds;
  } catch (error) {
    console.error("Generate missions error:", error);
    throw error;
  }
};

/**
 * 오늘의 미션 조회 (goalId로 필터링)
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
 * 미션 피드백 저장 및 난이도 조정
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

    return true;
  } catch (error) {
    console.error("Save feedback error:", error);
    throw error;
  }
};

/**
 * 파일럿 통계 조회 (단일 목표 기반)
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
      totalDays: Math.ceil((goal.pilot_end_date - goal.pilot_start_date) / (24 * 60 * 60 * 1000)),
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