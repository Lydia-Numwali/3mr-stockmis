import React from 'react';
import styles from './Badge.module.css';

/**
 * Badge Component
 * 
 * A reusable badge component for displaying labels and status indicators.
 * Supports multiple variants (primary, secondary, success, warning, error, info).
 * 
 * @component
 * @example
 * // Primary badge
 * <Badge variant="primary">New</Badge>
 * 
 * // Success badge
 * <Badge variant="success">Active</Badge>
 * 
 * // Error badge
 * <Badge variant="error">Failed</Badge>
 */
const Badge = React.forwardRef(
  (
    {
      variant = 'primary',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const badgeClass = `${styles.badge} ${styles[variant]} ${className}`;

    return (
      <span ref={ref} className={badgeClass} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
