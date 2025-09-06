import React from 'react';

const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-cyan-400/30 shadow-[0_0_30px_#00ffff40] rounded-2xl transition-all duration-500 hover:shadow-[0_0_40px_#00ffff60] ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
