import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // firebase.js ka import
import GlassCard from "../../components/shared/GlassCard";
import AnimatedInput from "../../components/ui/AnimatedInput";
import AuthSplitLayout from "../../components/auth/AuthSplitLayout";

const LoginPage = ({ onSignupClick }) => {
  const [email, setEmail] = useState("");   // username -> email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Logged in:", userCredential.user);
      // Yahan pe aap global store / navigation set kar sakte ho
    } catch (err) {
      console.error("❌ Login Error:", err.message);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <GlassCard className="w-full rounded-3xl border border-cyan-400/20 bg-slate-900/60 p-6 sm:p-8 shadow-[0_0_16px_#00ffff33]">
        <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-center text-cyan-300">
          Welcome Back
        </h2>
        <p className="mb-6 text-center text-sm text-slate-300">
          Sign in to access your BioVault workspace.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatedInput
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <AnimatedInput
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center text-gray-400 text-sm pt-1">
            Don&apos;t have an account?{" "}
            <button
              onClick={onSignupClick}
              type="button"
              className="text-cyan-400 hover:underline focus:outline-none"
            >
              Sign Up
            </button>
          </div>
        </form>
      </GlassCard>
    </AuthSplitLayout>
  );
};

export default LoginPage;
