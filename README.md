# FinalProject-341

CSE 341 Final Project — **Library API** (Node.js, Express, MongoDB, GitHub OAuth).

## Collections
| Collection | Fields |
|---|---|
| `authors` | firstName, lastName, birthDate, nationality, email (optional) |
| `books` | title, authorId (→ authors), isbn, genre, publishedYear, pages, publisher, available |
| `members` | firstName, lastName, email, phone, membershipType (standard/premium/student), joinDate |
| `loans` | bookId (→ books), memberId (→ members), loanDate, dueDate, returned, notes |

Each collection has full CRUD: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.

## Authentication (GitHub OAuth)
- `GET` requests are public.
- `POST`, `PUT`, `DELETE` on **all four collections** require login → otherwise `401`.
- `/login` → GitHub login, `/logout`, `/auth/status` → shows if you're logged in.

## Validation & error handling
- `400` — invalid ObjectId, failed validation on POST/PUT (all four collections), malformed JSON, or a reference (authorId / bookId / memberId) that doesn't exist
- `401` — not logged in
- `404` — record or route not found
- `409` — duplicate ISBN or member email; deleting an author with books, a book on loan, or a member with unreturned loans
- `500` — unexpected server/database errors (every controller uses try/catch → central error handler)

## Tests
`npm test` runs Jest + Supertest tests for the GET endpoints of all four collections
(5 tests each: list, get by id, 404, invalid id 400, database error 500). The database is mocked, so tests don't touch Atlas.

## Run locally
```bash
npm install
cp .env.example .env   # fill in MongoDB + GitHub OAuth values
npm run dev
```
Open http://localhost:3000/api-docs

## Deploy to Render
- Build: `npm install` · Start: `npm start`
- Env vars: `MONGODB_URI`, `DB_NAME`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `CALLBACK_URL` (`https://<app>.onrender.com/github/callback`), `SESSION_SECRET`

## Team contributions
| Week | Team member | Contribution 1 | Contribution 2 |
|---|---|---|---|
| 5 | Rony | | |
| 6 | Rony | | |
