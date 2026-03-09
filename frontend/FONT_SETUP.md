# Font Loading Configuration

## Overview

This document describes the font loading setup for ITC Avant Garde Gothic Std in the application.

## Implementation Details

### 1. Font Files (`src/styles/fonts.css`)

The `fonts.css` file contains `@font-face` declarations for ITC Avant Garde Gothic Std with three font weights:

- **Regular (400)**: `itc-avant-garde-gothic-std-regular.woff2/woff`
- **Medium (500)**: `itc-avant-garde-gothic-std-medium.woff2/woff`
- **Bold (700)**: `itc-avant-garde-gothic-std-bold.woff2/woff`

**Key Features:**
- Uses `font-display: swap` for optimal performance
- Ensures text is visible during font load
- Provides WOFF2 and WOFF formats for broad browser support
- Includes fallback to system sans-serif fonts

### 2. Font Loading Hook (`hooks/useFontLoaded.ts`)

The `useFontLoaded` hook ensures fonts are loaded before rendering:

```typescript
const { fontLoaded, error } = useFontLoaded();
```

**Features:**
- Uses the Font Loading API to detect when fonts are ready
- Gracefully handles unsupported browsers (assumes fonts are loaded)
- Catches font loading errors and continues with fallback fonts
- Returns `fontLoaded` state to control rendering

### 3. Font Loader Component (`components/FontLoader.tsx`)

The `FontLoader` component wraps the application and shows a loading state:

```typescript
<FontLoader>
  <App />
</FontLoader>
```

**Features:**
- Shows a loading spinner while fonts are loading
- Uses fallback fonts for the loading UI
- Renders children once fonts are loaded
- Provides smooth user experience

### 4. Integration in Layout (`app/layout.tsx`)

The `FontLoader` component is integrated in the root layout:

```typescript
<FontLoader>
  <ReactQueryProvider>{children}</ReactQueryProvider>
  <NextTopLoader color="#001526" showSpinner={false} />
  <Toaster richColors position="top-center" />
</FontLoader>
```

## Font File Setup

### Option 1: Self-Hosted Fonts (Recommended)

1. Obtain ITC Avant Garde Gothic Std font files in WOFF2 and WOFF formats
2. Place font files in `public/fonts/`:
   - `itc-avant-garde-gothic-std-regular.woff2`
   - `itc-avant-garde-gothic-std-regular.woff`
   - `itc-avant-garde-gothic-std-medium.woff2`
   - `itc-avant-garde-gothic-std-medium.woff`
   - `itc-avant-garde-gothic-std-bold.woff2`
   - `itc-avant-garde-gothic-std-bold.woff`

### Option 2: Adobe Fonts

If using Adobe Fonts:

1. Update `fonts.css` to import from Adobe Fonts CDN
2. Remove the `@font-face` declarations
3. Add Adobe Fonts link tag in `app/layout.tsx`

Example:
```html
<link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" />
```

### Option 3: Google Fonts Alternative

If ITC Avant Garde Gothic Std is not available, use a similar modern sans-serif:

- **Poppins** (geometric, modern)
- **Inter** (clean, professional)
- **Outfit** (contemporary, geometric)

Update `fonts.css` to use the alternative font.

## Performance Considerations

### Font Display Strategy

The `font-display: swap` strategy:
- Shows fallback fonts immediately
- Swaps to custom font when loaded
- Prevents "invisible text" during load
- Improves perceived performance

### Font Loading Timeline

1. **0ms**: Page loads, fallback fonts display
2. **100-500ms**: Custom font loads (typical)
3. **Font Ready**: Text swaps to custom font
4. **Timeout**: After 3 seconds, fallback fonts are used permanently

### Optimization Tips

1. **Use WOFF2 format**: Smaller file size, better compression
2. **Subset fonts**: Only include necessary characters
3. **Preload fonts**: Add preload hints in layout
4. **Lazy load**: Load fonts only when needed

## Fallback Fonts

If ITC Avant Garde Gothic Std fails to load, the following fallback chain is used:

1. Avenir Next (system font)
2. Avenir (system font)
3. Generic sans-serif

These fonts have similar geometric characteristics to ITC Avant Garde Gothic Std.

## Testing

### Manual Testing

1. Open DevTools Network tab
2. Throttle network to "Slow 3G"
3. Reload page
4. Observe loading spinner
5. Verify font swaps when loaded

### Automated Testing

See `tests/fonts.test.ts` for property-based tests:

- **Property 2**: Font Family Application
- **Property 17**: Font Fallback Availability

## Troubleshooting

### Fonts Not Loading

1. Check `public/fonts/` directory for font files
2. Verify file names match `fonts.css` declarations
3. Check browser console for CORS errors
4. Verify WOFF2/WOFF format support

### Slow Font Loading

1. Check font file sizes
2. Enable gzip compression on server
3. Use CDN for font delivery
4. Consider subsetting fonts

### Fallback Fonts Not Working

1. Verify fallback font names are correct
2. Check system font availability
3. Test in different browsers
4. Verify CSS font-family declaration

## Browser Support

- **Chrome**: Full support (Font Loading API)
- **Firefox**: Full support (Font Loading API)
- **Safari**: Full support (Font Loading API)
- **Edge**: Full support (Font Loading API)
- **IE 11**: Fallback fonts only (no Font Loading API)

## References

- [Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet)
- [font-display CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
- [Web Font Performance](https://web.dev/font-display/)
