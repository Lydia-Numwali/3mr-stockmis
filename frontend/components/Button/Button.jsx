import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * Supports primary, secondary, and danger variants with proper
 * accessibility features including ARIA labels and focus indicators.
 * 
 * @component
 * @example
 * // Primary button
 * <Button variant="primary" size="regular">Click me</Button>
 * 
 * // Secondary button with custom aria-label
 * <Button variant="secondary" size="large" aria-label="Save changes">Save</Button>
 * 
 * // Danger button in small size
 * <Button variant="danger" size="small" onClick={handleDelete}>Delete</Button>
 */
const Button = React.forwardRef(
  (
    {
      variant = 'primary',
      size = 'regular',
      disabled = false,
      children,
      className = '',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={buttonClass}
        disabled={disabled}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
