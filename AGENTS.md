# AGENTS.md

Purpose
- Provide a concise map of the repo and safe, repeatable workflows for agents.

Project summary
- Frontend: React + Vite in `frontend/`.
- Backend: Spring Boot in `backend/` (security, JPA).
- Deployment: backend serves the built frontend from `backend/src/main/resources/static/`.
- Single port: `8085` (see `backend/src/main/resources/application.properties`).

Repository layout
- `frontend/src/ui/`: UI components and styles.
- `frontend/scripts/`: build helpers like sync to backend.
- `backend/src/main/java/`: Spring Boot APIs and controllers.
- `backend/src/main/resources/static/`: built frontend output (do not edit by hand).
- `docker-compose.yml`: optional MySQL + backend setup.

Step-by-step: run locally (fast)
1) `cd backend`
2) `mvn spring-boot:run`
3) Open `http://localhost:8085`

Step-by-step: update frontend
1) `cd frontend`
2) `npm install` (first time only)
3) `npm run build:backend` (builds and syncs to backend static)
4) Restart backend: `cd ../backend`, Ctrl+C, then `mvn spring-boot:run`
5) Hard refresh the browser

Step-by-step: update backend
1) `cd backend`
2) `mvn spring-boot:run`
3) Restart after code changes (Ctrl+C, then rerun)

Step-by-step: Docker (backend only)
1) `docker build -t as-dance-backend ./backend`
2) `docker run -p 8085:8085 as-dance-backend`

Step-by-step: Docker Compose (backend + MySQL)
1) `docker-compose up --build`
2) Open `http://localhost:8085`
3) MySQL is exposed at `localhost:3307`

Configuration and secrets
- Primary config: `backend/src/main/resources/application.properties` or `backend/src/main/resources/application.yml`.
- Payment mode: `app.payment.mock` is `false` in repo config. For mock mode, set `APP_PAYMENT_MOCK=true`.
- Razorpay: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- JWT: `APP_JWT_SECRET`.
- Admin login: `app.admin.email` / `app.admin.password` (change defaults).
- Demo links: `app.links.demo1..demo4`, `app.links.unlockedVideo`.

Notes for agents
- Canonical port is `8085`. Some docs mention `8086`; treat those as stale.
- Frontend changes require rebuild; do not edit `backend/src/main/resources/static/` directly.
- React Router SPA fallback is handled by `backend/src/main/java/com/asdance/web/SpaForwardController.java`.
- No automated tests found. If adding tests, use `mvn test` for backend.

Optional scripts (Windows)
- `run-full-stack.bat`, `build-and-run.bat`, `fast-rebuild.bat`, `run-backend-only.bat`.
