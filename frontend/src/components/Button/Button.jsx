import React from 'react';
import styles from './Button.module.css';

/**
 * Button Component
 * 
 * A reusable button component with multiple variants and sizes.
 * Supports primary, secondary, and danger variants with proper
 * focus indicators and ARIA labels for accessibility.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {'primary' | 'secondary' | 'danger'} [props.variant='primary'] - Button variant
 * @param {'large' | 'regular' | 'small'} [props.size='regular'] - Button size
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {Function} [props.onClick] - Click handler function
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.ariaLabel] - ARIA label for accessibility
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.rest] - Additional HTML attributes
 * 
 * @example
 * // Primary button
 * <Button variant="primary" size="regular">Click me</Button>
 * 
 * @example
 * // Secondary button with custom handler
 * <Button variant="secondary" onClick={handleClick}>Cancel</Button>
 * 
 * @example
 * // Danger button, disabled
 * <Button variant="danger" disabled>Delete</Button>
 */
const Button = ({
  variant = 'primary',
  size = 'regular',
  disabled = false,
  onClick,
  children,
  ariaLabel,
  className = '',
  ...rest
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
