import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "./firebase";

const db = getFirestore(app);
const auth = getAuth(app);

export const getCheckoutUrl = async (priceId: string): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  const checkoutSessionRef = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  const docRef = await addDoc(checkoutSessionRef, {
    price: priceId,
    success_url: window.location.origin + "/for-you",
    cancel_url: window.location.origin + "/choose-plan",
  });

  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (snap) => {
      const data = snap.data() as {
        error?: { message: string };
        url?: string;
      };

      if (data?.error) {
        unsubscribe();
        reject(new Error(`An error occurred: ${data.error.message}`));
      }

      if (data?.url) {
        unsubscribe();
        resolve(data.url);
      }
    });
  });
};

export const getPortalUrl = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");

  const functions = getFunctions(app, "us-central1");
  const functionRef = httpsCallable(
    functions,
    "ext-firestore-stripe-payments-createPortalLink"
  );

  const { data } = await functionRef({
    returnUrl: window.location.origin + "/settings",
  });

  const dataWithUrl = data as { url: string };

  if (dataWithUrl.url) {
    return dataWithUrl.url;
  } else {
    throw new Error("No portal URL returned");
  }
};