import React from 'react';
import styles from './Input.module.css';

const Input = ({
  type = 'text',
  size = 'regular',
  error = false,
  disabled = false,
  placeholder = '',
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  className = '',
  id = '',
  ariaLabel = '',
  ariaDescribedBy = '',
  ariaRequired = false,
  ariaInvalid = false,
  ...props
}) => {
  const inputClasses = [
    styles.input,
    styles[size],
    error && styles.error,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      type={type}
      className={inputClasses}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      disabled={disabled}
      id={id}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-required={ariaRequired}
      aria-invalid={ariaInvalid || error}
      {...props}
    />
  );
};

export default Input;
