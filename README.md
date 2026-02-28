# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent hints.

---

## What is CipherSQLStudio?

CipherSQLStudio is a SQL practice sandbox — think of it like a playground where students write SQL queries, run them, and see results instantly. It is **not** a pass/fail system. It is a learning environment where students explore, experiment, and improve through real execution feedback and AI-powered hints.

**Core idea:**
- Admin pre-loads SQL assignments with sample data
- Student selects an assignment, reads the question
- Student writes SQL in the editor and hits Run
- Real results appear — student iterates until satisfied
- Stuck? Hit Hint — AI guides without giving the answer

---

## Features

### Assignment Listing Page
- Displays all available SQL assignments
- Shows title, difficulty (Easy / Medium / Hard), and description
- Filter assignments by difficulty
- Click any card to open the attempt interface

### Assignment Attempt Interface
- **Question Panel** — full question with difficulty badge
- **Sample Data Viewer** — pre-loaded table schemas and rows
- **SQL Editor** — Monaco Editor (same engine as VS Code)
- **Results Panel** — formatted table output or error messages
- **Hint System** — AI-powered hints via Groq LLM (guides, never solves)

### Query Execution Engine
- Executes student SQL against real PostgreSQL
- Each execution runs in an isolated sandbox schema
- Sandbox is created before query, destroyed after — zero data leakage
- SQL comment stripping before sanitization
- Blocks all non-SELECT operations (DROP, DELETE, INSERT, UPDATE, etc.)

---

## Tech Stack

| Component | Technology | Why |
|-----------|------------|-----|
| Frontend | React.js + Vite | Component-based UI, fast dev server |
| Styling | Vanilla SCSS | Variables, mixins, BEM, mobile-first |
| Code Editor | Monaco Editor | VS Code engine, SQL syntax highlighting |
| Backend | Node.js + Express.js | REST API, middleware pipeline |
| Sandbox DB | PostgreSQL | Real SQL execution, schema isolation |
| Persistence DB | MongoDB Atlas | Flexible schema for assignment definitions |
| LLM | Groq (Llama 3.3 70B) | Fast inference, free tier, quality hints |
| Validation | Joi | Request validation on all routes |
| Rate Limiting | express-rate-limit | Protects LLM quota and server resources |

---

## Architecture

```
React Frontend (port 3000)
        ↕  /api proxy
Express Backend (port 5000)
   ↕              ↕              ↕
MongoDB        PostgreSQL      Groq API
(assignments)  (sandbox)       (hints)
```

### Why Two Databases?

**MongoDB** stores assignment definitions — title, question, table schemas, sample rows, expected output. The schema is flexible because different assignments have different table structures. MongoDB handles this naturally.

**PostgreSQL** is where actual SQL execution happens. MongoDB cannot run `SELECT * FROM employees WHERE salary > 50000`. PostgreSQL is a real SQL engine — so student queries run there, in isolated sandbox schemas.

Both databases serve different purposes. Neither can replace the other.

---

## PostgreSQL Sandboxing — How It Works

This is the core technical decision of the project.

Every time a student clicks **Run**, the backend:

```
1. Strips comments from query
2. Sanitizes — blocks DROP, DELETE, INSERT, UPDATE etc.
3. Creates isolated schema → sandbox_1234567_abc
4. Builds tables from MongoDB assignment data
5. Inserts sample rows into those tables
6. Sets search_path to sandbox schema
7. Executes student query
8. Returns results to frontend
9. Drops schema — CASCADE deletes everything
```

**Why sandboxing?** Without isolation, 100 students running queries simultaneously would conflict. One student writing `DROP TABLE employees` would destroy data for everyone. Each sandbox is completely independent — created and destroyed per execution.

```
Database: ciphersqlstudio
  ├── sandbox_1706123456_abc    ← Student A's execution
  │     └── employees
  ├── sandbox_1706123457_xyz    ← Student B's execution
  │     └── employees
  └── public (default)
```

---

## LLM Hint System — Prompt Engineering

The hint system uses **Groq's Llama 3.3 70B** model. The key challenge is making hints educational without revealing answers.

**What the prompt sends to the LLM:**
- The assignment question
- Available table structure (column names and types)
- Student's current query (or empty if nothing written)

**Prompt engineering rules enforced:**
- Maximum 2 sentences
- Never write SQL code
- Never reveal the answer
- Be specific to the student's actual query
- Handle three cases: nothing written, partial query, wrong logic

**Example hint quality:**

Student writes: `SELECT * FROM employees WHERE name > 50000`

Hint: *"You're trying to filter employees based on their salary, but you're comparing the name column to a number, which doesn't make sense. You should be comparing the salary column to the number 50,000 instead."*

This points to the exact mistake without writing the correct query.

---

## Project Structure

```
ciphersqlstudio/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js          # All environment variables
│   │   │   ├── mongodb.js        # MongoDB connection
│   │   │   └── postgresql.js     # PostgreSQL Pool connection
│   │   ├── models/
│   │   │   └── Assignment.js     # MongoDB schema
│   │   ├── repositories/
│   │   │   └── assignmentRepository.js
│   │   ├── services/
│   │   │   ├── assignmentService.js   # Assignment business logic
│   │   │   ├── queryService.js        # PostgreSQL sandbox execution
│   │   │   └── hintService.js         # Groq LLM hint generation
│   │   ├── controllers/
│   │   │   ├── assignmentController.js
│   │   │   ├── queryController.js
│   │   │   └── hintController.js
│   │   ├── routes/
│   │   │   ├── assignmentRoutes.js
│   │   │   ├── queryRoutes.js
│   │   │   └── hintRoutes.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js   # Centralized error handling
│   │   │   ├── notFound.js       # 404 handler
│   │   │   ├── validate.js       # Joi validation middleware
│   │   │   └── rateLimiter.js    # express-rate-limit config
│   │   ├── validators/
│   │   │   └── queryValidator.js # Joi schemas for query + hint
│   │   └── app.js
│   ├── scripts/
│   │   └── seedAssignments.js    # Pre-populate MongoDB
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AssignmentList/
    │   │   │   ├── AssignmentList.jsx
    │   │   │   └── AssignmentCard.jsx
    │   │   ├── AssignmentAttempt/
    │   │   │   ├── AssignmentAttempt.jsx
    │   │   │   ├── QuestionPanel.jsx
    │   │   │   ├── SampleDataViewer.jsx
    │   │   │   ├── SqlEditor.jsx
    │   │   │   ├── ResultsPanel.jsx
    │   │   │   └── HintPanel.jsx
    │   │   └── shared/
    │   │       ├── Navbar.jsx
    │   │       └── Loader.jsx
    │   ├── services/
    │   │   ├── assignmentService.js
    │   │   ├── queryService.js
    │   │   └── hintService.js
    │   ├── styles/
    │   │   ├── _variables.scss
    │   │   ├── _mixins.scss
    │   │   ├── _reset.scss
    │   │   ├── components/
    │   │   │   ├── _navbar.scss
    │   │   │   ├── _assignment-list.scss
    │   │   │   ├── _attempt-page.scss
    │   │   │   └── _loader.scss
    │   │   └── main.scss
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── vite.config.js
```

---

## API Reference

### Assignments

```
GET /api/assignments
Response: { success, count, data: [{ id, title, description, difficulty }] }

GET /api/assignments/:id
Response: { success, data: { id, title, question, sampleTables, expectedOutput } }
```

### Query Execution

```
POST /api/query/execute
Body: { assignmentId, sqlQuery }
Response (success): { success: true, rows, rowCount, fields }
Response (error):   { success: false, error: "message" }
```

### Hints

```
POST /api/hint
Body: { assignmentId, sqlQuery? }
Response: { success: true, hint: "..." }
Rate limit: 10 requests per minute per IP
```

---

## Environment Variables

### Backend `.env`

```bash
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ciphersqlstudio

# PostgreSQL
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password
PG_DATABASE=ciphersqlstudio

# Groq LLM
GROQ_API_KEY=your_groq_api_key
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL v14+ (local) or any cloud PostgreSQL
- MongoDB Atlas account (free tier works)
- Groq API key — free at https://console.groq.com

### Backend Setup

```bash
# 1. Clone repository
git clone https://github.com/mayank1327/ciphersqlstudio.git
cd ciphersqlstudio/backend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Fill in your MongoDB URI, PostgreSQL credentials, Groq API key

# 4. Create PostgreSQL database
psql -U postgres
CREATE DATABASE ciphersqlstudio;
\q

# 5. Seed MongoDB with assignments
npm run seed

# 6. Start backend
npm run dev
# Server runs on http://localhost:3000
```

### Frontend Setup

```bash
cd ../frontend

# 1. Install dependencies
npm install

# 2. Start frontend
npm run dev
# App runs on http://localhost:5173
```

### Verify Setup

```
✅ http://localhost:3000/api/health    — Backend running
✅ http://localhost:3000/api/assignments — 4 assignments loaded
✅ http://localhost:5173               — Frontend running
```

---

## Key Technical Decisions

### Why Pool for PostgreSQL connection?

Creating a new PostgreSQL connection for every query is expensive. `pg.Pool` maintains a set of ready connections and reuses them. This is standard production practice for PostgreSQL with Node.js.

### Why store rows as flat objects in MongoDB?

```javascript
// This approach was chosen
rows: [
  { id: 1, name: "Alice", salary: 45000 }
]

// Instead of wrapping in data object
rows: [
  { data: { id: 1, name: "Alice", salary: 45000 } }
]
```

Flat objects are flexible across different table structures, allow direct `Object.keys()` and `Object.values()` for PostgreSQL INSERT, and render directly in the frontend without unwrapping. No unnecessary abstraction.

### Why Rate Limiting on Hint Route?

During development, Groq API quota was exhausted from repeated testing. Rate limiting (10 requests/minute/IP) prevents quota exhaustion in production and demonstrates awareness of real-world API cost management.

---

## Data Flow Diagram

*(Hand-drawn diagram — see `data-flow-diagram.jpg` in repository root)*

The diagram shows the complete flow when a student clicks **Execute Query**:

```
Student clicks Run
      ↓
React captures sqlQuery + assignmentId from state
      ↓
axios POST → /api/query/execute
      ↓
rateLimiter middleware (30 req/min)
      ↓
Joi validate middleware (assignmentId format, query length)
      ↓
queryController.executeQuery()
      ↓
assignmentService.getAssignmentById(assignmentId)
      ↓
MongoDB query → assignment.sampleTables returned
      ↓
queryService.executeQuery(sqlQuery, sampleTables)
      ↓
sanitizeQuery() → strip comments → block keywords → verify SELECT
      ↓
createSandbox() → CREATE SCHEMA sandbox_timestamp_random
      ↓
setupTables() → CREATE TABLE + INSERT rows from sampleTables
      ↓
SET search_path TO sandbox_schema
      ↓
pool.query(cleanQuery) → PostgreSQL executes
      ↓
Result rows returned
      ↓
dropSandbox() → DROP SCHEMA CASCADE (always runs — finally block)
      ↓
{ success, rows, rowCount, fields } → controller → response
      ↓
React state update → ResultsPanel re-renders with table
```

---

## Author

**Mayank Mehta**
- GitHub: [@mayank1327](https://github.com/mayank1327)
- Email: mayankmehta1327@gmail.com

---
*Built as part of CipherSchools MERN Stack Internship Assignment*