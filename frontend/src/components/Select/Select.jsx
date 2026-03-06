import React from 'react';
import styles from './Select.module.css';

const Select = ({
  options = [],
  value = '',
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  id = '',
  ariaLabel = '',
  ariaDescribedBy = '',
  ariaRequired = false,
  ariaInvalid = false,
  ...props
}) => {
  const selectClasses = [
    styles.select,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.selectWrapper}>
      <select
        className={selectClasses}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-required={ariaRequired}
        aria-invalid={ariaInvalid}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.arrow} aria-hidden="true">▼</span>
    </div>
  );
};

export default Select;
