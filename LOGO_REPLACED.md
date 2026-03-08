# Logo Replaced with Text

## Changes Made

Replaced the IKAZE logo with "STOCK MIS" text in two locations:

### 1. Sidebar (`frontend/components/common/sidebar.tsx`)
- **Before**: Image logo (ikaze_logo_white.svg)
- **After**: Bold text "STOCK MIS" (2xl font, bold, tracking-tight)
- **Location**: Top of sidebar in blue background

### 2. Badges Terms (`frontend/components/common/BadgesTerms.tsx`)
- **Before**: Image logo (ikaze_logo_gradient.svg)
- **After**: Bold text "STOCK MIS" (3xl font, bold, primary-blue color)
- **Location**: Top of terms and conditions section

## Styling

**Sidebar Logo:**
```html
<h1 className="text-2xl font-bold tracking-tight">STOCK MIS</h1>
```

**Badges Terms Logo:**
```html
<h1 className="text-3xl font-bold text-primary-blue py-4">STOCK MIS</h1>
```

## How to Test

1. **Restart frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check sidebar**:
   - Go to dashboard
   - Look at left sidebar
   - Should see "STOCK MIS" text instead of logo

3. **Check badges terms**:
   - Navigate to any page with badges/terms
   - Should see "STOCK MIS" text instead of logo

## Files Modified

- `frontend/components/common/sidebar.tsx`
- `frontend/components/common/BadgesTerms.tsx`

Both now use text branding instead of image logos.
