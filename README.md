#AI Assessment Creator

A production-grade, full-stack platform that uses AI to generate structured exam papers for educators. Built with Next.js, Express, MongoDB, Redis, BullMQ, and Socket.IO.

---

## Architecture Overview

```
Frontend (Next.js)
    │
    ├── POST /api/assignments          # Create assignment + enqueue job
    │
    ▼
Express API (Node.js)
    │
    ├── Validates input (Zod)
    ├── Stores assignment in MongoDB
    └── Enqueues job in BullMQ
            │
            ▼
    BullMQ Queue (Redis)
            │
            ▼
    Assessment Worker
            │
            ├── Builds structured prompt
            ├── Calls OpenAI API
            ├── Parses + validates JSON (Zod)
            ├── Normalises schema
            ├── Stores GeneratedPaper in MongoDB
            └── Emits WebSocket events
                        │
                        ▼
            Socket.IO → Frontend
                        │
                        ▼
                Live UI Updates
```

### Key Design Decisions

- **Never render raw AI output** — all responses are parsed, Zod-validated, and normalised before storage
- **Queue-based architecture** — long-running AI jobs never block the API thread
- **Redis caching** — identical prompts return cached results instantly (SHA-256 keyed)
- **Room-based WebSockets** — each assignment has its own Socket.IO room for isolated real-time updates
- **Retry strategies** — BullMQ handles transient failures with exponential backoff

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Realtime | Socket.IO Client |
| Backend | Express.js, TypeScript |
| Database | MongoDB + Mongoose |
| Cache / Queue | Redis + BullMQ |
| AI | OpenAI API (gpt-4o) |
| Infra | Docker + Docker Compose |

---

## Folder Structure

```
ai-assessment-creator/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── app/
│       │   ├── layout.tsx              # Root layout
│       │   ├── page.tsx                # Dashboard
│       │   ├── globals.css
│       │   ├── assignments/
│       │   │   └── create/page.tsx     # Create assignment form
│       │   └── assessments/
│       │       └── [id]/page.tsx       # Assessment viewer + live updates
│       ├── components/
│       │   ├── ui/                     # shadcn/ui components
│       │   ├── forms/                  # Form components
│       │   └── assessment/             # Paper-specific components
│       ├── store/
│       │   └── assessmentStore.ts      # Zustand store
│       ├── hooks/
│       │   └── useGenerationSocket.ts  # Socket.IO hook
│       ├── lib/
│       │   ├── api.ts                  # Axios API client
│       │   └── utils.ts               # Helpers
│       └── types/
│           └── index.ts               # Shared TypeScript types
└── backend/
    ├── Dockerfile
    ├── Dockerfile.worker
    └── src/
        ├── index.ts                    # Express server entry
        ├── models/
        │   ├── Assignment.ts           # Assignment schema
        │   └── GeneratedPaper.ts       # Paper schema
        ├── controllers/
        │   ├── assignment.controller.ts
        │   ├── assessment.controller.ts
        │   └── upload.controller.ts
        ├── routes/
        │   ├── assignment.routes.ts
        │   ├── assessment.routes.ts
        │   └── upload.routes.ts
        ├── queues/
        │   └── assessmentQueue.ts      # BullMQ queue
        ├── workers/
        │   └── assessmentWorker.ts     # BullMQ worker processor
        ├── prompts/
        │   └── assessmentPrompt.ts     # Prompt builder
        ├── parsers/
        │   └── assessmentParser.ts     # Zod validator + normaliser
        ├── services/
        │   └── aiService.ts            # OpenAI client + caching
        ├── websocket/
        │   └── socket.ts              # Socket.IO setup
        ├── middleware/
        │   ├── errorHandler.ts
        │   └── requestLogger.ts
        └── utils/
            ├── database.ts            # MongoDB connection
            └── redis.ts               # Redis client + helpers
```

---

## API Routes

### Assignments

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/assignments` | Create assignment + enqueue AI generation |
| `GET` | `/api/assignments` | List all assignments (paginated) |
| `GET` | `/api/assignments/:id` | Get single assignment |
| `DELETE` | `/api/assignments/:id` | Delete assignment |

### Assessments

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/assessments/by-assignment/:id` | Get paper for an assignment |
| `GET` | `/api/assessments/:id` | Get paper by paper ID |
| `POST` | `/api/assessments/regenerate/:assignmentId` | Re-queue generation |
| `GET` | `/api/assessments/job/:jobId/status` | Poll job status |

### Upload

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/upload` | Upload PDF/TXT, returns extracted text |

---

## WebSocket Events

| Event | Direction | Payload |
|---|---|---|
| `join-assignment` | Client → Server | `assignmentId` |
| `generation-started` | Server → Client | `{ jobId, assignmentId, message }` |
| `generation-progress` | Server → Client | `{ progress: 0-100, message }` |
| `generation-complete` | Server → Client | `{ jobId, paperId, cached }` |
| `generation-failed` | Server → Client | `{ error }` |

---

## Queue Workflow

```
1. API receives assignment creation request
2. Assignment saved to MongoDB with status: 'queued'
3. Job enqueued in BullMQ ('assessment-generation' queue)
4. Worker picks up job (concurrency=3)
5. Emits generation-started via WebSocket
6. Builds prompt from assignment metadata + extracted syllabus text
7. Checks Redis cache (SHA-256 hash of prompt)
   - Cache hit  → skip AI call, return cached JSON
   - Cache miss → call OpenAI API with json_object response format
8. Emits generation-progress (25%, 50%, 70%...)
9. Parses JSON response
10. Validates with Zod schema
11. Normalises (assigns unique IDs, ensures MCQ has options, etc.)
12. Saves GeneratedPaper document to MongoDB
13. Updates Assignment status to 'completed'
14. Emits generation-complete with paperId
15. Frontend fetches paper via /api/assessments/by-assignment/:id
```

---

## Environment Variables

### Backend (`.env`)

```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-assessment

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o

# App
FRONTEND_URL=http://localhost:3000
WORKER_CONCURRENCY=3
UPLOAD_DIR=./uploads
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

---

## Setup & Running

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- OpenAI API key

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repo
git clone <repo-url> && cd ai-assessment-creator

# Set your OpenAI API key
echo "OPENAI_API_KEY=sk-your-key" > .env

# Start all services
docker compose up --build
```

Services start at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379

### Option 2: Local Development

```bash
# Start MongoDB and Redis
docker compose up mongodb redis -d

# Backend
cd backend
cp .env.example .env     # Add your OPENAI_API_KEY
npm install
npm run dev              # API server on :5000

# Worker (separate terminal)
cd backend
npm run worker

# Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev              # Next.js on :3000
```

---

## Features

- ✦ **3-step creation form** — title, question config, difficulty distribution
- ✦ **PDF/TXT syllabus upload** — extracted text used as AI context
- ✦ **Live generation progress** — real-time WebSocket updates with progress bar
- ✦ **Structured AI output** — JSON parsed and Zod-validated before storage
- ✦ **Exam-style paper UI** — sections, instructions, difficulty badges, mark allocations
- ✦ **PDF export** — browser print → PDF with clean print styles
- ✦ **Regenerate** — re-queue generation for any completed assignment
- ✦ **Redis caching** — identical prompts return cached results instantly
- ✦ **Retry logic** — exponential backoff on failed AI calls

---

## Screenshots

| Dashboard | Create Assignment | Assessment View |
|---|---|---|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## License

MIT
