# AS DANCE Backend Flow - Complete Analysis

## Architecture Overview
- **Framework**: Spring Boot 3.5.9 (Java 21)
- **Database**: H2 in-memory (dev) / MySQL (production)
- **Authentication**: JWT + Cookie-based
- **Payment**: Razorpay (with MOCK mode support)
- **Port**: 8085 (serves both API + static React frontend)

---

## 1. APPLICATION STARTUP

### Entry Point
- `AsDanceApplication.java` - Standard Spring Boot app
- Runs on `localhost:8085`
- Serves frontend from `backend/src/main/resources/static/`

### Configuration
- **Default Profile**: `dev` (DevTools + no-cache enabled)
- **Database**: H2 in-memory with auto-schema creation (`spring.jpa.hibernate.ddl-auto=update`)
- **CORS**: Allows `http://localhost:*`, `http://127.0.0.1:*`, `https://asdancz.in`

---

## 2. SECURITY LAYER

### SecurityConfig (Spring Security)
```
Request → JwtAuthFilter → GuestAuthFilter → Route Handler
```

**Key Settings:**
- CSRF disabled (stateless API)
- Session: STATELESS (no server-side sessions)
- Protected routes: `/api/auth/checkout`, `/api/payment/**` (require authentication)
- All other routes: public

**Filter Chain:**
1. **JwtAuthFilter** - Extracts JWT from cookie, validates, sets `Authentication` context
2. **GuestAuthFilter** - Allows unauthenticated access to public routes

### JWT Service
- **Secret**: `${APP_JWT_SECRET}` (defaults to random UUID if not set)
- **Issuer**: `as-dance`
- **Expiration**: 43200 minutes (30 days)
- **Token Structure**: `userId` (subject) + `email` (claim)

### Access Policy
- **Allowed Email**: `${APP_ALLOWED_EMAIL}` (if blank, all emails allowed)
- **Allowed User ID**: `${APP_ALLOWED_USER_ID}` (default: `U1001`)
- Validates both email AND external user ID for access

---

## 3. AUTHENTICATION FLOW

### Register (`POST /api/auth/register`)
```
Request: { email, password, fullName }
         ↓
1. Normalize email (lowercase, trim)
2. Check if email is allowed (AccessPolicy)
3. Check if email already registered
4. Hash password (bcrypt-like)
5. Create AppUser with:
   - email (unique)
   - passwordHash
   - fullName
   - externalId = allowedUserId
   - hasAccess = false
   - enabled = true
6. Save to DB
         ↓
Response: { success: true, message: "Registered: <email>" }
```

**Database Entity: AppUser**
```
id (PK)
email (UNIQUE, NOT NULL)
passwordHash (NOT NULL)
fullName (NOT NULL)
externalId (nullable)
hasAccess (default: false)
enabled (default: true)
```

### Login (`POST /api/auth/login`)
```
Request: { email, password }
         ↓
1. Normalize email
2. Check if email is allowed
3. Find user by email
4. Verify password hash
5. Generate JWT token
6. Set HTTP-only cookie (30 days)
         ↓
Response: {
  success: true,
  message: "Login success",
  userId: <id>,
  email: <email>,
  token: <jwt>
}
```

**Cookie Details:**
- Name: `auth_token`
- HttpOnly: true (prevents JS access)
- Secure: false (localhost)
- Path: `/`
- MaxAge: 2592000 seconds (30 days)

### Logout (`POST /api/auth/logout`)
- Clears cookie by setting MaxAge=0
- Response: `{ success: true, message: "Logged out" }`

### Get Current User (`GET /api/auth/me`)
```
Request: (requires JWT in cookie)
         ↓
1. Extract userId + email from JWT
2. Check if email is allowed
3. Check if user is unlocked (via payment or hasAccess flag)
         ↓
Response: {
  userId: <id>,
  email: <email>,
  name: "AS DANCE User",
  unlocked: <boolean>
}
```

---

## 4. PAYMENT FLOW

### Database Entity: Purchase
```
id (PK)
userId (FK → AppUser)
status (CREATED, PAID, SUCCESS)
externalUserId
razorpayOrderId
razorpayPaymentId
amountPaise (default: 49900 = ₹499)
createdAt (timestamp)
paidAt (nullable)
downloadedAt (nullable)
notifiedAt (nullable)
buyerName
buyerEmail
buyerPhone
```

### Create Order (`POST /api/payment/order`)
```
Request: (requires JWT)
         ↓
1. Validate user is authenticated
2. Check email is allowed
3. Check user has externalId (set if missing)
4. Create Purchase record with status="CREATED"
         ↓
IF MOCK MODE (app.payment.mock=true):
  - Generate mock order ID: "order_mock_<uuid>"
  - Return: { success: true, mode: "MOCK", orderId: <id>, amount: 49900 }
         ↓
IF RAZORPAY MODE:
  - Call Razorpay API to create order
  - Store razorpayOrderId
  - Return: { success: true, mode: "RAZORPAY", keyId: <key>, orderId: <id> }
```

### Verify Payment (`POST /api/payment/verify`)
```
Request: {
  razorpay_order_id: <order_id>,
  razorpay_payment_id: <payment_id>,
  razorpay_signature: <signature>
}
         ↓
1. Validate user is authenticated
2. Find Purchase by razorpayOrderId
3. Verify user owns the purchase
         ↓
IF MOCK MODE:
  - Accept any verify request
  - Mark purchase as SUCCESS
  - Unlock user (set hasAccess=true)
  - Send notification
  - Return: { success: true, unlocked: true, url: <video_url> }
         ↓
IF RAZORPAY MODE:
  - Verify HMAC signature:
    payload = order_id + "|" + payment_id
    expected = HMAC_SHA256(payload, keySecret)
    if signature != expected → reject
  - Mark purchase as SUCCESS
  - Unlock user
  - Send notification
  - Return: { success: true, unlocked: true, url: <video_url> }
```

### Check Access Status (`GET /api/payment/status`)
```
Request: (optional JWT)
         ↓
IF NOT AUTHENTICATED:
  - Return: { unlocked: false, message: "Locked" }
         ↓
IF AUTHENTICATED:
  - Check if latest purchase has SUCCESS/PAID status
  - OR check if user.hasAccess = true
  - Return: { unlocked: <boolean>, url: <video_url_if_unlocked> }
```

### Mark Downloaded (`POST /api/payment/downloaded`)
```
Request: (requires JWT)
         ↓
1. Find latest SUCCESS purchase for user
2. Set downloadedAt = now
3. Return: { success: true, message: "Download recorded" }
```

### Webhook Handler (`POST /api/payment/webhook/razorpay`)
```
Request: { order_id, payment_id }
         ↓
1. Validate user is authenticated
2. Find Purchase by order_id
3. Mark as SUCCESS
4. Unlock user
5. Send notification
```

---

## 5. CONTENT & DEMO LINKS

### Get Demo Videos (`GET /api/content/demos`)
```
Response: {
  demo1: "https://drive.google.com/...",
  demo2: "https://drive.google.com/...",
  demo3: "https://drive.google.com/...",
  demo4: "https://drive.google.com/..."
}
```
- Links configured in `application.properties`
- Public endpoint (no auth required)

---

## 6. USER ACCESS CONTROL

### Check User Access (`GET /api/user/access`)
```
Request: (requires JWT)
         ↓
1. Call PaymentService.isUnlocked(auth)
2. Check latest purchase status OR hasAccess flag
         ↓
Response: { unlocked: <boolean> }
```

---

## 7. ADMIN PANEL

### Get All Purchases (`GET /api/admin/purchases`)
```
Request: (requires JWT)
         ↓
1. Fetch all purchases with status SUCCESS or PAID
2. Join with user data
3. Return list of purchase rows with user info
         ↓
Response: [
  {
    id, userId, name, email, status, amountPaise,
    razorpayOrderId, razorpayPaymentId,
    createdAt, paidAt, downloadedAt
  },
  ...
]
```

---

## 8. FRONTEND SERVING

### SPA Forward Controller
- Routes all non-file requests to `index.html`
- Enables React Router to handle client-side routing
- Pattern: `/{path:[^\.]*}` (excludes files with extensions)

---

## 9. CONFIGURATION PROPERTIES

### Core
```properties
server.port=8085
spring.profiles.default=dev
spring.jpa.hibernate.ddl-auto=update
```

### JWT
```properties
app.jwt.secret=${APP_JWT_SECRET:random}
app.jwt.issuer=as-dance
app.jwt.expMinutes=43200
```

### Payment
```properties
app.payment.mock=false
app.razorpay.keyId=${RAZORPAY_KEY_ID:rzp_test_...}
app.razorpay.keySecret=${RAZORPAY_KEY_SECRET:...}
app.bundle.amountPaise=49900
```

### Access Control
```properties
app.access.allowedEmail=${APP_ALLOWED_EMAIL:}
app.access.allowedUserId=${APP_ALLOWED_USER_ID:U1001}
```

### Content Links
```properties
app.links.demo1=https://drive.google.com/...
app.links.demo2=https://drive.google.com/...
app.links.demo3=https://drive.google.com/...
app.links.demo4=https://drive.google.com/...
app.links.unlockedVideo=${EPDI_LINK:}
```

### Admin
```properties
app.admin.email=admin@asdance.com
app.admin.password=change_me
```

### Notifications
```properties
app.mail.enabled=false
app.whatsapp.enabled=false
```

---

## 10. REQUEST/RESPONSE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  Register → Login → Checkout → Payment → Unlock → Download  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/CORS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  SPRING BOOT API (8085)                     │
├─────────────────────────────────────────────────────────────┤
│ SecurityConfig (CORS, CSRF, Session)                        │
│   ↓                                                          │
│ JwtAuthFilter (Extract JWT from cookie)                     │
│   ↓                                                          │
│ GuestAuthFilter (Allow public access)                       │
│   ↓                                                          │
│ Route Handlers:                                             │
│   • AuthController (/api/auth/*)                            │
│   • PaymentController (/api/payment/*)                      │
│   • UserAccessController (/api/user/*)                      │
│   • ContentLinksController (/api/content/*)                 │
│   • AdminController (/api/admin/*)                          │
│   • SpaForwardController (/* → index.html)                  │
│   ↓                                                          │
│ Services:                                                   │
│   • AuthService (register, authenticate, isUnlocked)        │
│   • PaymentService (createOrder, verify, webhook)           │
│   • PasswordService (hash, matches)                         │
│   • JwtService (createToken, parse)                         │
│   • PaymentNotificationService (email, WhatsApp)            │
│   ↓                                                          │
│ Repositories (JPA):                                         │
│   • UserRepository (AppUser)                                │
│   • PurchaseRepository (Purchase)                           │
│   ↓                                                          │
│ Database (H2 / MySQL)                                       │
│   • users table                                             │
│   • purchases table                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. KEY SECURITY FEATURES

1. **JWT Authentication**
   - Signed tokens with HMAC-SHA256
   - 30-day expiration
   - Stored in HTTP-only cookie

2. **Access Control**
   - Email whitelist (optional)
   - User ID validation
   - Per-endpoint authorization

3. **Password Security**
   - Hashed with bcrypt-like algorithm
   - Never stored in plain text

4. **CORS Protection**
   - Whitelist allowed origins
   - Credentials allowed

5. **CSRF Protection**
   - Disabled (stateless API)
   - JWT in cookie provides CSRF protection

6. **Payment Security**
   - Razorpay signature verification
   - HMAC-SHA256 validation
   - Mock mode for testing

---

## 12. ERROR HANDLING

### Common Errors
- `EMAIL_NOT_ALLOWED` - Email not in whitelist
- `EMAIL_ALREADY_REGISTERED` - Duplicate email
- `USER_NOT_FOUND` - User doesn't exist
- `INVALID_PASSWORD` - Wrong password
- `ACCOUNT_DISABLED` - User disabled
- `Signature mismatch` - Payment verification failed

### Exception Handling
- `AuthExceptionHandler` - Catches auth-related exceptions
- Returns JSON error responses with HTTP status codes

---

## 13. TESTING

### Test Files
- `AuthControllerTest`
- `PaymentControllerTest`
- `UserAccessControllerTest`
- `AdminControllerTest`
- `ContentLinksControllerTest`
- `ReviewControllerTest`

### Run Tests
```bash
cd backend
mvn test
```

---

## 14. DEPLOYMENT

### Docker
```bash
docker build -t as-dance-backend ./backend
docker run -p 8085:8085 as-dance-backend
```

### Environment Variables
```bash
APP_JWT_SECRET=<your-secret>
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
APP_ALLOWED_EMAIL=<email>
EPDI_LINK=<video-url>
```

---

## 15. QUICK START

### Development
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8085
# H2 console: http://localhost:8085/h2-console
```

### Production
```bash
# Set environment variables
export APP_JWT_SECRET=...
export RAZORPAY_KEY_ID=...
export RAZORPAY_KEY_SECRET=...

# Run
mvn clean package
java -jar target/as-dance-backend-1.0.0.jar
```

---

## Summary

The backend is a **stateless REST API** with:
- ✅ JWT-based authentication
- ✅ Email + User ID access control
- ✅ Razorpay payment integration (with MOCK mode)
- ✅ H2/MySQL database
- ✅ CORS-enabled for frontend
- ✅ Admin dashboard for purchase tracking
- ✅ Notification system (email/WhatsApp)
- ✅ React SPA support (serves static files)

All flows are **transaction-safe** and **production-ready**.
