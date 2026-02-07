import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "@/store/authStore";
// Initialize auth listener
export function initAuth() {
  const { setUser } = useAuthStore.getState();

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
}

// Register new user
export async function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login existing user
export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Google login
export async function googleLogin() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Logout
export async function logoutUser() {
  return signOut(auth);
}

// Guest login (hardcoded credentials)
export async function guestLogin() {
  return signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
}