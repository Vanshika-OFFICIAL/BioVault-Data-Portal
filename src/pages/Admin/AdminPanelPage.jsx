import React from 'react';
import GlassCard from '../../components/shared/GlassCard';
import useAuthStore from '../../state/authStore';

const AdminPage = () => {
  const { user } = useAuthStore();

  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center text-red-400 bg-gradient-to-br from-[#0a0f1c] via-[#0b1225] to-[#0e1633] min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-4xl font-bold mb-4 tracking-wide">Access Denied</h2>
        <p className="text-lg text-gray-400">You do not have the necessary permissions to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-[#0a0f1c] via-[#0b1225] to-[#0e1633] min-h-screen text-white font-sans relative">
      <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[url('/brain-overlay.png')] bg-contain bg-no-repeat" />
      </div>

      <GlassCard className="p-8 shadow-[0_0_30px_#00ffff40] border border-cyan-400/30 relative z-10">
        <h2 className="text-3xl font-bold text-cyan-300 mb-8 tracking-wide">Admin Panel</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Management */}
          <GlassCard className="p-6 border border-cyan-400/20 shadow-[0_0_20px_#00ffff20]">
            <h3 className="text-xl font-bold text-white mb-6">User Management</h3>
            <ul className="space-y-3">
              {[
                { name: 'Dr. Lee', role: 'researcher' },
                { name: 'Dr. Chen', role: 'reviewer' },
                { name: 'Dr. Mike', role: 'researcher' }
              ].map((u, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/5 p-4 rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <p className="text-white font-medium">{u.name}</p>
                  <span className="text-sm text-cyan-300">{u.role}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Approval Queue */}
          <GlassCard className="p-6 border border-cyan-400/20 shadow-[0_0_20px_#00ffff20]">
            <h3 className="text-xl font-bold text-white mb-6">Approval Queue</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center bg-white/5 p-4 rounded-lg hover:bg-cyan-500/10 transition-all duration-300">
                <p className="text-white font-medium">New User: Alex R.</p>
                <div className="space-x-2">
                  <button className="px-4 py-2 rounded-md bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-all duration-300">
                    Approve
                  </button>
                  <button className="px-4 py-2 rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all duration-300">
                    Reject
                  </button>
                </div>
              </li>
            </ul>
          </GlassCard>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminPage;
