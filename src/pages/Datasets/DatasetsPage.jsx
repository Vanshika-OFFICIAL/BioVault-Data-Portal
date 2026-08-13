// src/pages/datasets/DatasetsPage.jsx
import React, { useState, useEffect } from "react";
import GlassCard from "../../components/shared/GlassCard";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

const DatasetsPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    // 🔹 Firestore real-time listener
    const q = query(collection(db, "datasets"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDatasets(data);
    });

    return () => unsub();
  }, []);

  const filteredDatasets = datasets.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full text-white font-sans p-2 sm:p-3">
      <GlassCard className="p-3 sm:p-4 shadow-[0_0_20px_#00ffff30] border border-cyan-400/20">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 tracking-wide">
              Datasets
          </h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search datasets..."
            className="w-full sm:w-64 bg-white/10 text-white rounded-lg p-2.5 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
        </div>

        {filteredDatasets.length === 0 && (
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 px-4 py-6 text-center text-gray-300">
            No datasets found.
          </div>
        )}

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filteredDatasets.map((dataset) => (
            <div
              key={dataset.id}
              className="rounded-xl border border-cyan-500/20 bg-white/5 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate">{dataset.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{dataset.owner || "Unknown owner"}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
                    dataset.status === "Approved"
                      ? "bg-green-600"
                      : dataset.status === "Pending"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                >
                  {dataset.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20">
                  {dataset.category || "General"}
                </span>
                <span className="text-xs text-gray-300">{dataset.fileSize || "N/A"}</span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setExpandedRow(expandedRow === dataset.id ? null : dataset.id)
                }
                className="mt-3 text-cyan-300 text-sm font-medium hover:text-white transition-colors"
              >
                {expandedRow === dataset.id ? "Hide details" : "View details"}
              </button>

              {expandedRow === dataset.id && (
                <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-3">
                  <div>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {dataset.description || "No description available"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-lg p-2.5 border border-cyan-500/10">
                      <p className="text-[11px] text-gray-400">Rows</p>
                      <p className="text-cyan-300 font-semibold">{dataset.totalRows || 0}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2.5 border border-cyan-500/10">
                      <p className="text-[11px] text-gray-400">Columns</p>
                      <p className="text-cyan-300 font-semibold">{dataset.totalColumns || 0}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto rounded-xl">
          <table className="min-w-full text-white">
              <thead>
                <tr className="border-b border-cyan-500 text-cyan-300 uppercase text-sm tracking-wider">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left hidden md:table-cell">
                    Size
                  </th>
                  <th className="py-3 px-4 text-left hidden lg:table-cell">
                    Owner
                  </th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
            <tbody>
              {filteredDatasets.map((dataset) => (
                  <React.Fragment key={dataset.id}>
                    <tr
                      className="hover:bg-cyan-500/10 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedRow(
                          expandedRow === dataset.id ? null : dataset.id,
                        )
                      }
                    >
                      <td className="py-4 px-4 font-semibold">
                        {dataset.name}
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-sm border border-cyan-500/20">
                          {dataset.category || "General"}
                        </span>
                      </td>

                      <td className="py-4 px-4 hidden md:table-cell text-gray-300">
                        {dataset.fileSize || "N/A"}
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        {dataset.owner}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded-full
                          ${
                            dataset.status === "Approved"
                              ? "bg-green-600"
                              : dataset.status === "Pending"
                                ? "bg-yellow-600"
                                : "bg-red-600"
                          }`}
                        >
                          {dataset.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-cyan-300 hover:text-white transition-colors font-medium">
                          View
                        </button>
                      </td>
                    </tr>

                    {expandedRow === dataset.id && (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-4 lg:p-5 bg-cyan-950/10 border-b border-cyan-500/20"
                        >
                          {/* Description */}
                            <div className="mb-4">
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
                              Description
                            </p>

                            <p className="text-gray-200 leading-relaxed">
                              {dataset.description ||
                                "No description available"}
                            </p>
                          </div>

                          {/* Access */}
                          <div className="mb-4 flex items-center gap-3">
                            <span className="text-gray-400">Access Level:</span>

                            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-sm">
                              {dataset.access || "public"}
                            </span>
                          </div>

                          {/* Analytics Cards */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                            <div className="bg-white/5 border border-cyan-500/10 rounded-xl p-4">
                              <p className="text-gray-400 text-sm">Rows</p>

                              <h3 className="text-2xl font-bold text-cyan-400 mt-2">
                                {dataset.totalRows || 0}
                              </h3>
                            </div>

                            <div className="bg-white/5 border border-cyan-500/10 rounded-xl p-4">
                              <p className="text-gray-400 text-sm">Columns</p>

                              <h3 className="text-2xl font-bold text-cyan-400 mt-2">
                                {dataset.totalColumns || 0}
                              </h3>
                            </div>

                            <div className="bg-white/5 border border-cyan-500/10 rounded-xl p-4">
                              <p className="text-gray-400 text-sm">Category</p>

                              <h3 className="text-lg font-bold text-white mt-2">
                                {dataset.category || "General"}
                              </h3>
                            </div>

                            <div className="bg-white/5 border border-cyan-500/10 rounded-xl p-4">
                              <p className="text-gray-400 text-sm">Risk</p>

                              <h3
                                className={`text-lg font-bold mt-2 ${
                                  dataset.riskLevel === "High"
                                    ? "text-red-400"
                                    : dataset.riskLevel === "Medium"
                                      ? "text-yellow-400"
                                      : "text-green-400"
                                }`}
                              >
                                {dataset.riskLevel || "Low"}
                              </h3>
                            </div>
                          </div>

                          {/* Column Names */}
                          <div className="mb-4">
                            <h3 className="text-cyan-400 font-semibold mb-3">
                              Dataset Columns
                            </h3>

                            <div className="flex flex-wrap gap-2">
                              {dataset.columnNames?.map((col, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm"
                                >
                                  {col}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Preview Table */}
                          <div>
                            <h3 className="text-cyan-400 font-semibold mb-4">
                              Dataset Preview
                            </h3>

                            <div className="overflow-x-auto rounded-xl border border-cyan-500/20">
                              <table className="w-full text-sm">
                                <thead className="bg-cyan-950/40">
                                  <tr>
                                    {dataset.columnNames?.map((col, index) => (
                                      <th
                                        key={index}
                                        className="p-3 text-left text-cyan-300"
                                      >
                                        {col}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {dataset.previewData?.map((row, rowIndex) => (
                                    <tr
                                      key={rowIndex}
                                      className="border-t border-cyan-500/10 hover:bg-cyan-500/5"
                                    >
                                      {Object.values(row).map((value, i) => (
                                        <td
                                          key={i}
                                          className="p-3 text-gray-300"
                                        >
                                          {String(value)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default DatasetsPage;
