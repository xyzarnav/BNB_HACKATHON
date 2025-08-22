import React from "react";

interface CTAButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  text, 
  onClick, 
  className = "", 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95`}
    >
      {text}
    </button>
  );
};

export default CTAButton;
