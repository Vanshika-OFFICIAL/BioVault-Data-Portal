// src/pages/datasets/UploadPage.jsx
import React, { useState, useRef } from "react";
import GlassCard from "../../components/shared/GlassCard";
import AnimatedInput from "../../components/ui/AnimatedInput";
import { db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    access: "public",
  });
  const [file, setFile] = useState(null); // ✅ file state
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null); // ✅ ref for hidden input

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ handle file select
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("Please log in before uploading a dataset.");
        setLoading(false);
        return;
      }

      // ✅ For now we just log file (later integrate Firebase Storage)
      console.log("Uploading dataset:", formData, "File:", file?.name);

      // Firestore mein save karna
      await addDoc(collection(db, "datasets"), {
        name: formData.name,
        description: formData.description,
        access: formData.access,
        owner: user.email || "Unknown",
        ownerId: user.uid,
        fileName: file?.name || null, // ✅ storing filename
        status: "Pending",
        createdAt: serverTimestamp(),
      });

      alert("✅ Dataset uploaded successfully!");
      setFormData({ name: "", description: "", access: "public" });
      setFile(null);
    } catch (error) {
      console.error("Error uploading dataset:", error);
      alert("❌ Upload failed!");
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Upload Dataset</h2>

        {/* Upload Box */}
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center mb-6"
          onClick={() => fileInputRef.current.click()} // ✅ whole box clickable
        >
          <p className="text-gray-400">
            Drag and drop your files here, or{" "}
            <span
              className="text-blue-500 cursor-pointer underline"
              onClick={(e) => {
                e.stopPropagation(); // stop bubbling
                fileInputRef.current.click();
              }}
            >
              browse
            </span>
          </p>
          {file && <p className="mt-3 text-green-400">Selected: {file.name}</p>}
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatedInput
            label="Dataset Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <AnimatedInput
            label="Description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Access dropdown */}
          <div className="relative">
            <label
              htmlFor="access"
              className="block text-gray-400 text-lg mb-2"
            >
              Access Control
            </label>
            <select
              name="access"
              id="access"
              value={formData.access}
              onChange={handleChange}
              className="w-full bg-white/10 text-white rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="bg-gray-800" value="public">
                Public
              </option>
              <option className="bg-gray-800" value="restricted">
                Restricted
              </option>
              <option className="bg-gray-800" value="private">
                Private
              </option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default UploadPage;
