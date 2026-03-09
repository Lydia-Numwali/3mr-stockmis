import React from 'react';
import styles from './Input.module.css';

/**
 * Input Component
 * 
 * A reusable form input component with support for multiple input types,
 * sizes, and states. Includes proper accessibility features with ARIA labels,
 * focus indicators, and error state styling.
 * 
 * @component
 * @example
 * // Text input
 * <Input type="text" placeholder="Enter text" />
 * 
 * // Email input with error
 * <Input type="email" error="Invalid email" />
 * 
 * // Password input with label
 * <Input type="password" label="Password" size="large" />
 */
const Input = React.forwardRef(
  (
    {
      type = 'text',
      size = 'regular',
      error = null,
      label = null,
      placeholder = '',
      disabled = false,
      className = '',
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${inputId}-error` : null;
    const finalAriaDescribedBy = ariaDescribedBy || errorId;

    const inputClass = `${styles.input} ${styles[size]} ${error ? styles.error : ''} ${className}`;

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClass}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-describedby={finalAriaDescribedBy}
          {...props}
        />
        {error && (
          <span id={errorId} className={styles.errorMessage}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
