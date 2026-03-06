import React from 'react';
import styles from './Card.module.css';

const Card = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
