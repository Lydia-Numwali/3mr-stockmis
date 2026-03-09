import React from 'react';
import styles from './Card.module.css';

/**
 * Card Component
 * 
 * A reusable card component for displaying content with consistent styling.
 * Supports multiple variants (default, success, warning, error, info) with
 * proper spacing, shadows, and hover effects.
 * 
 * @component
 * @example
 * // Default card
 * <Card>
 *   <Card.Header>Card Title</Card.Header>
 *   <Card.Body>Card content goes here</Card.Body>
 * </Card>
 * 
 * // Success variant card
 * <Card variant="success">
 *   <Card.Header>Success</Card.Header>
 *   <Card.Body>Operation completed successfully</Card.Body>
 * </Card>
 */
const Card = React.forwardRef(
  (
    {
      variant = 'default',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const cardClass = `${styles.card} ${styles[variant]} ${className}`;

    return (
      <div ref={ref} className={cardClass} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header Component
 */
const CardHeader = React.forwardRef(
  (
    {
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`${styles.header} ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Body Component
 */
const CardBody = React.forwardRef(
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

CardBody.displayName = 'CardBody';

/**
 * Card Footer Component
 */
const CardFooter = React.forwardRef(
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

CardFooter.displayName = 'CardFooter';

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
