# Backend - Book Review Platform

## Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Run:
   ```
   npm run dev
   ```

APIs:
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/books?page=1&search=&genre=
- POST /api/books (auth)
- GET /api/books/:id
- PUT /api/books/:id (auth, owner)
- DELETE /api/books/:id (auth, owner)
- POST /api/reviews/:bookId (auth)
- PUT /api/reviews/:id (auth, owner)
- DELETE /api/reviews/:id (auth, owner)
