import React, {
  useEffect,
  useState
} from "react";

import GlassCard from "../../components/shared/GlassCard";
import Icon from "../../components/ui/Icon";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  doc,
  getDoc
} from "firebase/firestore";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  db,
  auth
} from "../../firebase";

const AuditLogsPage = () => {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [hasAccess, setHasAccess] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState(null);

  useEffect(() => {

    let unsubscribeLogs = null;

    const unsubscribeAuth =
      onAuthStateChanged(
        auth,

        async (user) => {

          if (!user) {

            setHasAccess(false);
            setLoading(false);

            return;
          }

          try {

            setCurrentUser(user);

            // Get user role
            const userRef =
              doc(db, "users", user.uid);

            const userSnap =
              await getDoc(userRef);

            if (!userSnap.exists()) {

              console.warn(
                "User profile missing"
              );

              setHasAccess(false);
              setLoading(false);

              return;
            }

            const userData =
              userSnap.data();

            const role =
              userData.role || "researcher";

            // Access control
            if (
              !["admin", "reviewer"]
                .includes(role)
            ) {

              setHasAccess(false);
              setLoading(false);

              return;
            }

            setHasAccess(true);

            // Optimized query
            const logsQuery = query(
              collection(db, "auditLogs"),

              orderBy(
                "createdAt",
                "desc"
              ),

              limit(25)
            );

            unsubscribeLogs =
              onSnapshot(

                logsQuery,

                (snapshot) => {

                  const logsData =
                    snapshot.docs.map(
                      (doc) => ({

                        id: doc.id,

                        ...doc.data(),
                      })
                    );

                  setLogs(logsData);

                  setLoading(false);
                },

                (error) => {

                  console.error(
                    "Audit logs listener error:",
                    error
                  );

                  setLoading(false);
                }
              );

          } catch (error) {

            console.error(
              "Audit access error:",
              error
            );

            setLoading(false);
          }
        }
      );

    return () => {

      unsubscribeAuth();

      if (unsubscribeLogs) {
        unsubscribeLogs();
      }
    };

  }, []);

  // Severity color
  const getSeverityColor = (action) => {

    if (!action)
      return "text-gray-400";

    if (
      action.includes("Deleted") ||
      action.includes("Failed")
    ) {
      return "text-red-400";
    }

    if (
      action.includes("Approved")
    ) {
      return "text-green-400";
    }

    if (
      action.includes("Warning") ||
      action.includes("Flagged")
    ) {
      return "text-yellow-400";
    }

    return "text-cyan-400";
  };

  return (

    <div className="p-8">

      <GlassCard className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Audit Logs
            </h2>

            <p className="text-gray-400 mt-1">
              Real-time security and activity monitoring
            </p>

          </div>

          {currentUser && (

            <div className="text-sm text-gray-400">

              Logged in as:

              <span className="text-cyan-400 ml-2">
                {currentUser.email}
              </span>

            </div>
          )}

        </div>

        {/* Access denied */}
        {!hasAccess ? (

          <div className="text-center py-20">

            <p className="text-red-400 text-lg">
              Access denied
            </p>

            <p className="text-gray-500 mt-2">
              Admin or Reviewer access required
            </p>

          </div>

        ) : loading ? (

          <div className="text-center py-20">

            <p className="text-gray-400">
              Loading audit logs...
            </p>

          </div>

        ) : logs.length === 0 ? (

          <div className="text-center py-20">

            <p className="text-gray-400">
              No audit logs available
            </p>

          </div>

        ) : (

          <div className="space-y-4">

            {logs.map((log) => (

              <GlassCard
                key={log.id}
                className="p-5 flex items-start gap-4"
              >

                {/* Icon */}
                <div className="bg-cyan-500/20 p-3 rounded-full">

                  <Icon
                    name={
                      log.icon ||
                      "shield"
                    }
                    className="text-cyan-400"
                  />

                </div>

                {/* Content */}
                <div className="flex-1">

                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-white font-semibold">

                        {log.user ||
                          "Unknown User"}

                      </p>

                      <p
                        className={`mt-1 font-medium ${getSeverityColor(log.action)}`}
                      >

                        {log.action ||
                          "Unknown Action"}

                      </p>

                      {log.datasetName && (

                        <p className="text-gray-400 text-sm mt-2">

                          Dataset:

                          <span className="ml-2 text-cyan-300">
                            {log.datasetName}
                          </span>

                        </p>
                      )}

                    </div>

                    {/* Timestamp */}
                    <div className="text-right text-xs text-gray-500">

                      {log.createdAt?.seconds
                        ? new Date(
                            log.createdAt.seconds * 1000
                          ).toLocaleString()
                        : "Unknown time"}

                    </div>

                  </div>

                </div>

              </GlassCard>
            ))}

          </div>
        )}

      </GlassCard>

    </div>
  );
};

export default AuditLogsPage;