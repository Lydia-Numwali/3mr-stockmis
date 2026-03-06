import { useEffect, useState } from 'react';

/**
 * Hook to ensure ITC Avant Garde Gothic Std font is loaded before rendering
 * Uses the Font Loading API (document.fonts.ready) to wait for font availability
 * 
 * @returns {boolean} - true when font is loaded and ready to render
 */
export function useFontLoaded() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Check if the Font Loading API is available
    if (!document.fonts) {
      // Fallback: assume fonts are loaded after a short delay
      const timer = setTimeout(() => setFontLoaded(true), 100);
      return () => clearTimeout(timer);
    }

    // Use Font Loading API to wait for fonts to be ready
    document.fonts.ready.then(() => {
      setFontLoaded(true);
    }).catch(() => {
      // If font loading fails, still allow rendering with fallback fonts
      setFontLoaded(true);
    });

    // Timeout fallback: if fonts don't load within 3 seconds, render anyway
    const timeoutId = setTimeout(() => {
      setFontLoaded(true);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return fontLoaded;
}
