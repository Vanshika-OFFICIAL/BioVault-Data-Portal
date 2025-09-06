import React from 'react';

const AnimatedInput = ({ label, type, value, onChange, disabled, name }) => {
  const isFilled = value && value.length > 0;
  const isPassword = type === 'password';

  return (
    <div className="relative z-0 group">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`block py-2.5 px-0 w-full text-lg text-white bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer
        ${isPassword ? 'border-gray-500 focus:border-cyan-500' : 'border-gray-500 focus:border-blue-500'}
        ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-white'}`}
        placeholder=" "
        required
      />
      <label
        htmlFor={name}
        className={`absolute text-lg text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
        ${isFilled && 'scale-75 -translate-y-6'}`}
      >
        {label}
      </label>
    </div>
  );
};

export default AnimatedInput;