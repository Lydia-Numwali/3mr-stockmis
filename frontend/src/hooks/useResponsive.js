import { useState, useEffect } from 'react';

/**
 * Hook to detect current responsive breakpoint
 * Breakpoints:
 * - mobile: < 640px
 * - tablet: 640px - 1023px
 * - desktop: >= 1024px
 */
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  });

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  });

  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    const width = window.innerWidth;
    return width >= 640 && width < 1024;
  });

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 1024;
    return window.innerWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);

      // Determine breakpoint
      let newBreakpoint;
      if (newWidth < 640) {
        newBreakpoint = 'mobile';
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (newWidth < 1024) {
        newBreakpoint = 'tablet';
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        newBreakpoint = 'desktop';
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }

      setBreakpoint(newBreakpoint);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    width,
  };
};

export default useResponsive;
