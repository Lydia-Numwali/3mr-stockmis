import React from 'react';
import styles from './Alert.module.css';

const Alert = ({
  variant = 'info',
  title = '',
  message = '',
  icon = null,
  children,
  className = '',
  ariaLabel = '',
  role = 'alert',
  ...props
}) => {
  const alertClasses = [
    styles.alert,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  // Determine role based on variant if not explicitly provided
  let alertRole = role;
  if (role === 'alert' && variant === 'error') {
    alertRole = 'alert';
  } else if (variant === 'success' || variant === 'info') {
    alertRole = 'status';
  }

  return (
    <div 
      className={alertClasses} 
      role={alertRole}
      aria-label={ariaLabel}
      {...props}
    >
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <div className={styles.content}>
        {title && <div className={styles.title}>{title}</div>}
        {message && <div className={styles.message}>{message}</div>}
        {children}
      </div>
    </div>
  );
};

export default Alert;
