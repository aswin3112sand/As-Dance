# 🚀 QUICK START - PAYMENT SYSTEM

## ⚡ 5-MINUTE SETUP

### Step 1: Start Backend
```bash
cd backend
mvn clean spring-boot:run
```
Wait for: `Started AsDanceApplication`

### Step 2: Open Browser
```
http://localhost:8085
```

### Step 3: Register Account
- Email: `test@example.com`
- Password: `Test@123`
- Name: `Test User`

### Step 4: Login
- Email: `test@example.com`
- Password: `Test@123`

### Step 5: Go to Checkout
- Click "Checkout" or navigate to `/checkout`

### Step 6: Click "Buy Now"
- Razorpay popup opens
- Use test card below

### Step 7: Complete Payment
**Test Card Details**:
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25` (any future date)
- CVV: `123`
- OTP: `123456`

### Step 8: Verify Success
- Success page appears
- Order ID displayed
- Payment ID displayed
- Amount: ₹499

---

## ✅ WHAT HAPPENS BEHIND THE SCENES

1. **Order Created** → Backend generates Razorpay order
2. **Payment Processed** → Razorpay handles payment
3. **Signature Verified** → Backend verifies payment signature
4. **Payment Saved** → Purchase record created in database
5. **Access Unlocked** → User.hasAccess = true
6. **Notification Sent** → Email/WhatsApp notification
7. **Success Page** → User redirected to success page

---

## 🔍 VERIFY PAYMENT SAVED

### Check Database
```sql
SELECT * FROM purchases WHERE user_id = 1;
```

### Check User Access
```sql
SELECT id, email, has_access FROM users WHERE email = 'test@example.com';
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Successful Payment
- Use test card above
- Payment succeeds
- Access unlocked ✅

### Scenario 2: Failed Payment
- Use card: `4000 0000 0000 0002`
- Payment fails
- Error message shown

### Scenario 3: Mock Mode
- Click "Complete Mock Payment"
- Payment verified without Razorpay
- Access unlocked ✅

---

## 🐛 TROUBLESHOOTING

### Issue: "Payment gateway failed to load"
**Solution**: 
- Check internet connection
- Refresh page
- Clear browser cache

### Issue: "Order create failed"
**Solution**:
- Ensure you're logged in
- Check backend logs
- Verify Razorpay keys in application.properties

### Issue: "Signature mismatch"
**Solution**:
- Verify secret key is correct
- Check order_id and payment_id
- Restart backend

### Issue: "Access restricted"
**Solution**:
- Check if email is in allowed list
- Verify user is logged in
- Check application.properties

---

## 📊 MONITORING

### Backend Logs
```bash
tail -f backend/app.log
```

### Database Queries
```sql
-- All payments
SELECT * FROM purchases;

-- User access status
SELECT id, email, has_access FROM users;

-- Recent payments
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 10;
```

---

## 🔐 SECURITY NOTES

⚠️ **IMPORTANT**:
- Secret key: `QvbG305OwIfKv1CHD61f8C2L` (TEST ONLY)
- Never expose secret key in frontend
- Always verify signature on backend
- Use production keys for live deployment

---

## 📞 SUPPORT

- WhatsApp: +91 88256 02356
- Email: businessaswin@gmail.com

---

## ✅ CHECKLIST

- [ ] Backend running on port 8085
- [ ] Frontend accessible at http://localhost:8085
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Can navigate to checkout
- [ ] Can click "Buy Now"
- [ ] Razorpay popup opens
- [ ] Can complete test payment
- [ ] Success page appears
- [ ] Payment saved in database
- [ ] User access unlocked

---

**Status**: ✅ READY TO TEST
