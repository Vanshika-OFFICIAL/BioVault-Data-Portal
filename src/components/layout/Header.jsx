import React from 'react';

const Header = ({ onLogout, user, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-2 bg-white/5 backdrop-blur-xl border-b border-cyan-400/20 shadow-[0_0_15px_#00ffff20] relative z-20">
      {/* Left: Branding + Mobile Toggle */}
      <div className="flex items-center space-x-2">
        {/* Hamburger menu (mobile only) */}
        <button
          type="button"
          aria-label="Open sidebar"
          className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-cyan-400/20 hover:bg-cyan-500/10 transition-all flex items-center justify-center"
          onClick={onToggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <span className="flex flex-col justify-center gap-1.5">
            <span className="block w-5 h-0.5 bg-cyan-300 rounded" />
            <span className="block w-5 h-0.5 bg-cyan-300 rounded" />
            <span className="block w-5 h-0.5 bg-cyan-300 rounded" />
          </span>
        </button>
        <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-cyan-300">BioVault</h2>
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 hidden sm:block">
            Welcome, <span className="text-white font-semibold">{user?.name}</span> ({user?.role})
          </span>
        </div>

        <button
          onClick={onLogout}
          className="py-1 px-1 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-lg border border-red-400/30 transition-all duration-300"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;