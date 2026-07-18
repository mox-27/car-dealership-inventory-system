# AI Tooling Chat History

The following is a reconstruction of the prompts sent to the Agentic AI Assistant during the development of the Car Dealership Inventory System.

### 1. Backend Initialization

**Prompt:**

> #### Backend Prompt — Car Dealership Inventory System

---

```
Build backend API for Car Dealership Inventory System using TDD (Red-Green-Refactor).

Stack: Node.js + Express (ES modules), MongoDB + Mongoose, JWT + bcrypt auth, Jest + Supertest tests (mongodb-memory-server for test isolation).

Endpoints:

Auth: POST /api/auth/register (name, email, password, role), POST /api/auth/login → JWT

Vehicles (JWT protected): CRUD (POST/GET/PUT/DELETE /api/vehicles), search (filter by make/model/category/price range)

Inventory: POST /api/vehicles/:id/purchase (decrement quantity, reject if 0), POST /api/vehicles/:id/restock (admin only)

Process:

Strict TDD: Write failing test → implement → refactor (separate commits)

Clean architecture: routes → controllers → services → models, centralized error handling

Commit after every step (test fail, test pass, refactor, config) with conventional commits + AI attribution

High test coverage including edge cases

Deliverables: backend/README.md (setup, AI usage placeholder), test coverage report, PROMPTS.md log

Order: DB/config → User model + auth (tests) → auth middleware → Vehicle model → CRUD → search → purchase/restock → README. Show tests → implementation → commit message at each step.
```

### 2. Frontend Initialization

**Prompt:**

> #### Frontend Prompt — Car Dealership Inventory System (Incubyte Assessment)

```
Build React SPA for Car Dealership Inventory System consuming backend API.

Tech: React (functional components + hooks), Tailwind CSS, fetch/axios for API, React Testing Library + Jest/Vitest.

Backend Integration:

Auth: Register/Login (JWT stored, protected routes with token)

Vehicles: List all, Search (make/model/category/price range), CRUD (admin-only)

Inventory: Purchase (disable when qty=0), Restock (admin-only)

Features:

Login/Register forms with validation & error states

Dashboard showing vehicle cards (make, model, category, price, qty)

Search/filter UI

Purchase button (disabled at 0 quantity)

Admin-only UI: Add/Edit/Delete/Restock forms

Process:

TDD for logic components (forms, purchase state, search, auth guards)

Clean structure: components/, pages/, hooks/, context/, services/

Commit after every step (scaffold, components+tests, pages, styling, integration)

Conventional commits + AI attribution

Deliverables: frontend/README.md (setup, API connection, screenshots placeholder), PROMPTS.md log

Order: Scaffold (Vite/CRA + Tailwind) → Auth context + Login/Register (tests) → Protected routes → Vehicle list/dashboard (tests) → Search/filter (tests) → Purchase flow (tests) → Admin forms (tests) → Styling polish. Show tests → implementation → commit at each step.
```

### 3. Seed Users

**Prompt:**

> Seed some sample data

### 4. Localization/Formatting

**Prompt:**

> use pricing in indian rupee format
