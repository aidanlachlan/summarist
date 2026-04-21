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

/**
 * Creates a Stripe checkout session and returns the checkout URL.
 * 
 * Flow:
 * 1. Write checkout request to Firestore
 * 2. Firebase Stripe Extension detects it, calls Stripe API
 * 3. Extension writes checkout URL back to same document
 * 4. Listen for that URL and return it
 */
export const getCheckoutUrl = async (priceId: string): Promise<string> => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User is not authenticated");

  // Path: customers/{userId}/checkout_sessions/{auto-generated-id}
  const checkoutSessionsCollection = collection(
    db,
    "customers",
    userId,
    "checkout_sessions"
  );

  // Step 1: Write checkout request to Firestore
  const checkoutRequestDoc = await addDoc(checkoutSessionsCollection, {
    price: priceId,
    success_url: window.location.origin + "/for-you",
    cancel_url: window.location.origin + "/choose-plan",
  });

  // Step 2-4: Listen for the Stripe Extension to write the checkout URL back
  return new Promise<string>((resolve, reject) => {
    const unsubscribe = onSnapshot(checkoutRequestDoc, (snapshot) => {
      const checkoutSession = snapshot.data() as {
        error?: { message: string };
        url?: string;  // Stripe checkout URL, written by Extension
      };

      // Extension encountered an error
      if (checkoutSession?.error) {
        unsubscribe();
        reject(new Error(`Stripe error: ${checkoutSession.error.message}`));
      }

      // Extension successfully wrote the Stripe checkout URL
      if (checkoutSession?.url) {
        unsubscribe();
        resolve(checkoutSession.url);
      }

      // Otherwise, still waiting for Extension to process...
    });
  });
};

/**
 * Gets a URL to the Stripe Customer Portal where users can manage their subscription.
 * This calls a Firebase Cloud Function directly.
 */
export const getPortalUrl = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error("User is not authenticated");

  const functions = getFunctions(app, "us-central1");
  
  // Call the Stripe Extension's portal link function directly
  const createPortalLink = httpsCallable(
    functions,
    "ext-firestore-stripe-payments-createPortalLink"
  );

  const response = await createPortalLink({
    returnUrl: window.location.origin + "/settings",
  });

  const portalData = response.data as { url: string };

  if (portalData.url) {
    return portalData.url;
  } else {
    throw new Error("No portal URL returned");
  }
};