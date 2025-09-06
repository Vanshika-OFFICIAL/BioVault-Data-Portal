// src/pages/datasets/DatasetsPage.jsx
import React, { useState, useEffect } from "react";
import GlassCard from "../../components/shared/GlassCard";
import BackgroundWrapper from "../../components/layout/BackgroundWrapper";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
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
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BackgroundWrapper>
      <div className="p-8 min-h-screen text-white font-sans">
        <GlassCard className="p-6 shadow-[0_0_20px_#00ffff30] border border-cyan-400/20">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-cyan-300 tracking-wide mb-4 md:mb-0">
              Datasets
            </h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search datasets..."
              className="w-full md:w-64 bg-white/10 text-white rounded-lg p-3 border border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            />
          </div>

          <div className="overflow-x-auto rounded-xl">
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
                          expandedRow === dataset.id ? null : dataset.id
                        )
                      }
                    >
                      <td className="py-4 px-4 font-semibold">{dataset.name}</td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        {dataset.type}
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        {dataset.size}
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
                          className="p-4 bg-white/10 border-b border-cyan-500"
                        >
                          <div className="text-sm text-gray-300 space-y-2">
                            <p>
                              <strong>Description:</strong>{" "}
                              {dataset.description ||
                                "No description available."}
                            </p>
                            <p>
                              <strong>Access Level:</strong> {dataset.access}
                            </p>
                            <div className="mt-4 h-32 bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 border border-cyan-400/30">
                              [Interactive Graph Placeholder]
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
    </BackgroundWrapper>
  );
};

export default DatasetsPage;
