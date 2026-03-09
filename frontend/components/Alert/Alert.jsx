import React from 'react';
import styles from './Alert.module.css';

/**
 * Alert Component
 * 
 * A reusable alert component for displaying messages with different severity levels.
 * Supports multiple variants (success, warning, error, info) with optional icons.
 * 
 * @component
 * @example
 * // Success alert
 * <Alert variant="success" title="Success">
 *   Operation completed successfully
 * </Alert>
 * 
 * // Error alert with icon
 * <Alert variant="error" title="Error" icon={<ErrorIcon />}>
 *   Something went wrong
 * </Alert>
 */
const Alert = React.forwardRef(
  (
    {
      variant = 'info',
      title = null,
      icon = null,
      children,
      className = '',
      role = 'alert',
      ...props
    },
    ref
  ) => {
    const alertClass = `${styles.alert} ${styles[variant]} ${className}`;

    return (
      <div ref={ref} className={alertClass} role={role} {...props}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.content}>
          {title && <div className={styles.title}>{title}</div>}
          {children && <div className={styles.message}>{children}</div>}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
