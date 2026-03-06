import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

const Modal = ({
  isOpen = false,
  onClose = () => {},
  title = '',
  children,
  footer = null,
  size = 'regular',
  className = '',
}) => {
  const modalRef = useRef(null);
  const modalContentRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && e.target === modalRef.current) {
        onClose();
      }
    };

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalContentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) || [];

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('click', handleClickOutside);

    // Focus trap - focus first focusable element
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    // Prevent body scroll when modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClasses = [
    styles.modal,
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.overlay} ref={modalRef} role="presentation">
      <div className={modalClasses} ref={modalContentRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title} id="modal-title">{title}</h2>
            <button
              ref={firstFocusableRef}
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}
        <div className={styles.body}>
          {children}
        </div>
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
