# MindFlare — AI-Powered Career Engine & Adaptive Mock Interview Platform

MindFlare is a personalized mock interview platform and career mentor. Candidates can upload their resumes, run simulated mock interviews matching specific categories and difficulty levels, get real-time scores with feedback, and discuss study strategies with a contextualized AI Coach. 

MindFlare uses a decoupled architecture with a React single-page frontend, a Node.js Express backend acting as the application controller, and a Python FastAPI service handling document processing, vector search, and LLM integrations.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Folder Structure](#folder-structure)
3. [Implemented Features](#implemented-features)
4. [Database Systems & Data Storage](#database-systems--data-storage)
5. [API Endpoints Reference](#api-endpoints-reference)
6. [Environment Variables](#environment-variables)
7. [Local Installation & Setup](#local-installation--setup)
8. [Core Workflows & AI Integration](#core-workflows--ai-integration)
9. [Production Deployment](#production-deployment)
10. [Troubleshooting & Gotchas](#troubleshooting--gotchas)

---

## System Architecture

The project consists of three decoupled services communicating over REST:

```text
       React Frontend (Vercel)
                  │
                  ▼ (Axios HTTP API calls / Cookies)
       Node/Express Backend (Render) ◄───► MongoDB Atlas (System of Record)
                  │
                  ▼ (JSON REST queries)
       FastAPI AI Service (Render) ◄─────► Chroma DB (Local Vector Storage)
                  │
            ┌─────┴────────┐
            ▼              ▼
     Google Gemini      Groq AI
  (Interviews & RAG) (AI Career Coach)
```

---

## Folder Structure

```text
Interview_platform/
├── AI/                           # Python FastAPI AI Service
│   ├── api/                      # Routing and Schemas
│   │   ├── coach_routes.py       # AI Coach Endpoint
│   │   ├── routes.py             # Resume & Mock Interview Endpoints
│   │   └── schemas.py            # Pydantic input schemas
│   ├── embeddings/               # Embedding configurations
│   │   └── upsate_embedding.py   # UpstageEmbeddings client (embedding-query)
│   ├── interview/                # Session managers and state configs
│   │   ├── adaptive_question.py  # Adaptive question generator helper
│   │   ├── evaluator.py          # Real-time answer scoring and validation
│   │   ├── final_report.py       # Console report generator
│   │   ├── interview_manager.py  # (Outdated wrapper, kept for reference)
│   │   ├── interview_state.py    # (Outdated schema helper)
│   │   └── session_manager.py    # Active python session state manager
│   ├── llm/                      # Gemini LLM initialization
│   │   ├── gemini_client.py      # ChatGoogleGenerativeAI client (gemini-3.5-flash-lite)
│   │   ├── prompts.py            # System prompts for interviews and evaluation
│   │   └── question_generator.py # Context retrieval query builder
│   ├── loaders/                  # File loaders
│   │   └── resume_loader.py      # UpstageDocumentParseLoader for PDF/DOCX
│   ├── processing/               # Text clean/split tools
│   │   ├── text_cleaner.py       # BS4-based text cleaning
│   │   └── text_splitter.py      # RecursiveCharacterTextSplitter (500 chunk size)
│   ├── services/                 # Business logic interfaces
│   │   ├── coach_service.py      # AI Coach logic (Groq / Gemini fallback)
│   │   └── rag_service.py        # Resume parsing & Chroma index orchestrator
│   ├── vectorStore/              # Chroma DB read/write APIs
│   │   ├── build_chroma.py       # Scripted Chroma indexer
│   │   ├── chroma_store.py       # Vector store instantiator
│   │   └── retrieval.py          # Vector query wrapper
│   ├── chroma_db/                # Local SQLite-backed Chroma DB storage folder
│   ├── main.py                   # FastAPI service runner
│   └── requirements.txt          # Python dependencies list
│
├── backend/                      # Node.js Express Application
│   ├── src/
│   │   ├── config/               # Platform configurations
│   │   │   └── firebase_admin.js # Firebase Admin SDK initialization
│   │   ├── controllers/          # Business logic handlers
│   │   │   ├── auth.controller.js     # Signup, Signin, Google OAuth, and Logout
│   │   │   ├── coachController.js     # AI Coach request router
│   │   │   ├── interview.controller.js# Mock Interview manager & scoring compiler
│   │   │   ├── payment_controller.js  # Razorpay order creator & signature verifier
│   │   │   └── resume.controller.js   # Resume upload, save, and delete coordinator
│   │   ├── db/                   # MongoDB connector
│   │   │   └── index.js          # Mongoose db connection initializer
│   │   ├── middlewares/          # Filter pipelines
│   │   │   ├── authMiddleware.js      # JWT verify hook
│   │   │   ├── proMiddleware.js       # Subscription verification hook (requirePro)
│   │   │   └── uploadMiddleware.js    # Multer disk/memory storage config
│   │   ├── models/               # MongoDB models
│   │   │   ├── interview.js           # Interview session model
│   │   │   ├── payment.js             # Payment transactions log
│   │   │   ├── questionAnswer.js      # Individual Q&A scorecard model
│   │   │   ├── resume.js              # Resume mapping & analysis model
│   │   │   └── user.js                # User identity and subscription plan model
│   │   ├── payment/              # Payment integrations
│   │   │   └── payment.js             # Razorpay client instance
│   │   ├── routes/               # Public API endpoint routers
│   │   │   ├── coach.routes.js        # AI Coach router
│   │   │   ├── interview.routes.js    # Mock Interview router
│   │   │   ├── payment_route.js       # Razorpay payment router
│   │   │   ├── resume.routes.js       # Resume upload/delete router
│   │   │   ├── subscription.routes.js # Subscription checks router
│   │   │   └── user.routes.js         # Register, login, google signin router
│   │   ├── services/             # Dynamic context generators
│   │   │   └── coachContextService.js # Compiles scorecard history for the coach
│   │   ├── app.js                # Express app middleware and CORS setup
│   │   └── constants.js          # Global app-wide constant strings
│   ├── index.js                  # Node server main boot file
│   └── package.json              # Node dependencies
│
└── frontend/                     # React Single Page App
    ├── src/
    │   ├── components/           # Reusable widgets (Sidebar, Topbar, QuestionSpeaker, VoiceRecorder, Charts)
    │   ├── context/              # Global state managers (AuthContext, SubscriptionContext)
    │   ├── data/                 # Constant navigation & page layout configs
    │   ├── pages/                # Screens (Dashboard, Resume, Interview Setup, Interview Room, Analytics, Coach)
    │   ├── services/             # Centralized API service configuration
    │   │   └── api.js            # Axios client with credentials support
    │   ├── firebase.js           # Firebase Auth client initialization
    │   ├── styles.css            # Responsive layout and viewport override styles
    │   └── main.jsx              # Vite entry bootstrapper
    ├── vercel.json               # Vercel SPA routing file
    └── package.json              # Frontend packages
```

---

## Implemented Features

### 1. Identity & Session Security
*   **Authentication Options**: Custom Email/Password signup/signin + Google Sign-In using Firebase OAuth.
*   **JWT Token Routing**: Secure JWT access and refresh tokens. Set as HTTP-Only, Secure, SameSite cookies on login and cleared on logout.
*   **Cookie Security**: Access and refresh tokens are configured dynamically: `secure: true` and `sameSite: "none"` in production, and `secure: false` and `sameSite: "lax"` in development.
*   **CORS Safeguards**: REST API restricted to whitelisted origins (`http://localhost:5173` and `https://interview-plateform-three.vercel.app`).

### 2. Resume Indexing & Vector Search (RAG)
*   **Upstage Layout Parsing**: Uploaded PDF/DOCX resumes are parsed, cleaned, and split into 500-character segments.
*   **Chroma DB Storage**: Document segments are vectorized using Upstage's `embedding-query` models and indexed into individual local Chroma collections.
*   **MongoDB Metadata Sync**: Resume summaries (extracted skills, projects, recent roles) are saved in MongoDB alongside the unique Chroma collection ID.
*   **Selection & Deletion**: Candidates can upload multiple resumes, select which one to use for active interviews, and delete resumes from their profile.

### 3. Adaptive Mock Interviews
*   **Flexible Setup**: Set up sessions by category (e.g. Technical, Behavioral), difficulty level (Beginner, Intermediate, Advanced), interviewer style (Friendly, Professional, Technical, Stress Mode), and duration (15 min/5 Qs, 30 min/8 Qs, 45 min/12 Qs).
*   **Context-Grounded Q&A**: Employs semantic similarity search (MMR) over Chroma DB to retrieve resume details, ensuring questions match actual candidate history.
*   **Real-Time Grading**: Every answer is scored (0-10) with detailed correct points, missing concepts, and improvement suggestions returned by Gemini.
*   **Dynamic Difficulty Scaling**: Automatically scales difficulty for the next question based on the score of the previous answer:
    *   *Score <= 3*: Drop difficulty to **Easy** (or follow-up clarification).
    *   *Score 4 - 6*: Set to **Medium** difficulty.
    *   *Score 7 - 8*: Set to **Hard** difficulty.
    *   *Score > 8*: Escalate to **Advanced** difficulty.
*   **Performance Dashboard**: Renders interactive score trend lines, average score breakdowns, radar charts mapping strengths, and full scorecard history.

### 4. AI Career Coach
*   **Personalization**: Reviews candidate’s stored resume profiles and entire mock interview histories.
*   **Dynamic Strengths & Weaknesses**: Computes topics where average score >= 7.5 (Strengths) and topics where average score <= 5.5 (Weaknesses), and sends them to the model context.
*   **Study Roadmaps & Guidance**: Generates personalized advice, study plans, and DSA tips based on weaknesses.

### 5. Pro Membership Subscription
*   **Razorpay Gateway**: Integration for standard subscription updates.
*   **Payment Signatures**: Compares order hashes using server-side HMAC-SHA256 crypto signatures.
*   **Secure API Guard**: Premium features (AI Coach conversations) are protected using the `requirePro` backend middleware. *Note: Frontend state checks are for UI convenience only; API authorization is enforced strictly on the server.*

---

## Database Systems & Data Storage

MindFlare isolates standard application metadata from high-dimensional vector embeddings:

| Feature | MongoDB Atlas (System of Record) | Chroma DB (Vector Database) |
| :--- | :--- | :--- |
| **Storage Location** | Cloud-hosted MongoDB Cluster | Local directory (`AI/chroma_db/`) |
| **Data Models** | `User` (identity, Pro plan status), `Resume` (JSON analysis summary, name, Chroma collection ID pointer), `Interview` (session parameters, category, overall score), `QuestionAnswer` (individual questions, answers, score, topics, LLM feedback), `Payment` (Razorpay order logs) | Segmented paragraphs of text, Upstage float vector representations |
| **Interacting Service** | Node.js Express server using Mongoose | Python FastAPI service using LangChain Chroma API |
| **Lifespan on Delete** | Deleting a resume removes the MongoDB document reference immediately | Deleting a resume **does not** trigger a python delete script; vector chunks remain in `chroma_db/` |

---

## API Endpoints Reference

### 1. Public API (React client -> Node Backend)

#### Auth & Identity
*   `POST /api/auth/register` (Public) : Creates standard user credentials.
*   `POST /api/auth/login` (Public) : Authenticates credentials, generates JWTs, and sets cookies.
*   `POST /api/auth/google` (Public) : Accepts a Firebase ID token, validates it via Admin SDK, and establishes cookies.
*   `POST /api/auth/logout` (Auth Required) : Clears cookies and revokes JWTs.
*   `GET /api/auth/me` (Auth Required) : Returns the current user profile and subscription metadata.

#### Resumes
*   `POST /api/resume/upload` (Auth Required) : Accepts multipart form file upload (`file`), forwards to FastAPI, and saves metadata to MongoDB.
*   `GET /api/resume/` (Auth Required) : Returns all uploaded resumes for the user.
*   `DELETE /api/resume/:resumeId` (Auth Required) : Deletes the MongoDB resume reference.

#### Mock Interviews
*   `POST /api/interview/start` (Auth Required) : Validates inputs and triggers python session initialization.
*   `POST /api/interview/:interviewId/answer` (Auth Required) : Evaluates candidate's response and returns the next question.
*   `GET /api/interview/:interviewId/report` (Auth Required) : Fetches score card and evaluation items.
*   `GET /api/interview/history` (Auth Required) : Lists completed mock sessions.
*   `GET /api/interview/analytics` (Auth Required) : Compiles score trends, category averages, and stats for the charts.

#### AI Coach & Billing
*   `POST /api/coach/chat` (Auth + Pro Required) : Conversational route with the career coach.
*   `GET /api/coach/context` (Auth Required) : Pulls current candidate's performance statistics.
*   `POST /api/payment/create-order` (Public) : Generates a Razorpay order ID.
*   `POST /api/payment/verify-payment` (Auth Required) : Verifies Razorpay signatures and updates Pro membership.
*   `GET /api/subscription/me` (Auth Required) : Returns Pro plan duration and status.

### 2. Internal API (Node Backend -> Python FastAPI only)
*   `POST /api/interview/process-resume` : Parses layout, chunks text, embeddings generate, and saves to Chroma DB.
*   `POST /api/interview/start` : Runs MMR search to pull context, generates initial questions list, and starts session.
*   `POST /api/interview/answer` : Grades response, updates dynamic difficulty, and returns next question.
*   `POST /api/coach/chat` : Processes coach guidance prompt using compiled database context.

---

## Environment Variables

### Frontend Variables
*   **`.env.local`** (Local development overrides):
    ```env
    VITE_API_URL=http://localhost:5000
    VITE_AI_URL=http://localhost:8000
    ```
*   **`.env.production`** (Production overrides):
    ```env
    VITE_API_URL=https://your-backend.onrender.com
    VITE_AI_URL=https://your-ai-service.onrender.com
    ```
*   **`.env`** (Public credentials):
    ```env
    VITE_FIREBASE_API_KEY=<YOUR_VALUE>
    VITE_FIREBASE_AUTH_DOMAIN=mindflare-5b3af.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=mindflare-5b3af
    VITE_FIREBASE_STORAGE_BUCKET=mindflare-5b3af.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=<YOUR_VALUE>
    VITE_FIREBASE_APP_ID=<YOUR_VALUE>
    VITE_FIREBASE_MEASUREMENT_ID=<YOUR_VALUE>
    VITE_PRO_PLAN_AMOUNT=499
    ```

### Node Backend Variables (`backend/.env`)
```env
PORT=5000
NODE_ENV=development # or production
MONGODB_URI=mongodb+srv://<YOUR_VALUE>
ACCESS_TOKEN_SECRET=<YOUR_VALUE>
REFRESH_TOKEN_SECRET=<YOUR_VALUE>
ACCESS_TOKEN_EXPIRY=3hr
REFRESH_TOKEN_EXPIRY=7d
AI_SERVICE_URL=http://localhost:8000 # or production render URL
CORS_ORIGIN=http://localhost:5173
RAZORPAY_KEY_ID=<YOUR_VALUE>
RAZORPAY_KEY_SECRET=<YOUR_VALUE>
FIREBASE_PROJECT_ID=mindflare-5b3af
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@mindflare-5b3af.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...<YOUR_VALUE>...\n-----END PRIVATE KEY-----\n"
```

### Python AI Service Variables (`AI/.env`)
```env
PORT=8000
UPSTAGE_API_KEY=up_...<YOUR_VALUE>...
GOOGLE_API_KEY=AIzaSy...<YOUR_VALUE>... # Gemini API key used by ChatGoogleGenerativeAI
GEMINI_API_KEY=AQ.Ab...<YOUR_VALUE>...  # Gemini API key fallback used by Coach
GROQ_API_KEY=gsk_...<YOUR_VALUE>...     # Groq API key for ChatGroq
GROQ_COACH_MODEL=openai/gpt-oss-120b    # Groq Coach LLM model override
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://interview-plateform-three.vercel.app
```

---

## Local Installation & Setup

### 1. FastAPI AI Service
1. Navigate to the AI folder:
   ```bash
   cd AI
   ```
2. Set up a virtual environment and activate:
   *   **Windows**:
       ```bash
       python -m venv venv
       .\venv\Scripts\activate
       ```
   *   **macOS/Linux**:
       ```bash
       python3 -m venv venv
       source venv/bin/activate
       ```
3. Install package requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Node Backend Server
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Boot up the Express controller (uses nodemon):
   ```bash
   npm run dev
   ```

### 3. React Frontend client
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install npm modules:
   ```bash
   npm install
   ```
3. Start the Vite client:
   ```bash
   npm run dev
   ```

*You can access the frontend dashboard at `http://localhost:5173`.*

---

## Core Workflows & AI Integration

### 1. Document Parsing & Text Vectorization
1.  **Extraction**: Multer intercepts files on the Node backend, forwarding them as a stream to FastAPI's `/api/interview/process-resume`.
2.  **Layout parsing**: `UpstageDocumentParseLoader(split="page")` extracts text and layouts.
3.  **Splitting**: Documents are cleaned and split into chunks of 500 characters with 50 character overlap via `RecursiveCharacterTextSplitter`.
4.  **Embedding**: Text chunks are vectorized using Upstage's `embedding-query` model.
5.  **Index Database**: Chroma inserts chunks and indices into a local collection (`resume_{id}`).
6.  **Metadata Summary**: Gemini (`gemini-3.5-flash-lite`) compiles a structured JSON analysis (skills, projects, role history) that Node saves to MongoDB.

### 2. Mock Interview Lifecycle
```mermaid
sequenceDiagram
    participant React as React Client
    participant Node as Node Server
    participant DB as MongoDB
    participant Python as Python AI Service
    participant Gemini as Google Gemini API

    React->>Node: POST /api/interview/start {resumeId, category, difficulty, style, duration}
    Node->>DB: Find selected resume metadata
    Node->>Python: POST /api/interview/start {collection_id, category, difficulty, style, duration}
    Python->>Python: Run MMR search in Chroma collection
    Python->>Gemini: Request initial mock questions (grounded in MMR context)
    Gemini-->>Python: List of questions
    Python->>Python: Save session questions to in-memory sessions dictionary
    Python-->>Node: Return first question & session_id
    Node->>DB: Save new Interview document
    Node-->>React: Return question & interview ID
    
    loop For each question
        React->>Node: POST /api/interview/:id/answer {answer}
        Node->>Python: POST /api/interview/answer {session_id, answer}
        Python->>Gemini: Evaluate answer against question & MMR context
        Gemini-->>Python: Return JSON score (0-10) and feedback
        Python->>Python: Adjust next question difficulty based on score
        alt Session is not complete
            Python->>Gemini: Request next question (using new difficulty & style)
            Gemini-->>Python: Return question text
            Python-->>Node: Return evaluation report & next question
        else Session is complete
            Python->>Python: Generate final report summary
            Python-->>Node: Return evaluation report & complete status
        end
        Node->>DB: Save Q&A document & update Interview score averages
        Node-->>React: Return evaluation & next question (or completed status)
    end
```

### 3. Contextual AI Coaching
1.  Candidate posts a chat message to `POST /api/coach/chat`.
2.  The `getCoachContext` service retrieves:
    *   Candidate's latest `Resume` metadata summary.
    *   Up to 10 completed mock interview records from the database.
    *   Scores and topic breakdowns (averages score >= 7.5 are marked as Strengths, average score <= 5.5 are marked as Weaknesses).
    *   A list of missing concepts extracted from historical `QuestionAnswer` evaluations.
3.  The backend forwards this context payload to FastAPI's `/api/coach/chat`.
4.  The AI service constructs a detailed prompt feeding this context to Groq (fallback to Gemini).
5.  The model generates concise, personalized advice (limited to 5-12 lines for standard questions, max 20 lines).

---

## Production Deployment

### 1. Frontend to Vercel
*   **Root Directory**: Set root to `frontend`.
*   **Build command**: `npm run build`
*   **Output directory**: `dist`
*   **SPA Routing config**: Keep `vercel.json` in the frontend root to prevent `404 Not Found` errors when refreshing routes:
    ```json
    {
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```

### 2. Backend to Render
*   **Root Directory**: `backend`
*   **Build command**: `npm install`
*   **Start command**: `node index.js` (or `npm start`)
*   **Environment variables**: Make sure `NODE_ENV` is set to `production` so access and refresh cookies are configured securely.

### 3. AI Service to Render
*   **Root Directory**: `AI`
*   **Build command**: `pip install -r requirements.txt`
*   **Start command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
*   *Critical Warning:* Render services have ephemeral file systems, meaning the local `AI/chroma_db/` SQLite storage folder will be erased whenever the container restarts. To persist vector collections, you must:
    1. Attach a **Render Persistent Disk** to the AI Service web instance.
    2. Mount the disk path (e.g. `/data`) and adjust the `CHROMA_PATH` inside `AI/vectorStore/chroma_store.py` to point to the mounted persistent path.

---

## Troubleshooting & Gotchas

### 1. Page Refresh Causes 404 on Vercel
*   **Reason**: Vercel tries to resolve browser routes directly instead of routing them to `index.html` (single-page React app routing).
*   **Fix**: Confirm `vercel.json` exists in `frontend/` containing the `rewrites` configuration matching the build root.

### 2. Firebase authorized domains redirects block login
*   **Reason**: Google OAuth redirects fail if the production domain is not whitelisted.
*   **Fix**: Add your production Vercel frontend URL (`https://interview-plateform-three.vercel.app`) to the **Authorized Domains** list inside your Firebase Authentication Console dashboard settings.

### 3. AI Coach chat fails with `gsk_placeholder_key` errors
*   **Reason**: Groq is set as default but the key has placeholder values.
*   **Fix**: The AI Service automatically falls back to Gemini (`gemini-1.5-flash`) using `GEMINI_API_KEY` when `GROQ_API_KEY` is missing or contains the placeholder string. Ensure `GEMINI_API_KEY` is correctly defined in the AI service `.env`.

### 4. CORS Blocks Cookie Authentication
*   **Reason**: Express uses `credentials: true` for HTTP-only cookies, requiring exact origin matches.
*   **Fix**: Do not use `allow_origins=["*"]` on backend configurations. Ensure origins in `backend/src/app.js` and `CORS_ALLOWED_ORIGINS` in your FastAPI `.env` match your client URLs exactly.

### 5. Vector collection storage limits
*   **Reason**: Deleting a resume removes references from MongoDB, but python's local SQLite Chroma database still retains the collection.
*   **Fix**: Currently, you must clean up vector collections manually or implement a `/delete-collection` endpoint in python to manage disk limits.
