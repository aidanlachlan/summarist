import { create } from "zustand";
import { User } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "@/lib/firebase";

export type SubscriptionStatus = "basic" | "premium" | "premium-plus";

interface AuthState {
  user: User | null | undefined;
  isModalOpen: boolean;
  subscriptionStatus: SubscriptionStatus;
  subscriptionLoading: boolean;
  setUser: (user: User | null) => void;
  openModal: () => void;
  closeModal: () => void;
  fetchSubscription: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  isModalOpen: false,
  subscriptionStatus: "basic",
  subscriptionLoading: true,

  setUser: (user) => {
    set({ user });
    if (user) {
      get().fetchSubscription();
    } else {
      set({ subscriptionStatus: "basic", subscriptionLoading: false });
    }
  },

  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  fetchSubscription: async () => {
    const user = get().user;
    if (!user) {
      set({ subscriptionStatus: "basic", subscriptionLoading: false });
      return;
    }

    set({ subscriptionLoading: true });

    try {
      const db = getFirestore(app);
      const subsCollection = collection(db, "customers", user.uid, "subscriptions");
      const activeSubsQuery = query(
        subsCollection,
        where("status", "in", ["active", "trialing"])
      );
      const subsSnapshot = await getDocs(activeSubsQuery);

      if (!subsSnapshot.empty) {
        const subData = subsSnapshot.docs[0].data();

        if (subData.items?.[0]?.price?.interval === "year") {
          set({ subscriptionStatus: "premium-plus" });
        } else {
          set({ subscriptionStatus: "premium" });
        }
      } else {
        set({ subscriptionStatus: "basic" });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      set({ subscriptionStatus: "basic" });
    } finally {
      set({ subscriptionLoading: false });
    }
  },
}));