import React from 'react';
import Icon from '../ui/Icon';

const Header = ({ onLogout, user, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-xl border-b border-cyan-400/20 shadow-[0_0_15px_#00ffff20] relative z-20">
      {/* Left: Branding + Mobile Toggle */}
      <div className="flex items-center space-x-4">
        {/* Hamburger menu (mobile only) */}
        <button
          className="md:hidden p-2 rounded-lg bg-white/5 border border-cyan-400/20 hover:bg-cyan-500/10 transition-all"
          onClick={onToggleSidebar}
        >
          <Icon name="menu" className="text-cyan-300 w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold tracking-widest text-cyan-300">BioVault</h2>
      </div>

      {/* Right: User + Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-cyan-400/20 border border-cyan-300 flex items-center justify-center shadow-[0_0_10px_#00ffff50]">
            <Icon name="user" className="text-cyan-300" />
          </div>
          <span className="text-gray-300 hidden sm:block">
            Welcome, <span className="text-white font-semibold">{user?.name}</span> ({user?.role})
          </span>
        </div>

        <button
          onClick={onLogout}
          className="py-2 px-4 text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold rounded-lg border border-red-400/30 transition-all duration-300"
        >
          Log Out
        </button>
      </div>
    </header>
  );
};

export default Header;