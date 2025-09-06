import React, { useState, useEffect } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import Icon from '../../components/ui/Icon';
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase";

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let unsubLogs = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            console.warn("User document not found");
            setHasAccess(false);
            setLoading(false);
            return;
          }

          const userData = userSnap.data();
          const role = userData.role;

          if (["admin", "reviewer"].includes(role)) {
            setHasAccess(true);

            unsubLogs = onSnapshot(
              collection(db, "auditLogs"),
              (snapshot) => {
                const logData = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setLogs(
                  logData.sort(
                    (a, b) =>
                      (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
                  )
                );
                setLoading(false);
              },
              (error) => {
                console.error("Snapshot listener error:", error.message);
                setLoading(false);
              }
            );
          } else {
            setHasAccess(false);
            setLoading(false);
          }
        } catch (err) {
          console.error("Audit log access error:", err.message);
          setHasAccess(false);
          setLoading(false);
        }
      } else {
        console.warn("User not authenticated — audit logs not loaded.");
        setHasAccess(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubLogs) unsubLogs();
    };
  }, []);

  return (
    <div className="p-8">
      <GlassCard className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Audit Logs</h2>

        {!hasAccess ? (
          <p className="text-red-400">Access denied: You don’t have permission to view audit logs.</p>
        ) : loading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400">No logs found.</p>
        ) : (
          <div className="relative border-l-2 border-gray-700 pl-8">
            {logs.map(log => (
              <div key={log.id} className="relative mb-8">
                <div className="absolute -left-10 transform -translate-x-1/2 bg-blue-500 rounded-full h-8 w-8 flex items-center justify-center">
                  <Icon name={log.icon || "file-text"} className="text-white" />
                </div>
                <GlassCard className="p-4">
                  <p className="text-white font-semibold">{log.user}</p>
                  <p className="text-gray-400 text-sm">{log.action}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {log.createdAt?.seconds
                      ? new Date(log.createdAt.seconds * 1000).toLocaleString()
                      : "Unknown time"}
                  </p>
                </GlassCard>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AuditLogsPage;