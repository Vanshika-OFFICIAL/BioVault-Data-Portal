import React from 'react';
import Icon from '../ui/Icon';

const Sidebar = ({ currentPage, onNavigate, hasPermission, isOpen, onClose }) => {
  const navLinks = [
    { name: 'Dashboard', page: 'dashboard', icon: 'dashboard', roles: ['admin', 'researcher', 'reviewer'] },
    { name: 'Datasets', page: 'datasets', icon: 'datasets', roles: ['admin', 'researcher', 'reviewer'] },
    { name: 'Upload', page: 'upload', icon: 'upload', roles: ['admin', 'researcher'] },
    { name: 'Audit Logs', page: 'audit', icon: 'audit', roles: ['admin', 'reviewer'] },
    { name: 'Profile', page: 'profile', icon: 'settings', roles: ['admin', 'researcher', 'reviewer'] },
    { name: 'Admin Panel', page: 'admin', icon: 'admin', roles: ['admin'] },
  ];

  const visibleLinks = navLinks.filter(link => hasPermission(link.roles));

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-6 bg-white/5 backdrop-blur-xl border-r border-cyan-400/20 shadow-[0_0_25px_#00ffff30]">
        <h1 className="text-3xl font-bold mb-10 text-cyan-300 tracking-widest select-none">BioVault</h1>
        <nav className="flex-grow space-y-2">
          {visibleLinks.map(link => (
            <button
              key={link.page}
              onClick={() => onNavigate(link.page)}
              className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all duration-300 group ${
                currentPage === link.page
                  ? 'bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-300 shadow-[inset_0_0_15px_#00ffff40]'
                  : 'hover:bg-cyan-500/10 text-gray-300'
              }`}
            >
              <Icon
                name={link.icon}
                className={`mr-3 transition-colors duration-300 ${
                  currentPage === link.page ? 'text-cyan-300' : 'text-cyan-500 group-hover:text-cyan-300'
                }`}
              />
              <span className="font-medium tracking-wide">{link.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar (Slide-in) */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        <div className="relative z-50 flex flex-col w-64 h-full p-6 bg-[#0a0f1c] backdrop-blur-xl border-r border-cyan-400/20 shadow-[0_0_25px_#00ffff50]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-cyan-300">BioVault</h1>
            <button onClick={onClose} className="p-2 rounded-md hover:bg-cyan-500/10">
              <Icon name="close" className="text-cyan-300 w-6 h-6" />
            </button>
          </div>
          <nav className="flex-grow space-y-2">
            {visibleLinks.map(link => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  onClose();
                }}
                className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-all duration-300 group ${
                  currentPage === link.page
                    ? 'bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-300 shadow-[inset_0_0_15px_#00ffff40]'
                    : 'hover:bg-cyan-500/10 text-gray-300'
                }`}
              >
                <Icon
                  name={link.icon}
                  className={`mr-3 transition-colors duration-300 ${
                    currentPage === link.page ? 'text-cyan-300' : 'text-cyan-500 group-hover:text-cyan-300'
                  }`}
                />
                <span className="font-medium tracking-wide">{link.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;