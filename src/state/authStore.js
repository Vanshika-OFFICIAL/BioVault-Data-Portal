import { create } from "zustand";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

// 🔹 Helper: Audit log likhne ka function
const addAuditLog = async (action, user) => {
  if (!user?.uid) return;
  try {
    await addDoc(collection(db, "auditLogs"), {
      action,
      user: user.email || "Unknown",
      uid: user.uid,
      createdAt: serverTimestamp(),
      icon: "activity",
    });
  } catch (err) {
    console.error("Audit log error:", err.code, err.message);
  }
};

// 🔹 Helper: Ensure user doc exists
const ensureUserDoc = async (user, extraData = {}) => {
  if (!user?.uid) return null;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const defaultData = {
      uid: user.uid,
      name: user.displayName || "Unnamed User",
      email: user.email,
      role: "researcher",
      provider: user.providerId || "unknown",
      createdAt: serverTimestamp(),
      ...extraData,
    };
    await setDoc(userRef, defaultData);
    return defaultData;
  }

  return snap.data();
};

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  // 🔹 Initialize listener
  init: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            console.warn("User document not found");
            return;
          }

          const userData = docSnap.data();

          set({
            user: {
              uid: user.uid,
              email: user.email,
              name: user.displayName || userData.name,
              role: userData.role,
            },
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          console.error("Permission error:", err.message);
          set({ user: null, isAuthenticated: false, loading: false });
        }
      } else {
        set({ user: null, isAuthenticated: false, loading: false });
      }
    });
  },

  // 🔹 Email login
  login: async (email, password) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userData = await ensureUserDoc(user);

    set({
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName || userData.name,
        role: userData.role,
      },
      isAuthenticated: true,
    });

    await addAuditLog("User logged in with Email", user);
  },

  // 🔹 Email signup
  signup: async (name, email, password, role) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });

    await ensureUserDoc(user, { name, role, provider: "email" });

    set({
      user: { uid: user.uid, email, name, role },
      isAuthenticated: true,
    });

    await addAuditLog("New user signed up with Email", user);
  },

  // 🔹 Google login/signup
  googleLogin: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userData = await ensureUserDoc(user, { provider: "google" });

    set({
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: userData.role,
      },
      isAuthenticated: true,
    });

    await addAuditLog("User logged in with Google", user);
  },

  // 🔹 Update user profile
  updateUserProfile: async (uid, newData) => {
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, newData);

      if (newData.name && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: newData.name });
      }

      set((state) => ({
        user: { ...state.user, ...newData },
      }));

      await addAuditLog("User updated profile", auth.currentUser);
    } catch (err) {
      console.error("Profile update error:", err.message);
      throw err;
    }
  },

  // 🔹 Directly set user
  setUser: (userData) => set({ user: userData }),

  // 🔹 Logout
  logout: async () => {
    const currentUser = auth.currentUser;
    await signOut(auth);
    set({ user: null, isAuthenticated: false });

    if (currentUser) {
      await addAuditLog("User logged out", currentUser);
    }
  },
}));

export default useAuthStore;