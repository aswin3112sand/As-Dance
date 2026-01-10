# AS DANCE – Premium 639 Step Bundle (Full Project)

**GitHub Repository:** [As Dance Website](https://github.com/aswin3112/as-dance-full-project)

## Runs on ONE localhost port
- UI + API: http://localhost:8085

## Quick Start (fastest)
1) Start backend (already includes built frontend):
```bash
cd backend
mvn spring-boot:run
```
Open: http://localhost:8085

> Note: The backend serves the frontend from `backend/src/main/resources/static/`.

## If you want to edit UI (React) and rebuild static files
```bash
cd frontend
npm install
npm run build:backend
```
This builds the React app and syncs `frontend/dist/` into
`backend/src/main/resources/static/`.

Optional (one-time) asset compression:
```bash
npm run images:webp
```

Dev mode uses the `dev` Spring profile by default (DevTools + no-cache).
To run explicitly:
```bash
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run
```

Then run backend again.

## Tests
### Frontend
```bash
cd frontend
npm test
```
Run once (CI style):
```bash
npm run test:run
```

### Backend
```bash
cd backend
mvn test
```

## Login/Payment Flow
- Create account: /register
- Login: /login
- Checkout: /checkout (protected)
- By default payment is MOCK mode (no Razorpay keys required):
  - Create Order -> Complete Payment (Mock) -> Unlock
- To enable real Razorpay:
  - Set in `backend/src/main/resources/application.properties`:
    - app.payment.mock=false
    - app.razorpay.keyId=YOUR_KEY_ID
    - app.razorpay.keySecret=YOUR_SECRET
  - Implement Razorpay Checkout UI if needed.

## Demo Links
Set your demo links in:
`backend/src/main/resources/application.properties`
- app.links.demo1..demo4

## Unlocked video link (Bunny/Drive)
Set:
- app.links.unlockedVideo=YOUR_BUNNY_VIDEO_URL

## Docker
### Build & run backend only (H2 in-memory)
```bash
docker build -t as-dance-backend ./backend
docker run -p 8085:8085 as-dance-backend
```

### Optional: docker-compose with MySQL
See `docker-compose.yml`
