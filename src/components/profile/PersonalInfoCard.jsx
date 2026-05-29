import React, { useState } from "react";

import Card from "../cards/Card";

import {
  User,
  Mail,
  Shield,
  Save,
  X,
  Pencil,
} from "lucide-react";

import useAuthStore from "../../state/authStore";

const PersonalInfoCard = ({ user }) => {

  const { updateUserProfile } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({

    name: user?.name || "",

    email: user?.email || "",
  });

  // INPUT CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SAVE
  const handleSave = async () => {

    try {

      setLoading(true);

      await updateUserProfile(user.uid, {

        name: formData.name,

        email: formData.email,
      });

      alert("Profile updated successfully");

      setIsEditing(false);

    } catch (err) {

      console.error(err);

      alert("Failed to update profile");

    } finally {

      setLoading(false);
    }
  };

  // CANCEL
  const handleCancel = () => {

    setFormData({

      name: user?.name || "",

      email: user?.email || "",
    });

    setIsEditing(false);
  };

  return (

    <Card className="p-5 rounded-2xl">

      {/* HEADER */}

      <div className="flex items-start justify-between mb-6">

        <div>

          <h2 className="text-xl font-bold text-white">

            Personal Information

          </h2>

          <p className="text-gray-400 text-sm mt-1">

            Manage your profile details

          </p>

        </div>

        {!isEditing ? (

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 text-black text-sm font-semibold shadow-md"
          >

            <Pencil size={16} />

            Edit

          </button>

        ) : (

          <div className="flex gap-2">

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 transition-all duration-300 text-black text-sm font-semibold"
            >

              <Save size={16} />

              {loading ? "Saving..." : "Save"}

            </button>

            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400 transition-all duration-300 text-black text-sm font-semibold"
            >

              <X size={16} />

              Cancel

            </button>

          </div>
        )}

      </div>

      {/* INFO */}

      <div className="space-y-5">

        {/* NAME */}

        <div className="border-b border-white/10 pb-4">

          <div className="flex items-center gap-2 mb-2">

            <User size={16} className="text-cyan-300" />

            <p className="text-gray-400 text-sm">

              Full Name

            </p>

          </div>

          {isEditing ? (

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-cyan-400/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          ) : (

            <h3 className="text-lg font-semibold text-white break-all">

              {user?.name || "Unknown User"}

            </h3>
          )}

        </div>

        {/* EMAIL */}

        <div className="border-b border-white/10 pb-4">

          <div className="flex items-center gap-2 mb-2">

            <Mail size={16} className="text-cyan-300" />

            <p className="text-gray-400 text-sm">

              Email Address

            </p>

          </div>

          {isEditing ? (

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-cyan-400/20 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          ) : (

            <h3 className="text-base font-medium text-white break-all">

              {user?.email || "No Email"}

            </h3>
          )}

        </div>

        {/* ROLE */}

        <div className="pb-1">

          <div className="flex items-center gap-2 mb-2">

            <Shield size={16} className="text-cyan-300" />

            <p className="text-gray-400 text-sm">

              Role

            </p>

          </div>

          <div className="inline-flex px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20">

            <span className="text-cyan-300 text-sm font-medium capitalize">

              {user?.role || "researcher"}

            </span>

          </div>

        </div>

      </div>

    </Card>
  );
};

export default PersonalInfoCard;