import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

// Register new user
export async function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login existing user
export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logoutUser() {
  return signOut(auth);
}

// Guest login (hardcoded credentials)
export async function guestLogin() {
  return signInWithEmailAndPassword(auth, "guest@gmail.com", "guest123");
}