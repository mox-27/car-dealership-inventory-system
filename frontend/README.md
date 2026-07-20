# AutoVerse Dealership - Frontend SPA

This is the React frontend for the AutoVerse Car Dealership Inventory System. It was built using Vite, React (Functional Components + Hooks), Tailwind CSS v4, and React Testing Library + Vitest.

## Prerequisites

- Node.js (v18 or higher recommended)
- The [Backend API](../backend/README.md) must be running.

## Getting Started

1. **Install Dependencies**

   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**
   The frontend expects to communicate with the backend on `/api`. In development, Vite is configured to proxy API requests to the backend server (typically `http://localhost:3000`). If your backend is hosted elsewhere, you can set the `VITE_API_URL` environment variable or adjust the proxy in `vite.config.js`.

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Running Tests

This project follows a Test-Driven Development (TDD) approach using Vitest and React Testing Library.

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Features

- **Public**: Browse inventory, search by make/model, filter by category and price.
- **Authentication**: JWT-based login and registration.
- **Customers**: Purchase vehicles (decrements stock).
- **Admins**: Add, edit, delete, and restock vehicles.
