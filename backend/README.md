# Car Dealership Inventory System - Backend

This is the backend API for a Car Dealership Inventory System. It is built using Node.js, Express.js, and MongoDB (via Mongoose), implementing a robust Test-Driven Development (TDD) approach.

## Features

- **Authentication:** JWT-based user registration and login, with role-based access control (user vs. admin).
- **Vehicle Management:** Full CRUD operations for vehicles in the inventory.
- **Search & Filtering:** Dynamic search functionality to filter vehicles by make, model, category, and price range.
- **Inventory Control:** Endpoints for purchasing vehicles (decrementing stock) and restocking (admin only).
- **Test-Driven:** Developed following strict Red-Green-Refactor cycles with over 90% code coverage.

## Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- Local MongoDB instance running on `localhost:27017` (or a MongoDB Atlas URI)

### 1. Install Dependencies
Navigate to the `backend` directory and run:
```bash
npm install
```

### 2. Environment Variables
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains the following:
```env
MONGODB_URI=mongodb://localhost:27017/car-dealership
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

### 3. Running the Server
To start the server in development mode (with hot-reloading):
```bash
npm run dev
```
To start the server in production mode:
```bash
npm start
```

### 4. Running Tests
The project uses Jest and Supertest, along with `mongodb-memory-server` for isolated, in-memory database testing. No real MongoDB instance is required to run the tests.

To run the test suite:
```bash
npm test
```

To run tests and generate a coverage report:
```bash
npm run test:coverage
```

## Test Coverage Report

```text
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |   93.75 |    84.74 |   93.33 |   95.13 |                   
 src                   |      75 |       50 |      75 |   78.94 |                   
  app.js               |      75 |       50 |      75 |   78.94 | 34-35,40-41       
 src/controllers       |     100 |      100 |     100 |     100 |                   
  authController.js    |     100 |      100 |     100 |     100 |                   
  vehicleController.js |     100 |      100 |     100 |     100 |                   
 src/middleware        |     100 |      100 |     100 |     100 |                   
  auth.js              |     100 |      100 |     100 |     100 |                   
 src/models            |    90.9 |       50 |     100 |     100 |                   
  User.js              |   88.88 |       50 |     100 |     100 | 37                
  Vehicle.js           |     100 |      100 |     100 |     100 |                   
 src/routes            |     100 |      100 |     100 |     100 |                   
  authRoutes.js        |     100 |      100 |     100 |     100 |                   
  vehicleRoutes.js     |     100 |      100 |     100 |     100 |                   
 src/services          |   93.54 |    90.24 |      90 |   94.31 |                   
  authService.js       |     100 |      100 |     100 |     100 |                   
  vehicleService.js    |   90.76 |    85.71 |    87.5 |   91.66 | 50-51,86-88       
 tests                 |     100 |      100 |     100 |     100 |                   
  setup.js             |     100 |      100 |     100 |     100 |                   
-----------------------|---------|----------|---------|---------|-------------------
```

## My AI Usage

_To be filled in manually._
