import { useEffect, useState } from 'react';

/**
 * Hook to ensure ITC Avant Garde Gothic Std font is loaded before rendering
 * Uses the Font Loading API to detect when fonts are ready
 * 
 * @returns {Object} Object with fontLoaded boolean and error state
 * @returns {boolean} fontLoaded - True when font is loaded and ready
 * @returns {boolean} error - True if font loading failed
 * 
 * @example
 * const { fontLoaded, error } = useFontLoaded();
 * 
 * if (!fontLoaded) {
 *   return <LoadingScreen />;
 * }
 * 
 * if (error) {
 *   return <ErrorScreen />;
 * }
 * 
 * return <App />;
 */
export function useFontLoaded() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if Font Loading API is supported
    if (!document.fonts) {
      // Fallback: assume fonts are loaded if API is not supported
      setFontLoaded(true);
      return;
    }

    const loadFont = async () => {
      try {
        // Wait for ITC Avant Garde Gothic Std font to load
        // The font is defined in fonts.css with font-display: swap
        await document.fonts.load('400 1em "ITC Avant Garde Gothic Std"');
        await document.fonts.load('500 1em "ITC Avant Garde Gothic Std"');
        await document.fonts.load('700 1em "ITC Avant Garde Gothic Std"');

        // Mark font as loaded
        setFontLoaded(true);
      } catch (err) {
        // If font loading fails, log error but still mark as loaded
        // This allows the app to continue with fallback fonts
        console.warn('Font loading failed, using fallback fonts:', err);
        setFontLoaded(true);
      }
    };

    // Start font loading
    loadFont();
  }, []);

  return { fontLoaded, error };
}
