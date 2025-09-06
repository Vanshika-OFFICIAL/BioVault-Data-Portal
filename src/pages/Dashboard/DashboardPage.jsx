// src/pages/dashboard/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import Icon from '../../components/ui/Icon';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const DashboardPage = () => {
  const [stats, setStats] = useState({ total: 0 });
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // 🔹 Total datasets count
    const unsubDatasets = onSnapshot(collection(db, "datasets"), (snapshot) => {
      setStats({ total: snapshot.size });
    });

    // 🔹 Audit logs
    const unsubLogs = onSnapshot(collection(db, "auditLogs"), (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 🔹 Alerts
    const unsubAlerts = onSnapshot(collection(db, "alerts"), (snapshot) => {
      setAlerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubDatasets();
      unsubLogs();
      unsubAlerts();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0b1225] to-[#0e1633] text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-xl font-semibold tracking-wide text-cyan-400">BIOMED DATA // SECURE PORTAL</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-cyan-400/30 flex items-center justify-center">
              <Icon name="user" className="text-cyan-300" />
            </div>
            <span className="text-gray-200">Welcome, Dr. Chen (Admin)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 relative">
        {/* Datasets Count */}
        <GlassCard className="p-6 relative z-10">
          <h3 className="text-lg font-semibold text-gray-300">Total Datasets</h3>
          <p className="text-5xl font-bold text-white mt-2">{stats.total}</p>
          <div className="mt-4 w-full h-24 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-lg"></div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6 relative z-10">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">Recent Activity</h3>
          <ul className="space-y-3">
            {logs.length > 0 ? logs.map(log => (
              <li key={log.id} className="flex items-center justify-between bg-white/5 p-2 rounded-md">
                <span className="text-sm text-gray-200">
                  <span className="font-semibold text-white">{log.user}</span> {log.action}
                </span>
                <span className="text-xs text-gray-500">{log.time}</span>
              </li>
            )) : (
              <li className="text-gray-400 text-sm">No activity yet</li>
            )}
          </ul>
        </GlassCard>

        {/* Alerts */}
        <GlassCard className="p-6 relative z-10">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">System Alerts</h3>
          <ul className="space-y-4">
            {alerts.length > 0 ? alerts.map(alert => (
              <li key={alert.id} className={`flex items-center p-3 rounded-lg border 
                ${alert.severity === 'critical' 
                  ? 'bg-red-900/40 border-red-500/60' 
                  : 'bg-yellow-900/40 border-yellow-500/60'}`}>
                <span className="text-xl font-bold text-red-400 mr-3">!</span>
                <p className="text-sm text-gray-200">{alert.message}</p>
              </li>
            )) : (
              <li className="text-gray-400 text-sm">No alerts</li>
            )}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
