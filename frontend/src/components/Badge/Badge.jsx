import React from 'react';
import styles from './Badge.module.css';

const Badge = ({
  variant = 'primary',
  children,
  className = '',
  ariaLabel = '',
  ...props
}) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={badgeClasses} 
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
