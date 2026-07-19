# PROMPTS.md

# AI Tooling Chat History

This document records the prompts used with the AI assistant during the development of the **Car Dealership Inventory System**.

---

# 1. Backend Initialization

## Prompt

### Backend Prompt — Car Dealership Inventory System

```text
Build backend API for Car Dealership Inventory System using TDD (Red-Green-Refactor).

Stack:
- Node.js
- Express (ES Modules)
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Jest + Supertest
- mongodb-memory-server for isolated tests

Endpoints

Authentication
- POST /api/auth/register
  - name
  - email
  - password
  - role

- POST /api/auth/login
  - Returns JWT

Vehicles (JWT Protected)
- POST /api/vehicles
- GET /api/vehicles
- PUT /api/vehicles/:id
- DELETE /api/vehicles/:id

Search
- Filter by:
  - make
  - model
  - category
  - price range

Inventory
- POST /api/vehicles/:id/purchase
  - Decrement quantity
  - Reject if quantity is 0

- POST /api/vehicles/:id/restock
  - Admin only

Development Process

- Follow strict TDD:
  - Write failing test
  - Implement
  - Refactor
- Separate commits for each TDD stage
- Clean Architecture:
  - routes
  - controllers
  - services
  - models
- Centralized error handling
- High test coverage including edge cases

Commit Requirements

- Commit after:
  - failing tests
  - passing tests
  - refactoring
  - configuration
- Use Conventional Commits
- Include AI attribution

Deliverables

- backend/README.md
  - Setup instructions
  - AI usage placeholder
- Test coverage report
- PROMPTS.md

Implementation Order

1. Database & configuration
2. User model + Authentication
3. Authentication middleware
4. Vehicle model
5. Vehicle CRUD
6. Search
7. Purchase & Restock
8. README

Show:
- Tests
- Implementation
- Commit message
after each step.
```

---

# 2. Frontend Initialization

## Prompt

### Frontend Prompt — Car Dealership Inventory System (Incubyte Assessment)

```text
Build a React SPA for the Car Dealership Inventory System consuming the backend API.

Tech Stack

- React (Functional Components + Hooks)
- Tailwind CSS
- Axios or Fetch
- React Testing Library
- Jest/Vitest

Backend Integration

Authentication
- Register
- Login
- Store JWT
- Protected routes

Vehicles
- List vehicles
- Search
- CRUD (Admin only)

Inventory
- Purchase
- Disable purchase when quantity is 0
- Restock (Admin only)

Features

- Login form
- Register form
- Form validation
- Error states

Dashboard
- Vehicle cards
- Make
- Model
- Category
- Price
- Quantity

Search & Filtering

Purchase flow

Admin Features
- Add vehicle
- Edit vehicle
- Delete vehicle
- Restock inventory

Development Process

- Follow TDD for:
  - Forms
  - Purchase logic
  - Search
  - Auth guards

Project Structure

- components/
- pages/
- hooks/
- context/
- services/

Commit Requirements

- Scaffold
- Components + Tests
- Pages
- Styling
- Integration

Use:
- Conventional Commits
- AI attribution

Deliverables

- frontend/README.md
  - Setup
  - API configuration
  - Screenshot placeholders
- PROMPTS.md

Implementation Order

1. React scaffold (Vite/CRA + Tailwind)
2. Auth Context
3. Login & Register
4. Protected Routes
5. Dashboard
6. Search & Filter
7. Purchase Flow
8. Admin Forms
9. Styling polish

Show:
- Tests
- Implementation
- Commit message
after every step.
```

---

# 3. Seed Data

## Prompt

```text
Seed some sample data.
```

---

# 4. Localization

## Prompt

```text
Use pricing in Indian Rupee (INR) format.
```

---

# 5. UX Improvements

## Prompts

### Restock Modal

```text
On the Handle Restock button click, instead of using window.prompt, display a modal to improve the user experience.
```

### Edit Vehicle Modal

```text
Instead of showing the edit form at the top of the page and requiring users to scroll up, display the edit form inside a modal similar to the restock flow.
```

### Toast Notifications

```text
Add React Hot Toast wherever messages currently cause layout shifts or page movement.
```

---

# 6. Design System Overhaul

## Prompt

```text
You are the design lead refactoring an existing car dealership inventory app called AutoVerse.

The current UI resembles a generic AI-generated admin dashboard with:
- Indigo/Violet gradients
- White rounded cards
- Colored top borders
- Pill badges
- Purple primary buttons

Create a distinctive visual identity that cannot be mistaken for a template.

Refactor every screen:
- Home
- Login
- Register
- Dashboard
- Inventory
- Add/Edit Vehicle Modal
- Navbar
- Footer
- Buttons
- Inputs
- Badges
- Empty states

Use one consistent design system.

Design Direction

Dealer Spec Sheet

Ground the identity in real dealership aesthetics:
- Monroney window stickers
- Stamped paperwork
- Clipboards
- Industrial shelving
- High-contrast signage
```

---

# 7. Layout & Theming

## Prompts

### Sidebar Filters

```text
Move the filters into a sidebar instead of displaying them inline.
```

### Theme Support

```text
Add Light and Dark mode theme selection.
```

### Scrollable Layout

```text
Make only the vehicle cards section scrollable while keeping the rest of the page fixed.
```

### Delete Confirmation

```text
Replace the window.confirm delete prompt with a proper confirmation modal.
```

### Grid/List View

```text
Add functionality to switch between Grid and List views for vehicle cards.
```

---

# 8. Feature Enhancements

## Bulk Import

```text
Add bulk import functionality supporting both CSV and JSON.

If a vehicle already exists, skip it and continue importing the remaining records.
```

---

## Public Home Page

```text
Add a Home page that is accessible even when users are not logged in.
```

---

## Low Stock Warning

```text
Add a low stock warning feature.
```

---

## Shopping Cart

```text
Implement a shopping cart using localStorage to persist selected vehicles.
```

---

## Admin Dashboard Analytics

```text
Display statistical graphs in the Admin dashboard to improve the user experience.
```
