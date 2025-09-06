// src/pages/profile/ProfilePage.jsx
import React, { useState } from "react";
import GlassCard from "../../components/shared/GlassCard";
import AnimatedInput from "../../components/ui/AnimatedInput";
import useAuthStore from "../../state/authStore";
import BackgroundWrapper from "../../components/layout/BackgroundWrapper";
import { db, auth } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const { user, setUser } = useAuthStore(); // ✅ need setter in authStore
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || "Dr. Placeholder",
    email: user?.email || "placeholder@example.com",
    role: user?.role || "researcher",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "users", user.uid);

      // ✅ Firestore update
      await updateDoc(userRef, {
        name: profile.name,
        email: profile.email,
      });

      // ✅ Firebase Auth update
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profile.name,
        });
      }

      // ✅ Zustand store update
      setUser({
        ...user,
        name: profile.name,
        email: profile.email,
      });

      alert("✅ Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <BackgroundWrapper>
      <GlassCard className="p-8 shadow-[0_0_30px_#00ffff40] border border-cyan-400/30">
        <h2 className="text-3xl font-bold text-cyan-300 mb-8 tracking-wide">
          Profile Settings
        </h2>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-cyan-400/20 border border-cyan-300 flex items-center justify-center text-4xl text-cyan-300 mb-4 shadow-[0_0_20px_#00ffff50]">
            {profile.name.charAt(0)}
          </div>
          <button className="text-cyan-400 hover:underline">
            Change Avatar
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <AnimatedInput
            label="Name"
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <AnimatedInput
            label="Email"
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <AnimatedInput
            label="Role"
            type="text"
            name="role"
            value={profile.role}
            disabled={true}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-white py-2 px-4 rounded-lg mr-2 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            {isEditing && (
              <button
                type="submit"
                className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save Changes
              </button>
            )}
          </div>
        </form>
      </GlassCard>
    </BackgroundWrapper>
  );
};

export default ProfilePage;
