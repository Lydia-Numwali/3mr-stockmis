import React, { useState } from 'react';
import styles from './Navigation.module.css';

/**
 * Navigation Component
 * 
 * A reusable navigation menu component with support for menu items, sections,
 * icons, and responsive behavior. Includes active, hover, and disabled states.
 * 
 * @component
 * @example
 * // Basic navigation
 * <Navigation>
 *   <Navigation.Item href="/dashboard" active>Dashboard</Navigation.Item>
 *   <Navigation.Item href="/products">Products</Navigation.Item>
 * </Navigation>
 * 
 * // Navigation with sections
 * <Navigation>
 *   <Navigation.Section title="Main">
 *     <Navigation.Item href="/dashboard">Dashboard</Navigation.Item>
 *   </Navigation.Section>
 * </Navigation>
 */
const Navigation = React.forwardRef(
  (
    {
      children,
      className = '',
      collapsible = true,
      ...props
    },
    ref
  ) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navClass = `${styles.navigation} ${isCollapsed ? styles.collapsed : ''} ${className}`;

    return (
      <nav ref={ref} className={navClass} {...props}>
        {collapsible && (
          <button
            className={styles.toggleButton}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}
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
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <div className={styles.menuContainer}>{children}</div>
      </nav>
    );
  }
);

Navigation.displayName = 'Navigation';

/**
 * Navigation Item Component
 */
const NavigationItem = React.forwardRef(
  (
    {
      href = '#',
      active = false,
      disabled = false,
      icon = null,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const itemClass = `${styles.item} ${active ? styles.active : ''} ${disabled ? styles.disabled : ''} ${className}`;

    return (
      <a
        ref={ref}
        href={disabled ? undefined : href}
        className={itemClass}
        aria-current={active ? 'page' : undefined}
        aria-disabled={disabled}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault();
          }
        }}
        {...props}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{children}</span>
      </a>
    );
  }
);

NavigationItem.displayName = 'NavigationItem';

/**
 * Navigation Section Component
 */
const NavigationSection = React.forwardRef(
  (
    {
      title = null,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`${styles.section} ${className}`} {...props}>
        {title && <div className={styles.sectionTitle}>{title}</div>}
        <div className={styles.sectionItems}>{children}</div>
      </div>
    );
  }
);

NavigationSection.displayName = 'NavigationSection';

Navigation.Item = NavigationItem;
Navigation.Section = NavigationSection;

export default Navigation;
