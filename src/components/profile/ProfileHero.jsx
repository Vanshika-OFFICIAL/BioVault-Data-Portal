import React, { useRef } from "react";

import {
  Shield,
  Clock3,
  Camera,
  BadgeCheck,
} from "lucide-react";

const ProfileHero = ({ user }) => {

  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    console.log(file);

    alert("Avatar Selected");
  };

  return (

    <div className="rounded-2xl border border-cyan-400/20 bg-[#0b1222]/90 p-3 sm:p-4 shadow-[0_0_40px_rgba(0,255,255,0.06)]">

      <div className="flex flex-col xl:flex-row gap-5 items-center xl:items-start">

        {/* LEFT */}

        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">

          {/* AVATAR */}

          <div className="relative">

            <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full border-4 border-cyan-500/30 bg-cyan-400/10 flex items-center justify-center text-5xl font-bold text-cyan-300 shadow-[0_0_25px_rgba(0,255,255,0.12)]">

              {user?.name?.charAt(0)?.toUpperCase() || "U"}

            </div>

            {/* ONLINE */}

            <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-400 border-2 border-[#060b16]" />

            {/* CAMERA */}

            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-cyan-400 flex items-center justify-center hover:scale-105 transition"
            >

              <Camera className="text-black" size={18} />

            </button>

            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />

          </div>

          {/* USER */}

          <div className="text-center sm:text-left">

            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">

              <h2 className="text-2xl lg:text-4xl font-bold text-white">

                {user?.name || "Tester"}

              </h2>

              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 capitalize text-sm">

                {user?.role || "researcher"}

              </span>

            </div>

            <p className="text-gray-300 text-sm mt-2">

              {user?.email}

            </p>

            <div className="flex items-center gap-2 mt-3 text-green-400 justify-center sm:justify-start">

              <BadgeCheck size={18} />

              <span className="text-base">

                Verified Account

              </span>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full xl:max-w-md">

          {/* CARD */}

          <div className="bg-white/5 border border-cyan-400/10 rounded-xl p-4 w-full">

            <Shield className="text-cyan-300 mb-3" size={24} />

            <p className="text-gray-400 text-sm mb-1">

              Account Status

            </p>

            <h3 className="text-lg font-bold text-green-400">

              Verified

            </h3>

          </div>

          {/* CARD */}

          <div className="bg-white/5 border border-cyan-400/10 rounded-xl p-4 w-full">

            <Clock3 className="text-cyan-300 mb-3" size={24} />

            <p className="text-gray-400 text-sm mb-1">

              Last Login

            </p>

            <h3 className="text-lg font-bold text-white">

              Active

            </h3>

          </div>

          {/* CARD */}

          <div className="bg-white/5 border border-cyan-400/10 rounded-xl p-4 w-full">

            <p className="text-gray-400 text-sm mb-1">

              Profile Completion

            </p>

            <h3 className="text-2xl font-bold text-cyan-300">

              92%

            </h3>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileHero;