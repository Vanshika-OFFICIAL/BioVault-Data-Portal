import React from "react";

import ProfileHero from "../../components/profile/ProfileHero";
import PersonalInfoCard from "../../components/profile/PersonalInfoCard";
import SecurityCard from "../../components/profile/SecurityCard";

import useAuthStore from "../../state/authStore";

const ProfilePage = () => {

  const { user } = useAuthStore();

  return (
  <div className="w-full min-h-full p-2 sm:p-3 text-white">
    <div className="mb-4">
      <h1 className="text-3xl font-bold text-cyan-300">
        Account Center
      </h1>

      <p className="text-gray-400 mt-1">
        Manage your BioVault profile, security and preferences.
      </p>
    </div>

    <ProfileHero user={user} />

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mt-3">
      <PersonalInfoCard user={user} />
      <SecurityCard />
    </div>
  </div>
);
};

export default ProfilePage;