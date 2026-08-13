import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import GlassCard from "../../components/shared/GlassCard";
import AnimatedInput from "../../components/ui/AnimatedInput";
import AuthSplitLayout from "../../components/auth/AuthSplitLayout";

const SignupPage = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "researcher",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Email/Password Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(user, { displayName: formData.name });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        provider: "email",
        createdAt: new Date(),
      });

      console.log("✅ Signed up:", user);
    } catch (err) {
      console.error("❌ Signup Error:", err.message);

      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Try logging in instead.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Signup/Login
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "researcher",
          provider: "google",
          createdAt: new Date(),
        },
        { merge: true }
      );

      console.log("✅ Google Signup/Login:", user);
    } catch (err) {
      console.error("❌ Google Auth Error:", err.message);
      setError("Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <GlassCard className="w-full rounded-3xl border border-cyan-400/20 bg-slate-900/60 p-6 sm:p-8 shadow-[0_0_16px_#00ffff33]">
        <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-center text-cyan-300">
          Create Account
        </h2>
        <p className="mb-6 text-center text-sm text-slate-300">
          Join BioVault to securely manage biomedical data.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatedInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <AnimatedInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <AnimatedInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* 🔹 Role Selection */}
          <div className="relative">
            <label htmlFor="role" className="block text-gray-400 text-sm mb-2">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white/10 text-white rounded-xl p-3 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option className="bg-gray-800" value="researcher">
                Researcher
              </option>
              <option className="bg-gray-800" value="reviewer">
                Reviewer
              </option>
            </select>
          </div>

          {/* 🔹 Error Message */}
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
              {error.includes("Email already in use") && (
                <button
                  onClick={onLoginClick}
                  className="ml-2 text-cyan-400 underline"
                >
                  Go to Login
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* 🔹 Google Auth */}
        <div className="mt-6">
          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-cyan-300/30 bg-cyan-400/10 text-slate-100 font-semibold hover:bg-cyan-400/15 transition disabled:opacity-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>
        </div>

        {/* 🔹 Login Redirect */}
        <div className="text-center text-gray-400 mt-4 text-sm">
          Already have an account?{" "}
          <button
            onClick={onLoginClick}
            type="button"
            className="text-cyan-400 hover:underline focus:outline-none"
          >
            Login
          </button>
        </div>
      </GlassCard>
    </AuthSplitLayout>
  );
};

export default SignupPage;