import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

/**
 * Modal Component
 * 
 * A reusable modal dialog component with overlay, header, body, and footer sections.
 * Includes keyboard handling (ESC to close), focus trap, and proper accessibility features.
 * 
 * @component
 * @example
 * // Basic modal
 * <Modal isOpen={true} onClose={handleClose}>
 *   <Modal.Header>Modal Title</Modal.Header>
 *   <Modal.Body>Modal content</Modal.Body>
 *   <Modal.Footer>
 *     <Button onClick={handleClose}>Close</Button>
 *   </Modal.Footer>
 * </Modal>
 */
const Modal = React.forwardRef(
  (
    {
      isOpen = false,
      onClose = () => {},
      size = 'regular',
      children,
      className = '',
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    // Handle ESC key to close modal
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Handle focus trap
    useEffect(() => {
      if (!isOpen || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      const handleTabKey = (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      firstElement.focus();

      return () => document.removeEventListener('keydown', handleTabKey);
    }, [isOpen]);

    // Handle overlay click to close
    const handleOverlayClick = (e) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    };

    if (!isOpen) return null;

    const modalClass = `${styles.modal} ${styles[size]} ${className}`;

    return (
      <div
        ref={overlayRef}
        className={styles.overlay}
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          ref={modalRef}
          className={modalClass}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

/**
 * Modal Header Component
 */
const ModalHeader = React.forwardRef(
  (
    {
      children,
      onClose = () => {},
      showCloseButton = true,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`${styles.header} ${className}`} {...props}>
        <div className={styles.headerContent}>{children}</div>
        {showCloseButton && (
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

ModalHeader.displayName = 'ModalHeader';

/**
 * Modal Body Component
 */
const ModalBody = React.forwardRef(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`${styles.body} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

ModalBody.displayName = 'ModalBody';

/**
 * Modal Footer Component
 */
const ModalFooter = React.forwardRef(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`${styles.footer} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
