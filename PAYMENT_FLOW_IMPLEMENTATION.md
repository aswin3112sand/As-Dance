# Payment Flow Implementation - Buy Now → Login/Register → Razorpay → Google Drive

## Overview
Complete implementation of the purchase flow with Razorpay payment integration and Google Drive folder redirect.

## Flow Diagram
```
Home (Buy Now) 
  ↓
  ├─ User Logged In? 
  │  ├─ YES → Checkout Page
  │  └─ NO → Login Page (with redirect param)
  │
Login/Register Page
  ├─ New User? → Register (with redirect param)
  └─ Existing User? → Login
  │
Checkout Page
  ├─ Enter Name & WhatsApp (optional)
  ├─ Click "Buy Now"
  └─ Razorpay Payment Modal
  │
Payment Success
  ├─ Verify Payment (Backend)
  ├─ Unlock Bundle
  └─ Redirect to Google Drive (2 sec auto-redirect)
  │
Google Drive Folder
  └─ Access restricted to: aswin3112sand@gmail.com
```

## Implementation Details

### Backend Changes

#### 1. application.properties
- **Razorpay Test Key**: `rzp_test_RrudoJsyYr2V2b` (already configured)
- **Allowed Email**: `aswin3112sand@gmail.com` (only this email can access)
- **Google Drive Folder**: `https://drive.google.com/drive/folders/1oR57VFOfBdriDAsO37JLon1KCPefFfw2?usp=sharing`

#### 2. PaymentService.java
- Added `googleDriveFolder` property injection
- Updated `verify()` method to return Google Drive URL instead of video URL
- Updated `handleWebhook()` method to return Google Drive URL
- Access control: Only `aswin3112sand@gmail.com` can complete payments

### Frontend Changes

#### 1. HeroSection.jsx
- Updated `handleCheckout()` to redirect unauthenticated users to:
  ```
  /login?redirect=/checkout?pay=1
  ```

#### 2. Login.jsx
- Extract `redirect` query param from URL
- Use redirect param as target path after login
- Pass redirect param to Register link:
  ```
  /register?redirect=/checkout?pay=1
  ```

#### 3. Register.jsx
- Extract `redirect` query param from URL
- After registration, redirect to login with redirect param
- Login then redirects to checkout

#### 4. Checkout.jsx
- Pass `googleDriveUrl` to PaymentSuccess state
- Both Razorpay and Mock payment handlers include Google Drive URL

#### 5. PaymentSuccess.jsx
- Auto-redirect to Google Drive after 2 seconds
- Display "Access Google Drive Folder" button
- Show redirect countdown message

## Testing Checklist

### Test Case 1: Unauthenticated User Flow
1. Click "UNLOCK NOW" on Home page
2. Should redirect to `/login?redirect=/checkout?pay=1`
3. Login with `aswin3112sand@gmail.com`
4. Should auto-redirect to checkout
5. Complete payment
6. Should redirect to Google Drive folder

### Test Case 2: New User Registration
1. Click "UNLOCK NOW" on Home page
2. Click "Start Your Journey" on Login page
3. Should go to `/register?redirect=/checkout?pay=1`
4. Register new account
5. Should redirect to login with redirect param
6. Login
7. Should auto-redirect to checkout
8. Complete payment
9. Should redirect to Google Drive folder

### Test Case 3: Authenticated User
1. Login first
2. Click "UNLOCK NOW"
3. Should go directly to checkout
4. Complete payment
5. Should redirect to Google Drive folder

### Test Case 4: Mock Payment (Dev Mode)
1. Set `app.payment.mock=true` in application.properties
2. Click "Buy Now"
3. Click "Complete Mock Payment"
4. Should show success and redirect to Google Drive

## Security Features

1. **Email Allowlist**: Only `aswin3112sand@gmail.com` can access
2. **Google Drive Permissions**: Folder access restricted to allowed email
3. **JWT Authentication**: All payment endpoints require login
4. **Signature Verification**: Razorpay signatures verified on backend
5. **Access Policy**: Backend validates user before processing payment

## Configuration

### To Change Allowed Email
Edit `application.properties`:
```properties
app.access.allowedEmail=your-email@example.com
```

### To Change Google Drive Folder
Edit `application.properties`:
```properties
app.links.googleDriveFolder=https://drive.google.com/drive/folders/YOUR_FOLDER_ID?usp=sharing
```

### To Enable Real Razorpay
Edit `application.properties`:
```properties
app.payment.mock=false
app.razorpay.keyId=rzp_live_YOUR_KEY
app.razorpay.keySecret=YOUR_SECRET
```

## API Endpoints

### Create Order
```
POST /api/payment/order
Body: { buyerName?, buyerPhone? }
Response: { ok, mode, keyId, orderId, amountPaise, currency, message }
```

### Verify Payment
```
POST /api/payment/verify
Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
Response: { ok, unlocked, message, unlockedVideoUrl (Google Drive URL) }
```

### Webhook Handler
```
POST /api/payment/webhook/razorpay
Body: { order_id, payment_id, razorpay_signature? }
Response: { ok, unlocked, message, unlockedVideoUrl (Google Drive URL) }
```

## Notes

- Payment success redirects to Google Drive after 2 seconds
- User can manually click "Access Google Drive Folder" button
- All payment data is stored in Purchase table
- User access flag is set to true after successful payment
- Email notifications can be enabled via SMTP configuration
