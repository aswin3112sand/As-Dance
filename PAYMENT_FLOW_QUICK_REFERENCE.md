# Quick Reference - Payment Flow Testing

## Test Credentials
- **Email**: aswin3112sand@gmail.com
- **Password**: (set during registration or use existing)
- **Razorpay Test Key**: rzp_test_RrudoJsyYr2V2b
- **Google Drive Folder**: https://drive.google.com/drive/folders/1oR57VFOfBdriDAsO37JLon1KCPefFfw2?usp=sharing

## Flow Summary

### 1. Unauthenticated User Clicks "UNLOCK NOW"
```
Home Page → Click "UNLOCK NOW"
↓
Redirects to: /login?redirect=/checkout?pay=1
↓
User sees Login page with redirect param
```

### 2. User Logs In
```
Login Page → Enter credentials → Click "Enter the Stage"
↓
Backend validates email (must be aswin3112sand@gmail.com)
↓
Auto-redirects to: /checkout?pay=1
```

### 3. New User Registration Flow
```
Login Page → Click "Start Your Journey"
↓
Redirects to: /register?redirect=/checkout?pay=1
↓
Register Page → Fill form → Click "Create My Access"
↓
Auto-redirects to: /login?redirect=/checkout?pay=1
↓
Login Page → Enter credentials → Click "Enter the Stage"
↓
Auto-redirects to: /checkout?pay=1
```

### 4. Checkout Page
```
Checkout Page → Enter Name & WhatsApp (optional)
↓
Click "Buy Now"
↓
Razorpay Modal Opens
```

### 5. Payment Success
```
Complete Payment in Razorpay Modal
↓
Backend verifies payment
↓
PaymentSuccess page shows
↓
Auto-redirects to Google Drive after 2 seconds
↓
User can also click "Access Google Drive Folder" button
```

## Key Files Modified

### Backend
- `backend/src/main/resources/application.properties`
  - Added: `app.links.googleDriveFolder`
  - Updated: `app.access.allowedEmail`

- `backend/src/main/java/com/asdance/payment/PaymentService.java`
  - Added: `googleDriveFolder` property
  - Updated: `verify()` method to return Google Drive URL
  - Updated: `handleWebhook()` method to return Google Drive URL

### Frontend
- `frontend/src/ui/pages/Login.jsx`
  - Extract redirect query param
  - Pass redirect to Register link

- `frontend/src/ui/pages/Register.jsx`
  - Extract redirect query param
  - Redirect to login with redirect param after registration

- `frontend/src/ui/components/HeroSection.jsx`
  - Updated handleCheckout to use redirect param

- `frontend/src/ui/pages/Checkout.jsx`
  - Pass googleDriveUrl to PaymentSuccess state

- `frontend/src/ui/pages/PaymentSuccess.jsx`
  - Auto-redirect to Google Drive after 2 seconds
  - Display Google Drive access button

## Configuration

### To Change Allowed Email
```properties
# In application.properties
app.access.allowedEmail=your-email@example.com
```

### To Change Google Drive Folder
```properties
# In application.properties
app.links.googleDriveFolder=https://drive.google.com/drive/folders/YOUR_FOLDER_ID?usp=sharing
```

### To Enable Real Razorpay
```properties
# In application.properties
app.payment.mock=false
app.razorpay.keyId=rzp_live_YOUR_KEY
app.razorpay.keySecret=YOUR_SECRET
```

### To Use Mock Payment (Dev)
```properties
# In application.properties
app.payment.mock=true
```

## API Endpoints

### Create Order
```
POST /api/payment/order
Headers: Content-Type: application/json
Body: {
  "buyerName": "John Doe",
  "buyerPhone": "9876543210"
}
Response: {
  "ok": true,
  "mode": "RAZORPAY" | "MOCK",
  "keyId": "rzp_test_...",
  "orderId": "order_...",
  "amountPaise": 49900,
  "currency": "INR",
  "message": "Order created"
}
```

### Verify Payment
```
POST /api/payment/verify
Headers: Content-Type: application/json
Body: {
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "signature..."
}
Response: {
  "ok": true,
  "unlocked": true,
  "message": "Payment Success ✔ Bundle Unlocked!",
  "unlockedVideoUrl": "https://drive.google.com/drive/folders/..."
}
```

## Troubleshooting

### User Gets "Access restricted to allowed email"
- Check if email is `aswin3112sand@gmail.com`
- Update `app.access.allowedEmail` in application.properties

### Payment Success But No Redirect
- Check browser console for errors
- Verify Google Drive URL is set in application.properties
- Check if redirect URL is valid

### Razorpay Modal Not Opening
- Verify Razorpay script is loaded (check Network tab)
- Check if `razorpayReady` state is true
- Verify test key is correct

### Mock Payment Not Working
- Set `app.payment.mock=true` in application.properties
- Restart backend
- Click "Complete Mock Payment" button

## Security Notes

1. **Email Allowlist**: Only configured email can access
2. **Google Drive Permissions**: Folder access restricted to allowed email
3. **JWT Authentication**: All endpoints require valid JWT token
4. **Signature Verification**: Razorpay signatures verified on backend
5. **Access Policy**: Backend validates user before processing payment

## Support

- **WhatsApp**: +91 88256 02356
- **Email**: businessaswin@gmail.com
