'use client';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

function Button({ label, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={`${className} bg-secondary-blue cursor-pointer text-white rounded-full px-[40px] py-[12px] h-[61px] font-[500] text-[18px]`}
      {...props}
    >
      {children || label}
    </button>
  );
}

export default Button;
