// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (!currentUser) {
          setUser(null);
          setProfile(null);
          return;
        }

        setUser(currentUser);

        // 🔍 Fetch Firestore profile
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          console.warn("⚠️ No profile found for user:", currentUser.uid);
          setProfile(null);
          return;
        }

        const data = snap.data() || {};

        // 🔧 Normalize values
        const department = (data.department || "Strategic Analysis").trim();
        let role = (data.role || "").trim();

        if (!role) {
          if (department.toLowerCase() === "admin") role = "admin";
          else if (department.toLowerCase() === "scientist") role = "scientist";
          else role = "analyst";
        }

        const fixedProfile = {
          ...data,
          uid: currentUser.uid,
          email: currentUser.email,
          department,
          role,
        };

        setProfile(fixedProfile);

        console.log("AuthContext profile loaded:", fixedProfile);

      } catch (err) {
        console.error("❌ AuthContext error:", err);
        setProfile(null);
      } finally {
        setBootLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // 🔐 SIGNUP
  const signup = async (email, password, profileData) => {
    const cleanEmail = email.trim().toLowerCase();

    const userCred = await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password
    );

    const department = (profileData?.department || "Strategic Analysis").trim();

    const role =
      department.toLowerCase() === "admin"
        ? "admin"
        : department.toLowerCase() === "scientist"
        ? "scientist"
        : "analyst";

    const userProfile = {
      uid: userCred.user.uid,
      email: cleanEmail,
      firstName: profileData?.firstName || "",
      lastName: profileData?.lastName || "",
      department,
      role,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userCred.user.uid), userProfile);
    setProfile(userProfile);

    return userCred.user;
  };

  // 🔓 LOGIN
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    return signInWithEmailAndPassword(auth, cleanEmail, password);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setProfile(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signup,
        login,
        logout,
      }}
    >
      {!bootLoading && children}
    </AuthContext.Provider>
  );
};
