# AS DANCE - Complete Checkout Flow Verification Prompt

## Overview
This prompt documents the complete user flow from login → checkout → Razorpay payment → home/logout redirects.

---

## Flow Diagram

```
User (Not Logged In)
    ↓
[Click "Buy Now" on Home]
    ↓
ProtectedRoute checks auth
    ↓
NOT AUTHENTICATED → Redirect to /login with state.from = "/checkout?pay=1"
    ↓
[Login Page]
    ↓
User enters email & password
    ↓
Backend: POST /api/auth/login
    ├─ Validates credentials
    ├─ Creates JWT token
    ├─ Sets HttpOnly cookie (30 days)
    └─ Returns: { id, email, token }
    ↓
Frontend: Login successful
    ↓
Navigate to targetPath = "/checkout?pay=1" (from state.from)
    ↓
ProtectedRoute checks auth
    ↓
AUTHENTICATED → Allow access to Checkout page
    ↓
[Checkout Page Loads]
    ├─ Razorpay script loads (prefetched in head)
    ├─ Load payment status: GET /api/payment/status
    ├─ Load buyer name & phone from localStorage
    └─ autoPay=1 triggers automatic order creation
    ↓
[User sees Checkout Form]
    ├─ Name field (optional, from localStorage)
    ├─ WhatsApp number field (optional, from localStorage)
    ├─ "Buy Now" button
    └─ "Complete Mock Payment" button (if MOCK mode)
    ↓
[User clicks "Buy Now"]
    ↓
Frontend: createOrder() function
    ├─ Validates phone number (if provided)
    ├─ POST /api/payment/order
    │   ├─ Backend creates Razorpay order
    │   ├─ Returns: { orderId, amountPaise, keyId, mode, currency }
    │   └─ Stores order in state
    ├─ Checks if Razorpay script loaded
    └─ Opens Razorpay checkout modal
    ↓
[Razorpay Modal Opens]
    ├─ Prefilled with: name, email, phone
    ├─ Shows amount: ₹499
    └─ User completes payment
    ↓
[Payment Handler Triggered]
    ├─ Razorpay returns: { razorpay_payment_id, razorpay_signature }
    ├─ Frontend: POST /api/payment/webhook/razorpay
    │   ├─ Backend verifies signature
    │   ├─ Marks user as unlocked
    │   ├─ Returns: { ok: true, unlocked: true, unlockedVideoUrl }
    │   └─ Frontend refreshes auth context
    └─ Navigate to /payment-success
    ↓
[Payment Success Page]
    ├─ Shows order details
    ├─ Shows payment ID
    └─ "Home" button available
    ↓
[User clicks "Home" button]
    ↓
Navigate to "/" (Home page)
    ↓
[Home Page]
    ├─ User is still authenticated
    ├─ Shows "Logout" button in navbar
    └─ Shows "Preview" button (unlocked content)
    ↓
[User clicks "Logout" button]
    ↓
Frontend: logout() function
    ├─ POST /api/auth/logout
    │   ├─ Backend clears cookie
    │   └─ Returns: { ok: true }
    ├─ Frontend: refresh() → setUser(null)
    └─ Navigate to "/" (Home page)
    ↓
[Home Page - Not Authenticated]
    ├─ Shows "Login" button
    ├─ Shows "Register" button
    └─ "Buy Now" button redirects to /login
```

---

## Key Components & Files

### Frontend

#### 1. **App.jsx** - Route Protection
- `ProtectedRoute` component checks authentication
- If not authenticated: redirects to `/login` with `state.from` (current path)
- If authenticated: allows access to protected pages

#### 2. **auth.jsx** - Authentication Context
- `useAuth()` hook provides: `{ loading, user, login, register, logout, refresh }`
- `login(email, password)` - calls `/api/auth/login`
- `logout()` - calls `/api/auth/logout` then refreshes
- `refresh()` - calls `/api/auth/me` to sync user state

#### 3. **Login.jsx** - Login Page
- Reads `state.from` from location (default: `/checkout?pay=1`)
- After successful login: navigates to `targetPath`
- Stores email in state for pre-fill on register page

#### 4. **Checkout.jsx** - Checkout Page
- Loads Razorpay script on mount (prefetched in `document.head`)
- `autoPay=1` in URL triggers automatic order creation
- `createOrder()` - creates order and opens Razorpay modal
- `finalizePayment()` - verifies payment with backend
- Redirects to `/payment-success` or `/payment-failed`
- "Home" button navigates to `/`
- "Logout" button calls `logout()` then navigates to `/`

#### 5. **PaymentSuccess.jsx** - Success Page
- Shows order details
- "Home" button navigates to `/`

---

### Backend

#### 1. **AuthController.java** - Authentication Endpoints
```
POST /api/auth/register
  - Creates new user
  - Returns: { ok, message }

POST /api/auth/login
  - Validates credentials
  - Creates JWT token
  - Sets HttpOnly cookie
  - Returns: { ok, message, id, email, token }

POST /api/auth/logout
  - Clears cookie
  - Returns: { ok, message }

GET /api/auth/me
  - Returns current user: { id, email, fullName, unlocked }
  - Returns 401 if not authenticated
```

#### 2. **PaymentController.java** - Payment Endpoints
```
POST /api/payment/order
  - Requires authentication
  - Creates Razorpay order
  - Returns: { ok, mode, keyId, orderId, amountPaise, currency, message }

POST /api/payment/webhook/razorpay
  - Requires authentication
  - Verifies Razorpay signature
  - Marks user as unlocked
  - Returns: { ok, unlocked, message, unlockedVideoUrl }

GET /api/payment/status
  - Returns payment status
  - Works with or without authentication
  - Returns: { ok, unlocked, message, unlockedVideoUrl }

POST /api/payment/downloaded
  - Logs download event
```

---

## Security Flow

### Authentication
1. **Login**: User credentials → JWT token → HttpOnly cookie
2. **Protected Routes**: Check `Authentication` object from Spring Security
3. **Logout**: Clear cookie → Refresh auth context → Redirect to home

### Payment Verification
1. **Order Creation**: Backend creates Razorpay order (requires auth)
2. **Payment Handler**: Razorpay returns payment details
3. **Webhook Verification**: Backend verifies Razorpay signature
4. **Unlock**: User marked as unlocked in database

---

## Testing Checklist

### Login Flow
- [ ] Click "Buy Now" on home (not logged in)
- [ ] Redirected to `/login` with `state.from = "/checkout?pay=1"`
- [ ] Enter credentials and submit
- [ ] Redirected to `/checkout?pay=1`
- [ ] Checkout page loads with autoPay=1

### Checkout Flow
- [ ] Razorpay script loads immediately (no delay)
- [ ] Name & phone fields pre-filled from localStorage
- [ ] Click "Buy Now" button
- [ ] Razorpay modal opens
- [ ] Complete payment (mock or real)

### Payment Success Flow
- [ ] Redirected to `/payment-success`
- [ ] Shows order details
- [ ] Click "Home" button
- [ ] Redirected to `/` (home page)
- [ ] User still authenticated

### Logout Flow
- [ ] On home page, click "Logout" button
- [ ] Backend clears cookie
- [ ] Frontend redirects to `/`
- [ ] User is no longer authenticated
- [ ] "Login" button appears

### Payment Failed Flow
- [ ] Cancel payment in Razorpay modal
- [ ] Redirected to `/payment-failed`
- [ ] Shows error message
- [ ] Can go back to checkout or home

---

## Configuration

### Backend (application.properties)
```properties
# Payment Mode
app.payment.mock=true  # Set to false for real Razorpay

# Razorpay Keys (if not mock)
app.razorpay.keyId=YOUR_KEY_ID
app.razorpay.keySecret=YOUR_SECRET

# Bundle Price
app.bundle.amountPaise=49900  # ₹499

# Unlocked Video URL
app.links.unlockedVideo=YOUR_BUNNY_VIDEO_URL

# Demo Links
app.links.demo1=...
app.links.demo2=...
app.links.demo3=...
app.links.demo4=...
```

### Frontend (Checkout.jsx)
```javascript
const RAZORPAY_TEST_KEY = "rzp_test_RrudoJsyYr2V2b";
const SUPPORT_WHATSAPP = "+91 88256 02356";
const SUPPORT_EMAIL = "businessaswin@gmail.com";
```

---

## Common Issues & Fixes

### Issue: Razorpay takes too long to load
**Fix**: Razorpay script is now prefetched in `document.head` on page load

### Issue: User redirected to login after payment
**Fix**: Ensure `ProtectedRoute` checks `loading` state before redirecting

### Issue: Logout doesn't clear authentication
**Fix**: Ensure `logout()` calls `refresh()` to update auth context

### Issue: Payment status not updating
**Fix**: Ensure `finalizePayment()` calls `refresh()` and `loadStatus()`

### Issue: Name/phone not saved
**Fix**: Check localStorage is enabled and `handleNameChange()`/`handlePhoneChange()` are called

---

## Environment Setup

### Run Backend
```bash
cd backend
mvn spring-boot:run
```

### Run Frontend (Dev)
```bash
cd frontend
npm install
npm run dev
```

### Build Frontend for Backend
```bash
cd frontend
npm run build:backend
```

### Run Full Stack
```bash
cd backend
mvn spring-boot:run
# Open http://localhost:8085
```

---

## Notes

- JWT token stored in HttpOnly cookie (secure, not accessible via JS)
- Payment status persists in database
- User can access checkout multiple times
- Razorpay script loads once and is reused
- Mock mode doesn't require Razorpay keys
- All redirects use `replace: true` to prevent back button issues
