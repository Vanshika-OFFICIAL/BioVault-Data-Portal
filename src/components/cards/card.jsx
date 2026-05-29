import React from "react";

const Card = ({
  children,
  className = "",
}) => {

  return (

    <div
      className={`
        w-full
        rounded-2xl
        border
        border-white/5
        bg-[#0b1220]/90
        backdrop-blur-xl
        shadow-[0_0_20px_rgba(0,255,255,0.03)]
        ${className}
      `}
    >

      {children}

    </div>
  );
};

export default Card;