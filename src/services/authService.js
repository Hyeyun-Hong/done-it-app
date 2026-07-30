import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// 회원가입
export const signup = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // Firestore에 사용자 정보 저장
    const userId = userCredential.user.uid;
    await setDoc(doc(db, "users", userId), {
      email,
      name,
      createdAt: new Date(),
      points: 0,
    });
    
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

// 로그인
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// 로그아웃
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// 현재 사용자 확인
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};