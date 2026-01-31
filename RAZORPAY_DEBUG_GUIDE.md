# Razorpay Configuration Debug Guide

## Problem
Frontend shows: "Payment configuration missing. Please contact support."
This means Razorpay keys are not being loaded by Spring Boot.

## Solution Applied

### 1. Environment Variable Resolution (PaymentService.java)
Added fallback mechanism to read from environment variables:

```java
private String resolveKeyId(String configValue) {
  if (configValue != null && !configValue.isBlank()) {
    return configValue;
  }
  String envValue = System.getenv("RAZORPAY_KEY_ID");
  return envValue != null ? envValue : "";
}

private String resolveKeySecret(String configValue) {
  if (configValue != null && !configValue.isBlank()) {
    return configValue;
  }
  String envValue = System.getenv("RAZORPAY_KEY_SECRET");
  return envValue != null ? envValue : "";
}
```

### 2. Debug Logging
Added console logging to verify keys are loaded:

```java
private void logRazorpayConfig() {
  boolean hasKeys = keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
  if (mock) {
    logger.info("[RAZORPAY] MOCK MODE ENABLED - Real payments disabled");
  } else if (hasKeys) {
    logger.info("[RAZORPAY] Keys loaded successfully. KeyId: {}...", keyId.substring(0, Math.min(8, keyId.length())));
  } else {
    logger.warn("[RAZORPAY] KEYS NOT FOUND - Payment will fail. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables");
  }
}
```

### 3. Configuration Priority
1. **application.properties** (highest priority)
   ```properties
   app.razorpay.keyId=${RAZORPAY_KEY_ID:}
   app.razorpay.keySecret=${RAZORPAY_KEY_SECRET:}
   ```

2. **System Environment Variables** (fallback)
   ```bash
   set RAZORPAY_KEY_ID=rzp_live_xxxxx
   set RAZORPAY_KEY_SECRET=xxxxx
   ```

3. **Mock Mode** (if keys missing)
   ```properties
   app.payment.mock=true
   ```

## How to Set Environment Variables

### Windows (Command Prompt)
```cmd
set RAZORPAY_KEY_ID=rzp_live_xxxxx
set RAZORPAY_KEY_SECRET=xxxxx
cd backend
mvn spring-boot:run
```

### Windows (PowerShell)
```powershell
$env:RAZORPAY_KEY_ID="rzp_live_xxxxx"
$env:RAZORPAY_KEY_SECRET="xxxxx"
cd backend
mvn spring-boot:run
```

### Windows (Permanent - System Properties)
1. Right-click "This PC" → Properties
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Add new User/System variables:
   - `RAZORPAY_KEY_ID` = `rzp_live_xxxxx`
   - `RAZORPAY_KEY_SECRET` = `xxxxx`
5. Restart IDE/Terminal

### Linux/Mac
```bash
export RAZORPAY_KEY_ID=rzp_live_xxxxx
export RAZORPAY_KEY_SECRET=xxxxx
cd backend
mvn spring-boot:run
```

## Expected Console Output

### ✓ Keys Loaded Successfully
```
[RAZORPAY] Keys loaded successfully. KeyId: rzp_live_...
```

### ✗ Keys Not Found
```
[RAZORPAY] KEYS NOT FOUND - Payment will fail. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables
```

### ✓ Mock Mode Enabled
```
[RAZORPAY] MOCK MODE ENABLED - Real payments disabled
```

## Error Handling

When keys are missing, `createOrder()` returns:
```json
{
  "success": false,
  "mode": "MOCK",
  "message": "MOCK mode enabled. Click Pay -> we will auto-unlock on verify."
}
```

Frontend shows: "Payment configuration missing. Please contact support."

## Testing Flow

1. **Start Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Check Console** for `[RAZORPAY]` log message

3. **Open Frontend** at http://localhost:8085

4. **Click "Buy Now"**
   - If keys loaded: Razorpay popup opens
   - If keys missing: Error message shown

## Razorpay Client Initialization

```java
RazorpayClient client = new RazorpayClient(keyId, keySecret);
JSONObject options = new JSONObject();
options.put("amount", amountPaise);
options.put("currency", "INR");
options.put("receipt", "receipt_" + System.currentTimeMillis());
options.put("payment_capture", 1);

com.razorpay.Order order = client.orders.create(options);
String orderId = order.get("id");
```

## Verification Signature Check

```java
String payload = razorpay_order_id + "|" + razorpay_payment_id;
String expected = HmacUtil.hmacSha256(payload, keySecret);
if (!expected.equals(razorpay_signature)) {
  return new VerifyResponse(false, false, "Signature mismatch", "");
}
```

## Files Modified
- `backend/src/main/java/com/asdance/payment/PaymentService.java`
  - Added `resolveKeyId()` method
  - Added `resolveKeySecret()` method
  - Added `logRazorpayConfig()` method
  - Added Logger import and initialization

## Next Steps
1. Set environment variables
2. Rebuild and restart backend
3. Check console for `[RAZORPAY]` log
4. Test payment flow
