import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // firebase.js ka import
import GlassCard from "../../components/shared/GlassCard";
import AnimatedInput from "../../components/ui/AnimatedInput";

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
    <GlassCard className="p-8 w-full max-w-md shadow-[0_0_20px_#00ffff40] border border-cyan-400/20">
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-6">
        BioVault
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
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
          className="w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="text-center text-gray-400 mt-4 text-sm">
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
  );
};

export default LoginPage;
