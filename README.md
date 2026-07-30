# TaskTrack

## Tech Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, Axios, React Query, React Hook Form, Zod, React Hot Toast, Lucide React
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Environment: `.env` for backend, `VITE_API_URL` for frontend

## Backend Setup

1. Create and activate a virtual environment:

Windows PowerShell:
```powershell
cd d:\kerja\tasktrack\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:
```bash
cd /d/kerja/tasktrack/backend
python3 -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:
```bash
python -m pip install -r requirements.txt
```

3. Create a `.env` file in the project root (`d:\kerja\tasktrack`) with:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/tasktrack
VITE_API_URL=http://localhost:8000
```

4. Run the backend server:
```bash
cd d:\kerja\tasktrack\backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Frontend Setup

1. Install dependencies:
```bash
cd d:\kerja\tasktrack\frontend
npm install
```

2. Run the frontend dev server:
```bash
npm run dev
```

3. Open the app in the browser at:
```
http://localhost:4173
```

## API Endpoints

- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/{task_id}`
- `DELETE /tasks/{task_id}`
- `GET /tasks/stats`

### Example Request / Response

#### Get all tasks
Request:
```bash
curl http://localhost:8000/tasks
```
Response:
```json
[
  {
    "id": 1,
    "title": "Example task",
    "description": "Task description",
    "status": "Todo",
    "deadline": "2026-07-30T10:00:00Z",
    "created_at": "2026-07-30T01:00:00Z",
    "updated_at": "2026-07-30T01:00:00Z"
  }
]
```

#### Create a task
Request:
```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New task","description":"Describe the task","status":"Todo","deadline":"2026-07-30T10:00:00"}'
```
Response:
```json
{
  "id": 2,
  "title": "New task",
  "description": "Describe the task",
  "status": "Todo",
  "deadline": "2026-07-30T10:00:00Z",
  "created_at": "2026-07-30T02:00:00Z",
  "updated_at": "2026-07-30T02:00:00Z"
}
```

#### Update task status
Request:
```bash
curl -X PATCH http://localhost:8000/tasks/2 \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'
```

#### Delete a task
Request:
```bash
curl -X DELETE http://localhost:8000/tasks/2
```

#### Get task stats
Request:
```bash
curl http://localhost:8000/tasks/stats
```
Response:
```json
{
  "total": 3,
  "todo": 1,
  "in_progress": 1,
  "done": 1
}
```

## Environment Variables

- `DATABASE_URL`: database connection string for backend
- `VITE_API_URL`: base URL for API calls from frontend

Example `.env` content:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/tasktrack
VITE_API_URL=http://localhost:8000
```

## Notes

- FastAPI exposes Swagger UI at `http://localhost:8000/docs`.
- Adjust the database URL with your PostgreSQL username, password, host, and port.
