# FinalProject-341

CSE 341 Final Project — **Library API** (Node.js, Express, MongoDB).

## Collections
| Collection | Fields |
|---|---|
| `authors` | firstName, lastName, birthDate, nationality, email (optional) |
| `books` | title, authorId (→ authors), isbn, genre, publishedYear, pages, publisher, available |

Each collection has full CRUD: `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`.

## Error handling & validation
- `400` — invalid ObjectId, failed field validation (express-validator returns every failing field), malformed JSON, or a book whose `authorId` doesn't exist
- `404` — record or route not found
- `409` — duplicate ISBN, or deleting an author who still has books
- `500` — unexpected server/database errors (caught by central error middleware)

## Run locally
```bash
npm install
cp .env.example .env   # then put your MongoDB connection string in .env
npm run dev
```
Open http://localhost:3000/api-docs

## Deploy to Render
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGODB_URI`, `DB_NAME=library`
- Docs: `https://<your-app>.onrender.com/api-docs`

## Team contributions (Week 5)
| Team member | Contribution 1 | Contribution 2 |
|---|---|---|
| Rony | | |
| | | |
