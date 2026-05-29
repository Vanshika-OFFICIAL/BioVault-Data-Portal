import React, { useState } from "react";

import Card from "../cards/Card";

import {
  Shield,
  KeyRound,
  Smartphone,
  Eye,
  EyeOff,
} from "lucide-react";

const SecurityCard = () => {

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = () => {
    alert("Password change feature coming soon");
  };

  const handleEnable2FA = () => {
    alert("2FA feature coming soon");
  };

  return (

    <Card className="p-5 rounded-2xl">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">

          <Shield className="text-cyan-300" size={18} />

        </div>

        <div>

          <h2 className="text-xl font-bold text-white">

            Security

          </h2>

          <p className="text-gray-400 text-sm">

            Manage account protection

          </p>

        </div>

      </div>

      {/* CONTENT */}

      <div className="space-y-4">

        {/* PASSWORD */}

        <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">

              <KeyRound className="text-cyan-300" size={18} />

            </div>

            <div>

              <p className="text-gray-400 text-sm">

                Password

              </p>

              <div className="flex items-center gap-2 mt-1">

                <h3 className="text-sm font-medium text-white">

                  {showPassword
                    ? "mySecurePassword"
                    : "••••••••••"}

                </h3>

                <button
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="text-gray-400 hover:text-cyan-300 transition"
                >

                  {showPassword
                    ? <EyeOff size={16} />
                    : <Eye size={16} />}

                </button>

              </div>

            </div>

          </div>

          <button
            onClick={handlePasswordChange}
            className="px-4 py-2 rounded-lg border border-cyan-400/30 text-cyan-300 text-sm font-medium hover:bg-cyan-400 hover:text-black transition-all duration-300"
          >

            Change

          </button>

        </div>

        {/* 2FA */}

        <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">

              <Smartphone className="text-orange-300" size={18} />

            </div>

            <div>

              <p className="text-gray-400 text-sm">

                Two-Factor Authentication

              </p>

              <h3 className="text-sm font-medium text-orange-400 mt-1">

                Not Enabled

              </h3>

            </div>

          </div>

          <button
            onClick={handleEnable2FA}
            className="px-4 py-2 rounded-lg border border-cyan-400/30 text-cyan-300 text-sm font-medium hover:bg-cyan-400 hover:text-black transition-all duration-300"
          >

            Enable

          </button>

        </div>

      </div>

    </Card>
  );
};

export default SecurityCard;