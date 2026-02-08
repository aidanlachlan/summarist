import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";

const db = getFirestore(app);

// Get user's saved books
export async function getSavedBooks(userId: string): Promise<string[]> {
  const libraryRef = doc(db, "users", userId, "library", "saved");
  const libraryDoc = await getDoc(libraryRef);

  if (libraryDoc.exists()) {
    return libraryDoc.data().bookIds || [];
  }
  return [];
}

// Get user's finished books
export async function getFinishedBooks(userId: string): Promise<string[]> {
  const libraryRef = doc(db, "users", userId, "library", "finished");
  const libraryDoc = await getDoc(libraryRef);

  if (libraryDoc.exists()) {
    return libraryDoc.data().bookIds || [];
  }
  return [];
}

// Save a book to library
export async function saveBook(userId: string, bookId: string): Promise<void> {
  const libraryRef = doc(db, "users", userId, "library", "saved");
  const libraryDoc = await getDoc(libraryRef);

  if (libraryDoc.exists()) {
    await updateDoc(libraryRef, {
      bookIds: arrayUnion(bookId),
    });
  } else {
    await setDoc(libraryRef, { bookIds: [bookId] });
  }
}

// Remove a book from library
export async function removeBook(userId: string, bookId: string): Promise<void> {
  const libraryRef = doc(db, "users", userId, "library", "saved");
  await updateDoc(libraryRef, {
    bookIds: arrayRemove(bookId),
  });
}

// Check if a book is saved
export async function isBookSaved(userId: string, bookId: string): Promise<boolean> {
  const savedBooks = await getSavedBooks(userId);
  return savedBooks.includes(bookId);
}

// Mark a book as finished
export async function markBookFinished(userId: string, bookId: string): Promise<void> {
  const libraryRef = doc(db, "users", userId, "library", "finished");
  const libraryDoc = await getDoc(libraryRef);

  if (libraryDoc.exists()) {
    await updateDoc(libraryRef, {
      bookIds: arrayUnion(bookId),
    });
  } else {
    await setDoc(libraryRef, { bookIds: [bookId] });
  }
}

// Check if a book is finished
export async function isBookFinished(userId: string, bookId: string): Promise<boolean> {
  const finishedBooks = await getFinishedBooks(userId);
  return finishedBooks.includes(bookId);
}