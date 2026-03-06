import React, { useState, useEffect, useRef } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import styles from './Navigation.module.css';

const Navigation = ({
  items = [],
  activeItem = null,
  onItemClick = () => {},
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { isMobile } = useResponsive();
  const menuItemsRef = useRef([]);

  // Close menu when item is clicked on mobile
  const handleItemClick = (itemId) => {
    onItemClick(itemId);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Close menu when transitioning to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen && e.key !== 'Enter') return;

      const menuItems = menuItemsRef.current.filter(item => item !== null);
      if (menuItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev < menuItems.length - 1 ? prev + 1 : 0;
            menuItems[nextIndex]?.focus();
            return nextIndex;
          });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : menuItems.length - 1;
            menuItems[nextIndex]?.focus();
            return nextIndex;
          });
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          menuItems[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          const lastIndex = menuItems.length - 1;
          setFocusedIndex(lastIndex);
          menuItems[lastIndex]?.focus();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navigationClasses = [
    styles.navigation,
    isOpen && styles.collapsed,
    className
  ].filter(Boolean).join(' ');

  let menuItemIndex = 0;

  return (
    <>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
      >
        ☰
      </button>
      <nav className={navigationClasses}>
        <ul className={styles.menu}>
          {items.map((item, index) => (
            <li key={index}>
              {item.section && (
                <div className={styles.section}>
                  <span className={styles.sectionTitle}>{item.section}</span>
                </div>
              )}
              {item.label && (
                <button
                  ref={el => {
                    if (el) {
                      menuItemsRef.current[menuItemIndex] = el;
                    }
                    menuItemIndex++;
                  }}
                  className={[
                    styles.menuItem,
                    activeItem === item.id && styles.active,
                    item.disabled && styles.disabled
                  ].filter(Boolean).join(' ')}
                  onClick={() => !item.disabled && handleItemClick(item.id)}
                  disabled={item.disabled}
                  aria-label={item.label}
                >
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span className={styles.label}>{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;
