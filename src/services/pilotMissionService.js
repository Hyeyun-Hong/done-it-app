
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
import {
  calculateAdjustedDifficulty,
} from "./aiService";
 
/**
 * 파일럿 목표 생성 (목표 분석 + 로드맵 포함)
 */
export const createPilotGoal = async (userId, goalData) => {
  try {
    console.log("🚀 목표 생성 시작:", goalData.title);
 
    // 1. 목표 분석 (API 호출)
    console.log("📊 목표 분석 중...");
    const analysisResponse = await fetch("/api/analyzeGoal", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ goal: goalData.title }),
    });
 
    if (!analysisResponse.ok) {
      throw new Error("Goal analysis API error");
    }
 
    const goalAnalysis = await analysisResponse.json();
    console.log("✅ 목표 분석 완료:", goalAnalysis);
 
    // 2. 로드맵 생성 (API 호출)
    console.log("🗺️ 로드맵 생성 중...");
    const roadmapResponse = await fetch("/api/generateRoadmap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        goal: goalData.title,
        durationMonths: goalData.duration_months,
        goalAnalysis,
      }),
    });
 
    if (!roadmapResponse.ok) {
      throw new Error("Roadmap generation API error");
    }
 
    const roadmapData = await roadmapResponse.json();
    const roadmap = roadmapData.roadmap || [];
    console.log("✅ 로드맵 생성 완료:", roadmap.length, "주");
 
    // 3. Firestore에 저장
    const goalsRef = collection(db, "pilot_goals");
    const docRef = await addDoc(goalsRef, {
      userId,
      title: goalData.title,
      description: goalData.description,
      theme: goalData.theme,
      duration_months: goalData.duration_months,
      goalAnalysis,
      roadmap,
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
 * 현재 주차 계산
 */
const calculateCurrentWeek = (startDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return Math.max(1, Math.min(12, week));
};
 
/**
 * 지난 며칠간의 미션 조회 (다양성 보장용)
 */
const getRecentMissions = async (userId, goalId, days = 3) => {
  try {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - days);
    const dateStr = recentDate.toISOString().split("T")[0];
 
    const q = query(
      collection(db, "pilot_missions"),
      where("userId", "==", userId),
      where("goalId", "==", goalId)
    );
 
    const querySnapshot = await getDocs(q);
    const missions = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(m => m.date >= dateStr)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
 
    return missions;
  } catch (error) {
    console.error("Get recent missions error:", error);
    return [];
  }
};
 
/**
 * 오늘의 미션 생성 및 저장 (목표 분석 결과 기반)
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
 
    // 1. 현재 주차 계산
    const currentWeek = calculateCurrentWeek(goal.pilot_start_date);
    console.log(`📅 현재 주차: ${currentWeek}주`);
 
    // 2. 지난 미션 조회 (다양성 보장)
    const recentMissions = await getRecentMissions(userId, goalId, 3);
    console.log(`📝 지난 3일 미션: ${recentMissions.length}개`);
 
    // 3. 난이도 계산
    const currentDifficulty = calculateAdjustedDifficulty(goal.feedback_history);
    console.log(`⭐ 난이도: ${currentDifficulty}/5`);
 
    // 4. 미션 생성 (API 호출)
    console.log("🎬 미션 생성 API 호출 중...");
    const missionsResponse = await fetch("/api/generateMissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        goal: goal.title,
        roadmap: goal.roadmap || [],
        currentWeek,
        previousMissions: recentMissions,
        difficulty: currentDifficulty,
        goalAnalysis: goal.goalAnalysis || null,
      }),
    });
 
    if (!missionsResponse.ok) {
      throw new Error("Mission generation API error");
    }
 
    const missionsData = await missionsResponse.json();
    const missions = missionsData.missions || [];
    console.log("✅ 미션 생성 완료:", missions.length, "개");
 
    // 5. 미션 저장
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
 
    // 6. 목표 정보 업데이트
    const goalUpdateRef = doc(db, "pilot_goals", goal.id);
    await updateDoc(goalUpdateRef, {
      current_difficulty: currentDifficulty,
      current_week: currentWeek,
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
 
    const currentWeek = calculateCurrentWeek(goal.pilot_start_date);
    const weekData = goal.roadmap && goal.roadmap[currentWeek - 1];
    const weekFocus = weekData ? weekData.focus : "목표 달성";
 
    const goalAnalysis = goal.goalAnalysis || {};
 
    return {
      goal: goal.title,
      goalType: goalAnalysis.goal_type || "일반",
      strategies: goalAnalysis.strategies || [],
      keyMetrics: goalAnalysis.key_metrics || "매일 체크",
      currentWeek,
      weekFocus,
      totalDays: Math.ceil(
        (goal.pilot_end_date - goal.pilot_start_date) / (24 * 60 * 60 * 1000)
      ),
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
 






