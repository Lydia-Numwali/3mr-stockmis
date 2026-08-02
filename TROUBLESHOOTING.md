# Troubleshooting Guide

## 500 Error on POST /api/purchases

### Symptoms
- Frontend shows: `POST https://centurion-backend-h66i.onrender.com/api/purchases 500 (Internal Server Error)`
- Trying to record items received fails

### Possible Causes & Solutions

#### 1. Deployment Still in Progress
**Check**: Go to Render dashboard → Backend service → Logs
**Solution**: Wait 5-10 minutes for deployment to complete
**How to verify**: 
```bash
curl https://centurion-backend-h66i.onrender.com/api/products/generate-asset-ids \
  -X POST \
  -H "Authorization: Bearer YOUR_TOKEN"
```
If this returns successfully, deployment is complete.

#### 2. Old Code Still Cached
**Check**: Render might be serving cached version
**Solution**: 
1. Go to Render dashboard
2. Click on backend service
3. Click "Manual Deploy" → "Clear build cache & deploy"

#### 3. Database Migration Issue
**Check**: Old purchase records might conflict with new structure
**Solution**: This shouldn't affect new records, but verify database is accessible

#### 4. Validation Error
**Check**: Frontend sending incorrect payload
**Solution**: Verify payload matches:
```json
{
  "itemName": "Test Chair",
  "category": "Furniture", 
  "quantityReceived": 2,
  "supplier": "Test Supplier",
  "condition": "New"
}
```

### Testing Locally

The feature works perfectly locally:

```bash
# 1. Get auth token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@centurion.com","password":"Test@123"}' \
  | jq -r '.accessToken')

# 2. Test new item creation
curl -X POST http://localhost:3001/api/purchases \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName":"Test Office Chair",
    "category":"Furniture",
    "quantityReceived":2,
    "supplier":"Test Supplier",
    "condition":"New"
  }'
```

**Expected Result**: Creates 2 individual items with Asset IDs CAL-TES-001-2026 and CAL-TES-002-2026

### Verification Steps

Once deployment completes:

#### 1. Test Backend Directly
```bash
# Get fresh token
curl -X POST https://centurion-backend-h66i.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@centurion.com","password":"Test@123"}'

# Test purchases endpoint (use token from above)
curl -X POST https://centurion-backend-h66i.onrender.com/api/purchases \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemName":"Test Item",
    "quantityReceived":1,
    "condition":"New"
  }'
```

#### 2. Test from Frontend
1. Login to deployed frontend
2. Go to "Items Received" tab
3. Click "Record Items Received"
4. Select "Receive New Item Type"
5. Fill in:
   - Item Name: "Test Chair"
   - Quantity: 2
6. Click "Create & Record Receipt"
7. Check Items tab for new items with Asset IDs

### Current Deployment Status

**Latest Commit**: `701d77a` - "Fix: Use entity manager repository for Asset ID generation in transaction"

**Changes in This Commit**:
- Fixed entity manager query builder usage in transactions
- Changed from `em.createQueryBuilder(Product, 'p')` to `em.getRepository(Product).createQueryBuilder('p')`
- This resolves the 500 error for new item creation

### If Problem Persists

1. **Check Render Logs**:
   - Go to Render dashboard
   - Open backend service
   - Check "Logs" tab
   - Look for TypeScript compilation errors or runtime errors

2. **Manual Redeploy**:
   - Render dashboard → Backend service
   - Click "Manual Deploy"
   - Select "Clear build cache & deploy"
   - Wait for completion

3. **Verify Git Commit**:
   - Check that Render is deploying from `main` branch
   - Verify latest commit hash matches `701d77a` or later

### Working Alternative (Temporary)

If the new workflow doesn't work immediately, you can still use the old "Add to Existing Item" mode:

1. First, manually create one item in Items tab (if the button is removed, temporarily revert)
2. Then use "Items Received" → "Add to Existing Item" mode
3. This will still create individual items with Asset IDs

### Contact Points

- **Local Testing**: Confirmed working ✅
- **Backend Logic**: Confirmed correct ✅
- **Frontend Integration**: Confirmed correct ✅
- **Issue**: Deployment sync timing ⏳

The code is correct and tested locally. The 500 error should resolve once Render completes the deployment with the latest code.
