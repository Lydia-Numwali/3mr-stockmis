/**
 * WCAG AA Contrast Compliance Checker
 * 
 * Calculates contrast ratios between colors and verifies WCAG AA compliance.
 * WCAG AA requires:
 * - 4.5:1 for normal text (< 18pt or < 14pt bold)
 * - 3:1 for large text (>= 18pt or >= 14pt bold)
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (e.g., '#FFFFFF')
 * @returns {Object} RGB object with r, g, b properties
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Calculate relative luminance of a color
 * @param {Object} rgb - RGB object with r, g, b properties
 * @returns {number} Relative luminance (0-1)
 */
export const getLuminance = (rgb) => {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} Contrast ratio (1-21)
 */
export const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG AA standard
 * @param {number} ratio - Contrast ratio
 * @param {string} textSize - 'normal' or 'large'
 * @returns {boolean} True if meets WCAG AA
 */
export const meetsWCAGAA = (ratio, textSize = 'normal') => {
  const minRatio = textSize === 'large' ? 3 : 4.5;
  return ratio >= minRatio;
};

/**
 * Check if contrast ratio meets WCAG AAA standard
 * @param {number} ratio - Contrast ratio
 * @param {string} textSize - 'normal' or 'large'
 * @returns {boolean} True if meets WCAG AAA
 */
export const meetsWCAGAAA = (ratio, textSize = 'normal') => {
  const minRatio = textSize === 'large' ? 4.5 : 7;
  return ratio >= minRatio;
};

/**
 * Verify all color combinations in the palette
 * @param {Object} colorPalette - Color palette object
 * @param {Object} backgroundColors - Background colors to test against
 * @returns {Array} Array of contrast check results
 */
export const verifyPaletteContrast = (colorPalette, backgroundColors) => {
  const results = [];
  
  Object.entries(colorPalette).forEach(([colorName, colorValue]) => {
    Object.entries(backgroundColors).forEach(([bgName, bgValue]) => {
      const ratio = getContrastRatio(colorValue, bgValue);
      const normalPass = meetsWCAGAA(ratio, 'normal');
      const largePass = meetsWCAGAA(ratio, 'large');
      
      results.push({
        textColor: colorName,
        textColorValue: colorValue,
        backgroundColor: bgName,
        backgroundColorValue: bgValue,
        contrastRatio: ratio.toFixed(2),
        normalTextPass: normalPass,
        largeTextPass: largePass,
        wcagAAA: meetsWCAGAAA(ratio, 'normal')
      });
    });
  });
  
  return results;
};

export default {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  verifyPaletteContrast
};
