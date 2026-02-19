# TaskApp (Interview Project)

A full-stack task manager built for an interview-style assignment: **add, view, update, and delete tasks** with authentication.

## Stack

### Frontend
- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4

### Backend
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core + SQL Server
- JWT authentication
- BCrypt password verification

---

## What the app does

- User login with JWT token
- Fetch authenticated user tasks (`/tasks/me`)
- Add new task (title, status, category, priority, due date, notes)
- Edit status/notes
- Delete task
- Filter by priority, due date, category
- Client-side pagination (4 tasks per page)

---

## Repository structure

```text
TaskApp/
  backend/
    TaskApp.Api/
      Controllers/
      Context/
      Dtos/
      Extensions/
      Middleware/
      Services/
      Program.cs
      appsettings.json
  frontend/
    taskapp-web/
      app/
        api/[...path]/route.ts
        dashboard/
          components/
          hooks/
          dashboardReducer.ts
          types.ts
          page.tsx
        login/page.tsx
      package.json
      README.md
```

---

## Architecture notes

### Frontend API proxy
The frontend does **not** call backend URLs directly from browser code.
It calls relative routes (`/api/...`), and Next route handler `app/api/[...path]/route.ts` forwards requests to the backend using `API_BASE_URL`.

Benefits:
- Centralized backend URL config
- Cleaner frontend API client
- Fewer CORS concerns in local dev

### Dashboard state organization
Dashboard page uses a reducer + hooks-based composition:
- `dashboardReducer.ts`: state transitions and actions
- `hooks/useDashboardActions.ts`: create/update/delete/edit handlers
- `hooks/useDashboardForm.ts`: form state/actions wiring
- `hooks/useDashboardFilters.ts`: filter state/actions wiring
- `hooks/useDashboardFilteredTasks.ts`: filtered + sorted task derivation
- `hooks/useDashboardPagination.ts`: pagination derivation

This keeps UI components mostly presentational and page-level orchestration small.

---

## Prerequisites

- **Node.js >= 20.9.0** (required by Next.js 16)
- **npm**
- **.NET SDK 10**
- **SQL Server** instance reachable from your machine

> If `npm run dev` or `npm run build` fails with Node version errors, upgrade Node first.

---

## Backend setup (ASP.NET API)

From project root:

```bash
cd backend/TaskApp.Api
```

### 1) Configure settings
`appsettings.json` currently contains:
- `ConnectionStrings:DefaultConnection`
- `Jwt:Issuer`
- `Jwt:Audience`
- `Jwt:Key`

Update these values for your environment.

### 2) Restore + run

```bash
dotnet restore
dotnet run
```

Default local URL from launch settings:
- `http://localhost:5230`

---

## Frontend setup (Next.js)

From project root:

```bash
cd frontend/taskapp-web
```

### 1) Environment variable
Create `.env.local`:

```bash
API_BASE_URL=http://localhost:5230
```

### 2) Install + run

```bash
npm install
npm run dev
```

Frontend runs at:
- `http://localhost:3000`

---

## API summary

### Auth
- `POST /auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

Returns JWT token in response payload.

### Tasks (all require Bearer token)
- `GET /tasks/me` — list current user tasks
- `GET /tasks/categories` — list current user categories
- `POST /tasks/me` — create task
- `PUT /tasks/{id}` — update task status/notes
- `DELETE /tasks/{id}` — delete task

Create request example:

```json
{
  "title": "Prepare interview notes",
  "status": "Open",
  "description": "Review architecture answers",
  "category": "Interview",
  "priority": "High",
  "dueDate": "2026-02-20",
  "notes": "Focus on system design"
}
```

Update request example:

```json
{
  "status": "Completed",
  "notes": "Done"
}
```

---

## API smoke test (copy-paste)

Run these after backend is running on `http://localhost:5230`.

### PowerShell (Windows)

```powershell
# 0) Set your real test credentials
$email = "your-user@email.com"
$password = "your-password"

# 1) Login -> token
$loginBody = @{ email = $email; password = $password } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:5230/auth/login" -ContentType "application/json" -Body $loginBody
$token = $login.token

# 2) Create task
$createBody = @{
  title = "Smoke Test Task"
  status = "Open"
  description = "Created from PowerShell smoke test"
  category = "Testing"
  priority = "Medium"
  dueDate = "2026-02-28"
  notes = "step:create"
} | ConvertTo-Json

$created = Invoke-RestMethod -Method Post -Uri "http://localhost:5230/tasks/me" -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } -Body $createBody
$taskId = $created.id

# 3) Get my tasks
Invoke-RestMethod -Method Get -Uri "http://localhost:5230/tasks/me" -Headers @{ Authorization = "Bearer $token" }

# 4) Update task
$updateBody = @{ status = "Completed"; notes = "step:update" } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri "http://localhost:5230/tasks/$taskId" -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } -Body $updateBody

# 5) Delete task
Invoke-RestMethod -Method Delete -Uri "http://localhost:5230/tasks/$taskId" -Headers @{ Authorization = "Bearer $token" }
```

### curl (WSL/macOS/Linux)

```bash
BASE_URL="http://localhost:5230"
EMAIL="your-user@email.com"
PASSWORD="your-password"

# 1) Login -> token
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

# 2) Create task
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/tasks/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Smoke Test Task","status":"Open","description":"Created from curl smoke test","category":"Testing","priority":"Medium","dueDate":"2026-02-28","notes":"step:create"}')

TASK_ID=$(echo "$CREATE_RESPONSE" | sed -n 's/.*"id":\([0-9]*\).*/\1/p')

# 3) Get my tasks
curl -s -X GET "$BASE_URL/tasks/me" -H "Authorization: Bearer $TOKEN"

# 4) Update task
curl -s -X PUT "$BASE_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed","notes":"step:update"}'

# 5) Delete task
curl -s -X DELETE "$BASE_URL/tasks/$TASK_ID" -H "Authorization: Bearer $TOKEN"
```

---

## Scripts

### Frontend
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — lint frontend

### Backend
- `dotnet run` — run API
- `dotnet build` — compile API

---
