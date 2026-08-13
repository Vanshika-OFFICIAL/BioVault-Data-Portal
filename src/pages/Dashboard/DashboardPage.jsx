// src/pages/dashboard/DashboardPage.jsx

import React, { useEffect, useMemo, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Database,
  FileSpreadsheet,
  ShieldAlert,
  Upload,
  User,
  CheckCircle2,
  Clock3,
  ChevronRight,
} from "lucide-react";

import { db } from "../../firebase";

import useAuthStore from "../../state/authStore";

import GlassCard from "../../components/shared/GlassCard";

const DashboardPage = () => {

  const navigate = useNavigate();

  const { user } = useAuthStore();

  const [datasets, setDatasets] = useState([]);

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // REALTIME FIRESTORE
  // =========================================
  useEffect(() => {

    const datasetsQuery = query(
      collection(db, "datasets"),
      orderBy("createdAt", "desc")
    );

    const logsQuery = query(
      collection(db, "auditLogs"),
      orderBy("createdAt", "desc"),
      limit(8)
    );

    const unsubDatasets = onSnapshot(

      datasetsQuery,

      (snapshot) => {

        const datasetsData =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setDatasets(datasetsData);

        setLoading(false);
      },

      (error) => {

        console.error(
          "Dataset listener error:",
          error.message
        );

        setLoading(false);
      }
    );

    const unsubLogs = onSnapshot(

      logsQuery,

      (snapshot) => {

        const logsData =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setLogs(logsData);
      },

      (error) => {

        console.error(
          "Logs listener error:",
          error.message
        );
      }
    );

    return () => {

      unsubDatasets();

      unsubLogs();
    };

  }, []);

  // =========================================
  // ANALYTICS
  // =========================================
  const analytics = useMemo(() => {

    const totalDatasets =
      datasets.length;

    const highRisk =
      datasets.filter(
        (dataset) =>
          dataset.riskLevel === "High"
      ).length;

    const approved =
      datasets.filter(
        (dataset) =>
          dataset.status === "Approved"
      ).length;

    const pending =
      datasets.filter(
        (dataset) =>
          dataset.status === "Pending"
      ).length;

    return {
      totalDatasets,
      highRisk,
      approved,
      pending,
    };

  }, [datasets]);

  // =========================================
  // CATEGORY BREAKDOWN
  // =========================================
  const categoryStats = useMemo(() => {

    const counts = {};

    datasets.forEach((dataset) => {

      const category =
        dataset.category || "General";

      counts[category] =
        (counts[category] || 0) + 1;
    });

    return Object.entries(counts);

  }, [datasets]);

  // =========================================
  // STATUS COLOR
  // =========================================
  const getStatusStyle = (status) => {

    switch (status) {

      case "Approved":
        return "bg-green-500/20 text-green-300 border-green-500/20";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/20";

      case "Flagged":
        return "bg-red-500/20 text-red-300 border-red-500/20";

      default:
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/20";
    }
  };

  // =========================================
  // RISK COLOR
  // =========================================
  const getRiskStyle = (risk) => {

    switch (risk) {

      case "High":
        return "text-red-400";

      case "Medium":
        return "text-yellow-400";

      default:
        return "text-green-400";
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#071021] via-[#081327] to-[#091834] text-white p-2">

      {/* ========================================= */}
      {/* STATS */}
      {/* ========================================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-4 gap-2 mb-10">

        {/* TOTAL */}

        <GlassCard className="p-6 border border-cyan-500/10 hover:border-cyan-400/20 transition-all duration-300">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm uppercase tracking-wider">

                Total Datasets

              </p>

              <h2 className="text-3xl font-black mt-2 text-white">

                {analytics.totalDatasets}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

              <Database className="text-cyan-400 w-8 h-8" />

            </div>

          </div>

        </GlassCard>

       
        {/* APPROVED */}

        <GlassCard className="p-6 border border-green-500/10">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm uppercase tracking-wider">

                Approved

              </p>

              <h2 className="text-3xl font-black mt-2 text-green-400">

                {analytics.approved}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">

              <CheckCircle2 className="text-green-400 w-8 h-8" />

            </div>

          </div>

        </GlassCard>

        {/* PENDING */}

        <GlassCard className="p-6 border border-orange-500/10">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm uppercase tracking-wider">

                Pending Review

              </p>

              <h2 className="text-3xl font-black mt-2 text-orange-400">

                {analytics.pending}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">

              <Clock3 className="text-orange-400 w-8 h-8" />

            </div>

          </div>

        </GlassCard>

        {/* RISK */}

        <GlassCard className="p-6 border border-red-500/10">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm uppercase tracking-wider">

                High Risk

              </p>

              <h2 className="text-3xl font-black mt-2 text-red-400">

                {analytics.highRisk}

              </h2>

            </div>

            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">

              <ShieldAlert className="text-red-400 w-8 h-8" />

            </div>

          </div>

        </GlassCard>

      </div>

      {/* ========================================= */}
      {/* MAIN GRID */}
      {/* ========================================= */}

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-8">

        {/* ========================================= */}
        {/* RECENT DATASETS */}
        {/* ========================================= */}

        <GlassCard className="2xl:col-span-2 p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-3xl font-bold text-white">

                Recent Datasets

              </h2>

              <p className="text-gray-400 mt-2">

                Latest uploaded biomedical datasets

              </p>

            </div>

            <FileSpreadsheet className="text-cyan-400 w-8 h-8" />

          </div>

          <div className="space-y-5">

            {datasets.length > 0 ? (

              datasets.map((dataset) => (

                <div

                  key={dataset.id}

                  onClick={() =>
                    navigate("/datasets")
                  }

                  className="cursor-pointer bg-white/5 border border-cyan-500/10 hover:border-cyan-400/30 transition-all duration-300 rounded-2xl p-6 hover:scale-[1.01]"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-3">

                        <h3 className="text-2xl font-bold text-white">

                          {dataset.name ||
                            "Untitled Dataset"}

                        </h3>

                        <ChevronRight className="text-cyan-400 w-5 h-5" />

                      </div>

                      <p className="text-gray-400 mt-2">

                        {dataset.description ||
                          "No description available"}

                      </p>

                    </div>

                    <div className="flex items-center gap-3 flex-wrap">

                      <span
                        className={`px-4 py-2 rounded-full text-sm border ${getStatusStyle(dataset.status)}`}
                      >

                        {dataset.status || "Pending"}

                      </span>

                      <span
                        className={`font-semibold ${getRiskStyle(dataset.riskLevel)}`}
                      >

                        {dataset.riskLevel || "Low"} Risk

                      </span>

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                    <div className="bg-black/20 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">

                        Category

                      </p>

                      <p className="text-white mt-2 font-medium">

                        {dataset.category || "General"}

                      </p>

                    </div>

                    <div className="bg-black/20 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">

                        Rows

                      </p>

                      <p className="text-white mt-2 font-medium">

                        {dataset.totalRows || 0}

                      </p>

                    </div>

                    <div className="bg-black/20 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">

                        Columns

                      </p>

                      <p className="text-white mt-2 font-medium">

                        {dataset.totalColumns || 0}

                      </p>

                    </div>

                    <div className="bg-black/20 rounded-xl p-4">

                      <p className="text-gray-500 text-sm">

                        Owner

                      </p>

                      <p className="text-white mt-2 font-medium truncate">

                        {dataset.owner || "Unknown"}

                      </p>

                    </div>

                  </div>

                </div>
              ))

            ) : (

              <div className="text-center py-20">

                <Upload className="mx-auto text-cyan-400 w-16 h-16 mb-6" />

                <h3 className="text-2xl font-bold text-white">

                  No Datasets Yet

                </h3>

                <p className="text-gray-400 mt-3">

                  Upload your first biomedical dataset to begin analytics.

                </p>

                <button

                  onClick={() =>
                    navigate("/upload")
                  }

                  className="mt-8 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all duration-300"
                >

                  Upload Dataset

                </button>

              </div>
            )}

          </div>

        </GlassCard>

        {/* ========================================= */}
        {/* SIDEBAR */}
        {/* ========================================= */}

        <div className="space-y-8">

          {/* ACTIVITY */}

          <GlassCard className="p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-white">

                Activity

              </h2>

              <Activity className="text-cyan-400" />

            </div>

            <div className="space-y-4">

              {logs.length > 0 ? (

                logs.map((log) => (

                  <div
                    key={log.id}
                    className="border border-cyan-500/10 rounded-xl p-4 bg-white/5"
                  >

                    <div className="flex justify-between gap-4">

                      <div>

                        <p className="text-white font-semibold">

                          {log.user || "Unknown"}

                        </p>

                        <p className="text-gray-400 text-sm mt-1">

                          {log.action || "Activity"}

                        </p>

                      </div>

                      <div>

                        <Activity className="text-cyan-400 w-5 h-5" />

                      </div>

                    </div>

                  </div>
                ))

              ) : (

                <p className="text-gray-400">

                  No recent activity

                </p>
              )}

            </div>

          </GlassCard>

          {/* CATEGORY BREAKDOWN */}

          <GlassCard className="p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-white">

                Categories

              </h2>

              <BarChart3 className="text-cyan-400" />

            </div>

            <div className="space-y-4">

              {categoryStats.length > 0 ? (

                categoryStats.map(
                  ([category, count]) => (

                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >

                      <div>

                        <p className="text-white font-medium">

                          {category}

                        </p>

                      </div>

                      <div className="px-4 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">

                        {count}

                      </div>

                    </div>
                  )
                )

              ) : (

                <p className="text-gray-400">

                  No category data

                </p>
              )}

            </div>

          </GlassCard>

        </div>

      </div>

    </div>
  );
};

export default DashboardPage;