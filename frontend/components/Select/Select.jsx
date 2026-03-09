import React from 'react';
import styles from './Select.module.css';

/**
 * Select Component
 * 
 * A reusable select dropdown component with modern styling and focus states.
 * Supports custom styling with Primary Blue border on focus and dropdown arrow.
 * 
 * @component
 * @example
 * // Basic select
 * <Select>
 *   <option value="">Select an option</option>
 *   <option value="1">Option 1</option>
 *   <option value="2">Option 2</option>
 * </Select>
 * 
 * // Select with label and error
 * <Select label="Category" error="Please select a category">
 *   <option value="">Select...</option>
 * </Select>
 */
const Select = React.forwardRef(
  (
    {
      size = 'regular',
      error = null,
      label = null,
      disabled = false,
      className = '',
      children,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const selectId = props.id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = error ? `${selectId}-error` : null;
    const finalAriaDescribedBy = ariaDescribedBy || errorId;

    const selectClass = `${styles.select} ${styles[size]} ${error ? styles.error : ''} ${className}`;

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.selectWrapper}>
          <select
            ref={ref}
            id={selectId}
            className={selectClass}
            disabled={disabled}
            aria-label={ariaLabel || label}
            aria-describedby={finalAriaDescribedBy}
            {...props}
          >
            {children}
          </select>
  