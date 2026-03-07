# 🛠️  CodeForge – Distributed Coding Platform

CodeForge is a full‑stack coding practice platform where users solve programming problems, run code in multiple languages, and track their progress. It evaluates submissions against test cases, persists verdicts and submission history, and supports problem playlists for focused practice.

The system is designed with a **decoupled frontend and backend**, **secure, language‑agnostic execution** via the Judge0 API, and a clean separation between the API layer and the execution layer.

---

## 🚀 Live demo

- **Frontend (Vercel)**: [https://codeforge-theta.vercel.app](https://codeforge-theta.vercel.app)
- **Backend API (Render)**: `https://your-codeforge-backend.onrender.com` *(replace with your deployed backend URL)*

> The backend runs on Render’s free tier. If the service has been idle, the **first request may take a few seconds** while the server cold‑starts. Subsequent requests are much faster. Use [Uptime Robot](https://uptimerobot.com) to ping `/health` every 5 minutes to keep the instance awake.

---

## Key capabilities

- **User authentication**
  - JWT‑based sign up, login, and session handling.
  - Role‑based access: **User** (solve, submit, playlists) and **Admin** (create, edit, delete problems).
  - Password hashes never sent to the client; auth middleware attaches a sanitized user to requests.
- **Problem set**
  - Browse problems with difficulty (Easy / Medium / Hard) and tags.
  - Each problem has description, examples, constraints, test cases, and language‑specific code snippets (JavaScript, Python, Java, TypeScript).
  - Admins create, edit, and delete problems with full test case and reference solution support.
- **Code execution**
  - Run code against **sample test cases** (first 3) for quick feedback without submitting.
  - **Full submit** runs against all test cases; verdict is Accepted or Wrong Answer.
  - Execution is delegated to **Judge0** (RapidAPI); backend sends source code, language ID, and stdin, then maps Judge0 output to a consistent verdict and per‑test result.
  - Supported languages: JavaScript, Python, Java, TypeScript (configurable via Judge0).
- **Submissions and progress**
  - Every submission is stored with source code, language, status, and per‑test‑case results (stdout, expected, passed/failed).
  - **ProblemSolved** is updated when a user gets Accepted on a problem, so “solved” counts and lists stay correct.
  - Submission history is available per user and per problem.
- **Playlists**
  - Users create playlists and add problems to them.
  - Playlist endpoints enforce ownership; only the creator can add/remove problems or delete the playlist.
  - Frontend supports creating playlists and adding problems from the problem page.
- **Landing and UX**
  - Single‑screen landing page with hero, feature highlights, and clear CTA (“Get started”).
  - Dark theme, responsive layout, and consistent spacing; navbar merges with the main body on the landing view.
  - Monaco Editor for code input; forms validated with Zod on frontend and backend.

---

## 🧩 Tech stack

### Frontend

- React 19 (Vite 7)
- Tailwind CSS 4, DaisyUI
- Zustand (auth, problems, submissions, execution, playlists)
- React Hook Form + Zod, Axios
- Monaco Editor (`@monaco-editor/react`)
- Deployed on **Vercel**

Key files:

- `frontend/src/App.jsx` – routes, auth guard, layout.
- `frontend/src/page/LandingPage.jsx` – landing hero, features, CTA.
- `frontend/src/page/ProblemPage.jsx` – problem view, editor, run/submit, submission list.
- `frontend/src/store/`* – Zustand stores and API calls.
- `frontend/src/lib/axios.js` – Axios instance, auth header, 401 handling.
- `frontend/src/components/*` – Navbar, ProblemTable, SubmissionList, AddToPlaylist, etc.

### Backend

- Node.js, Express 5
- Prisma ORM, PostgreSQL
- JWT (jsonwebtoken), bcryptjs
- Zod – request validation (auth, submission, execute-code, playlist)
- Axios – Judge0 API client
- Deployed on **Render** as a Web Service

Key modules:

- `backend/src/index.js` – Express app, CORS, env validation, routes, 404, global error handler.
- `backend/src/controllers/`* – auth, problem, submission, executeCode, playlist, judge0.
- `backend/src/routes/*` – route definitions and validation middleware.
- `backend/src/middleware/auth.middleware.js` – JWT verification, `req.user`, admin check.
- `backend/src/middleware/validate.js` – Zod-based body/params/query validation.
- `backend/src/libs/judge0.lib.js` – Judge0 submission and batch run helpers.
- `backend/src/libs/db.js` – Prisma client singleton.
- `backend/prisma/schema.prisma` – User, Problem, Submission, TestCaseResult, ProblemSolved, Playlist.

---

## API overview

Base URL: `/api/v1` (e.g. `https://your-codeforge-backend.onrender.com/api/v1`)

### `GET /health` *(no prefix)*

Lightweight health check used by uptime monitoring and the frontend.

**Response**

```json
{ "status": "ok", "uptime": 123.456 }
```

### `GET /`

Root message (plain text).

### Auth


| Method | Path             | Description                                    |
| ------ | ---------------- | ---------------------------------------------- |
| POST   | `/auth/register` | Register (body: `email`, `password`, `name?`). |
| POST   | `/auth/login`    | Login (body: `email`, `password`).             |
| GET    | `/auth/check`    | Current user (Bearer token required).          |
| POST   | `/auth/logout`   | Logout (Bearer token required).                |


### Problems


| Method | Path                            | Description                                                |
| ------ | ------------------------------- | ---------------------------------------------------------- |
| GET    | `/problems/get-all-problems`    | List all problems (auth).                                  |
| GET    | `/problems/get-problem/:id`     | Problem by ID (auth).                                      |
| GET    | `/problems/get-solved-problems` | Problems solved by user (auth).                            |
| POST   | `/problems/create-problem`      | Create problem (admin).                                    |
| PUT    | `/problems/update-problem/:id`  | Update problem (admin).                                    |
| DELETE | `/problems/delete-problem/:id`  | Delete problem (admin).                                    |
| POST   | `/problems/execute-code`        | Run code once (body: `source_code`, `language_id`) (auth). |


### Execute code (sample test cases)


| Method | Path             | Description                                                                                                |
| ------ | ---------------- | ---------------------------------------------------------------------------------------------------------- |
| POST   | `/execute-code/` | Run code against first 3 test cases of a problem (body: `source_code`, `language_id`, `problemId`) (auth). |


### Submissions


| Method | Path                                          | Description                                                               |
| ------ | --------------------------------------------- | ------------------------------------------------------------------------- |
| POST   | `/submission/submit`                          | Submit solution (body: `problemId`, `source_code`, `language_id`) (auth). |
| GET    | `/submission/get-all-submissions`             | Current user’s submissions (auth).                                        |
| GET    | `/submission/get-submission/:problemId`       | Submissions for a problem (auth).                                         |
| GET    | `/submission/get-submission-count/:problemId` | Count of submissions for a problem (auth).                                |


### Playlists


| Method | Path                                   | Description                                                |
| ------ | -------------------------------------- | ---------------------------------------------------------- |
| GET    | `/playlist/`                           | Current user’s playlists (auth).                           |
| GET    | `/playlist/:playlistId`                | Playlist details (auth, owner only).                       |
| POST   | `/playlist/create-playlist`            | Create playlist (body: `name`, `description?`) (auth).     |
| POST   | `/playlist/:playlistId/add-problem`    | Add problems (body: `problemIds[]`) (auth, owner only).    |
| DELETE | `/playlist/:playlistId/remove-problem` | Remove problems (body: `problemIds[]`) (auth, owner only). |
| DELETE | `/playlist/:playlistId`                | Delete playlist (auth, owner only).                        |


---

## Submission and execution flow

High‑level flow:

1. **Run (sample)**
  - Client sends `source_code`, `language_id`, `problemId` to `POST /execute-code/`.  
  - Backend loads the problem’s test cases, takes the first 3, and for each calls Judge0 with that stdin.  
  - Results are compared to expected output; response includes per‑test pass/fail and an overall status (Accepted / Wrong Answer).  
  - No submission is stored.
2. **Submit (full)**
  - Client sends `problemId`, `source_code`, `language_id` to `POST /submission/submit`.  
  - Backend runs the same Judge0 flow for **all** test cases (sequentially in the current implementation).  
  - A **Submission** record is created with status, avg memory/time, and language.  
  - **TestCaseResult** rows are created for each test (passed, expected, stdout, stderr, status, memory, time).  
  - If the verdict is Accepted, **ProblemSolved** is upserted for `(userId, problemId)` so the user is marked as having solved the problem.
3. **Judge0**
  - All execution is delegated to Judge0 (RapidAPI).  
  - Backend maps Judge0 status and output to a simple verdict and test results; no code runs on the Node server.

The frontend shows run results immediately; after submit, it refreshes the submission list and can show per‑test details where available.

---

## Validation and errors

- **Request validation**  
  - Auth (register/login), submission submit, execute-code, and playlist routes use **Zod** schemas. Invalid body or params return `400` with a clear message.
- **Environment**  
  - On startup, the backend checks for required env vars (`DATABASE_URL`, `JWT_SECRET`). If any are missing, it logs and exits so misconfiguration fails fast.
- **Errors**  
  - A global error handler and a small **error formatter** ensure stack traces and internal details are not leaked in production; user‑facing or validation messages are returned when safe.
- **CORS**  
  - In production, when `CORS_ORIGINS` is set, only those origins are allowed; in development, origin is permissive for local frontend.

---

## Local development

### Backend

```bash
cd backend
npm install
```

Create a `.env` file with at least:

- `DATABASE_URL` – PostgreSQL connection string  
- `JWT_SECRET` – secret for JWT signing

Optional for code execution: `JUDGE0_API_URL`, `JUDGE0_API_KEY` (RapidAPI).

```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The API runs at `http://localhost:8080`. Use `GET /health` to verify.

### Frontend

```bash
cd frontend
npm install
```

Create `.env.development` (or `.env`) with:

```env
VITE_API_BASE_URL=http://localhost:8080
```

```bash
npm run go
```

The UI runs at `http://localhost:5173` and talks to the local backend. CORS is permissive in development.

---

## Deployment notes

### Render (backend)

- Service type: **Web Service**.
- Root directory: `backend`.
- Build command: `npm install && npx prisma generate`.
- Start command: `npm start` (runs `node src/index.js`).
- Set environment variables in the dashboard: `DATABASE_URL`, `JWT_SECRET`, and optionally `JUDGE0_API_URL`, `JUDGE0_API_KEY`, `CORS_ORIGINS` (comma‑separated frontend origins).
- Health: `GET /health` returns `{ "status": "ok", "uptime": ... }` and is safe for uptime monitors.
- Free tier: the service **sleeps when idle**. Ping `https://your-app.onrender.com/health` every 5 minutes (e.g. with [Uptime Robot](https://uptimerobot.com)) to keep it awake.

### Vercel (frontend)

- Framework: **Vite + React**.
- Root directory: `frontend`.
- Build command: `npm run build`; output directory: default `dist`.
- Environment variable: `VITE_API_BASE_URL` – set to your Render backend URL (e.g. `https://your-codeforge-backend.onrender.com`).

### Database

- Use **PostgreSQL** (e.g. Neon, Supabase, or any hosted Postgres).
- Set `DATABASE_URL` in Render to your database connection string.
- Run migrations from your machine against that DB, or add `npx prisma migrate deploy` to the Render build step if you prefer.

---

## Why this project matters ⭐

CodeForge is built as a **portfolio‑grade**, discussion‑ready project:

- Demonstrates end‑to‑end system design: frontend, REST API, database, and external execution service (Judge0).
- Handles real deployment constraints: free tiers, cold starts, env validation, and safe error responses.
- Emphasizes **security and validation**: no password in responses, playlist ownership, Zod validation, and a single error-handling path.
- Provides a strong base to discuss trade‑offs (e.g. sequential vs batch execution, scaling submissions) in interviews and technical conversations.

---

## Author

**Yashasvi Shukla**  
M.Tech (Computer Science) – Full‑Stack & AI‑focused Developer

---

## License

This project is intended for educational and portfolio use.  
If you are interested in using it commercially, please contact the author.