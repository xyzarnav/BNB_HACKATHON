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
      className={`${className} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default CTAButton;
