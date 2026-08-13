import React, { useState, useRef } from "react";
import GlassCard from "../../components/shared/GlassCard";
import AnimatedInput from "../../components/ui/AnimatedInput";

import { db } from "../../firebase";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getAuth } from "firebase/auth";

import Papa from "papaparse";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    access: "public",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // CSV validation
    if (!selectedFile.name.endsWith(".csv")) {
      alert("Only CSV files are allowed");

      return;
    }

    // File size validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");

      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a CSV file");

      return;
    }

    setLoading(true);

    try {
      const auth = getAuth();

      const user = auth.currentUser;

      if (!user) {
        alert("Please login first");

        setLoading(false);

        return;
      }

      // Parse CSV
      Papa.parse(file, {
        header: true,

        skipEmptyLines: true,

        complete: async function (results) {
          try {
            const rows = results.data;

            if (!rows.length) {
              alert("CSV file is empty");

              setLoading(false);

              return;
            }

            // Analytics
            const totalRows = rows.length;

            const columnNames = Object.keys(rows[0]).map((col) =>
              col.toLowerCase(),
            );

            const totalColumns = columnNames.length;

            const previewData = rows.slice(0, 5);

            // Auto category detection
            let category = "General";

            if (
              columnNames.includes("country") ||
              columnNames.includes("vaccinations")
            ) {
              category = "Epidemiology";
            }

            if (
              columnNames.includes("gene") ||
              columnNames.includes("mutation")
            ) {
              category = "Genomics";
            }

            if (
              columnNames.includes("patient") ||
              columnNames.includes("diagnosis")
            ) {
              category = "Clinical Research";
            }

            // Fake risk detection
            let riskLevel = "Low";

            if (totalRows > 1000) {
              riskLevel = "Medium";
            }

            if (totalRows > 10000) {
              riskLevel = "High";
            }

            // Save dataset
            const datasetRef = await addDoc(collection(db, "datasets"), {
              name: formData.name,

              description: formData.description,

              access: formData.access,

              owner: user.email || "Unknown",

              ownerId: user.uid,

              fileName: file.name,

              fileSize: `${(file.size / 1024).toFixed(2)} KB`,

              status: "Processed",

              createdAt: serverTimestamp(),

              totalRows,

              totalColumns,

              columnNames,

              previewData,

              category,

              riskLevel,
            });
            // Create audit log
            await addDoc(collection(db, "auditLogs"), {
              action: "Uploaded Dataset",

              user: user.email,

              datasetName: formData.name,

              createdAt: serverTimestamp(),

              icon: "upload",
            });

            console.log("Audit log created");
            // Activity log
            await addDoc(collection(db, "auditLogs"), {
              action: "Uploaded Dataset",

              datasetId: datasetRef.id,

              datasetName: formData.name,

              user: user.email,

              createdAt: serverTimestamp(),
            });

            alert("Dataset processed successfully");

            // Reset
            setFormData({
              name: "",
              description: "",
              access: "public",
            });

            setFile(null);
          } catch (error) {
            console.error(error);

            alert("Processing failed");
          }

          setLoading(false);
        },
      });
    } catch (error) {
      console.error(error);

      alert("Upload failed");

      setLoading(false);
    }
  };

  return (
    <div className="w-full p-2 sm:p-3">
      <GlassCard className="p-3 sm:p-4 lg:p-5">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Upload Dataset</h2>
          <p className="text-sm text-gray-400 mt-1">
            Upload a CSV file and auto-generate dataset insights.
          </p>
        </div>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center mb-4 cursor-pointer"
          onClick={() => fileInputRef.current.click()}
        >
          <p className="text-gray-400 text-sm sm:text-base">
            Drag and drop your CSV file here, or
            <span className="text-blue-500 underline ml-1">browse</span>
          </p>

          {file && (
            <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2">
              <p className="text-green-400 text-sm break-all">{file.name}</p>

              <p className="text-gray-400 text-sm">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Access */}
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Access Control</label>

            <select
              name="access"
              value={formData.access}
              onChange={handleChange}
              className="w-full bg-white/10 text-white rounded-lg p-2.5 border border-gray-600"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all"
          >
            {loading ? "Processing Dataset..." : "Upload & Analyze Dataset"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default UploadPage;
