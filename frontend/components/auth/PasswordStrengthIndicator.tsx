
import React from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}
const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const calculateStrength = (password: string): number => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    
    if (/[A-Z]/.test(password)) strength += 1; 
    if (/[a-z]/.test(password)) strength += 1; 
    if (/[0-9]/.test(password)) strength += 1; 
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const strength = calculateStrength(password);
  const getIndicators = () => {
    return Array(4).fill(0).map((_, index) => {
      let bgClass = "bg-gray-200";
      if (index < strength) {
        if (strength <= 2) bgClass = "bg-red-500";
        else if (strength <= 3) bgClass = "bg-yellow-500";
        else bgClass = "bg-green-500";
      }
      
      return (
        <div
          key={index}
          className={`h-1 flex-1 rounded-xl mx-1 ${bgClass}`}
        ></div>
      );
    });
  };

  return (
    <div className="mt-2">
      <div className="flex space-x-1">{getIndicators()}</div>
    </div>
  );
};

export default PasswordStrengthIndicator;