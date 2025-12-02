# PassThatClass

PassThatClass is a web-based study companion that turns your class notes into AI-generated quizzes and flashcards. It’s designed to help students study smarter by centralizing course content, extracting text from images/PDFs, and generating practice questions in seconds.

- **Backend Repository:** [PassThatClass Backend](https://github.com/DevParkerCS/PTC-Server)
- **Live Site: (In Progress)** [passthatclass.com]([PRODUCTION_SITE_URL](https://main.ddqp7bpjh9q19.amplifyapp.com/))

> _Replace the placeholder URLs above with your actual backend repo and deployment links._

---

## Overview

PassThatClass lets students:

- Create classes for each course
- Upload notes as text or images (e.g., lecture slides, handwritten notes, PDFs)
- Run OCR and AI to generate multiple-choice quizzes
- Turn quizzes into flashcards for spaced review
- Track basic usage stats and quiz performance

The goal is to provide a focused, opinionated workflow that gets students from “messy notes” to “targeted practice” with as little friction as possible.

---

## Tech Stack

**Frontend**

- **React** (TypeScript)
- **Vite** for fast dev bundling
- **SCSS Modules** for scoped styling
- **React Context** for global, normalized app state

**Backend & Services**

- **Node.js / Express** (separate repo)
- **Supabase** (Postgres + Auth)
- **OpenAI** (quiz generation)
- **Google Cloud Vision** (OCR for note images / PDFs)
- **Stripe** (subscription billing)

---

## Key Features

### 🎓 Class-Based Organization

- Create and manage **classes** (e.g., “CS 405 – Algorithms”).
- Each class acts as a container for:
  - Quizzes
  - Flashcard decks
- Dashboard view shows all classes with summary details.

### 📄 Note Uploads (Text + Images)

- Enter typed notes directly in a text area.
- Upload files (images / PDFs) of handwritten or printed notes.
- On the backend:
  - Images are resized and run through **Google Vision OCR**.
  - PDFs run through Vision’s PDF support (first few pages, configurable).
  - Extracted text is combined with typed notes up to a character budget.

### 🤖 AI-Generated Quizzes

- Generate **multiple-choice quizzes** from combined notes.
- Uses OpenAI (gpt-5-mini) with a structured prompt to produce:
  - Question text
  - Correct answer
  - Distractor options
  - Optional explanation
- Quizzes are stored in Postgres via Supabase with:
  - `quizzes` table (quiz metadata)
  - `quiz_questions` table (one row per question, JSONB options)

### 🧠 Flashcards from Quizzes

- Convert existing quizzes into flashcards.
- Flashcards can be used for quick review without calling the AI again.
- Designed to keep flashcards “cheap” (no extra model calls) by reusing generated content.

### 📊 Progress & Stats

- Track high-level stats per quiz and per class:
  - Number of questions
  - Last taken date
- UI is structured to support future expansion into:
  - Per-quiz accuracy
  - Aggregated performance by class/topic

### 💳 Pricing Model (Frontend UX)

- **Basic (Free)**
  - 7 one-time AI quiz generations from notes
  - Up to 5,000 characters of notes per quiz
  - 1 image per quiz
  - Access to class/quiz UI and basic stats
- **Pro**
  - ~$5–6 / month (configurable in Stripe)
  - Everything in Basic
  - Up to 100 AI quiz generations per month
  - Up to 20,000 characters of notes per quiz
  - Up to 5 images per quiz

The frontend surfaces plan limits and communicates when the user is close to or out of generations.

---

## Architecture & Data Flow

1. **User selects a class** and opens “New Quiz.”
2. **User inputs notes** (text + images/PDF).
3. Frontend sends a `multipart/form-data` request to the backend `/quiz/from-notes` endpoint:
   - `notesText`
   - `images[]`
   - Metadata (grade level, numQuestions, classId, etc.)
4. Backend pipeline:
   - Runs OCR on images/PDFs (Google Vision).
   - Combines typed + OCR text with a character cap.
   - Calls OpenAI to generate quiz JSON.
   - Inserts quiz + questions into Supabase.
   - Streams progress updates back to the client (`ocr_started`, `ocr_done`, `quiz_started`, `quiz_done`).
5. Frontend listens to the streaming response and:
   - Shows a loading/progress state.
   - Updates UI when the final quiz payload arrives.
   - Pushes the new quiz into the global `DataContext` so views stay in sync.

---

## Frontend State Management

The app uses a centralized **DataContext** to normalize client-side state:

- **Entities:** classes, quizzes, questions, content summaries
- **Patterns:**
  - Normalized `byId` maps and ID arrays
  - Cached data reused between views (dashboard, class detail, quiz view)
  - Minimizes redundant API calls and improves perceived performance

This makes it straightforward to keep the UI consistent when a quiz is created, updated, or deleted.

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- Yarn or npm
- A running backend instance of PassThatClass (see backend repo)
- Environment variables for:
  - API base URL
  - Supabase keys (if needed on frontend)
  - Stripe public key (for billing UI, if integrated)

### Installation

```bash
# Clone the frontend repo
git clone <FRONTEND_REPO_URL>
cd passthatclass-frontend

# Install dependencies
yarn install
```
