import React from 'react';

const BackgroundWrapper = ({ children }) => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0a0f1c] via-[#0b1225] to-[#0e1633] text-white font-sans">
      {/* Brain overlay */}
      <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none">
        <div className="w-[500px] h-[500px] bg-[url('/brain-overlay.png')] bg-contain bg-no-repeat" />
      </div>

      {/* Page Content */}
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
