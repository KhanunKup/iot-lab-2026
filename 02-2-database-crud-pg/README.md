# PostgreSQL CRUD API with Hono and Drizzle

A deployable REST API using Hono, PostgreSQL, Drizzle ORM, Zod v4, and Vercel Functions.

## Data model

```text
authors (1) ─────< books (many)

books.author_id → authors.id

students (id, first_name, last_name, student_id [unique], birth_date, gender)
```

Every book must reference an existing author. PostgreSQL prevents deleting an author while books still reference it.

## Local setup

Start a local PostgreSQL database:

```sh
docker run --name iot-lab-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=iot_lab \
  -p 5432:5432 \
  -d postgres:17-alpine
```

Install and prepare the project:

```sh
nvm install 24.14.1
nvm use 24.14.1
npm install
copy .env.example .env
npm run db:migrate
```

On macOS or Linux, use `cp .env.example .env` instead of `copy`.

Run the direct Node.js entrypoint:

```sh
npm run dev
```

Or run the Vercel Function entrypoint and `vercel.json` routing locally:

```sh
npm run vercel:dev
```

Use one development command at a time. Both expose the API at <http://localhost:3000/api/v1> (and <http://localhost:3000/api>).

## Environment variables

```env
SECRET_PASSWORD=iot-lab-2026
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/iot_lab
```

- `SECRET_PASSWORD` protects every `/api/*` route.
- `DATABASE_URL` must be a PostgreSQL connection string.
- Hosted PostgreSQL providers commonly require `sslmode=require` in the URL.
- Never commit `.env` or database credentials.

Every request requires:

```text
Authorization: Bearer iot-lab-2026
Content-Type: application/json
```

## Routes

### Students

| Method | Route | Result |
| --- | --- | --- |
| `GET` | `/api/v1/students` | List all students |
| `GET` | `/api/v1/students/:studentId` | Get a student by ID |
| `POST` | `/api/v1/students` | Create a student |
| `PATCH` / `PUT` | `/api/v1/students/:studentId` | Update student fields |
| `DELETE` | `/api/v1/students/:studentId` | Delete a student |

```json
{
  "firstName": "Somchai",
  "lastName": "Jaidee",
  "studentId": "66070001",
  "birthDate": "2004-05-15",
  "gender": "male"
}
```

### Authors

| Method | Route | Result |
| --- | --- | --- |
| `GET` | `/api/v1/authors` | List authors |
| `GET` | `/api/v1/authors/:authorId` | Get an author and their books |
| `POST` | `/api/v1/authors` | Create an author |
| `PATCH` | `/api/v1/authors/:authorId` | Update an author |
| `DELETE` | `/api/v1/authors/:authorId` | Delete an author without books |

```json
{
  "name": "George Orwell"
}
```

### Books

| Method | Route | Result |
| --- | --- | --- |
| `GET` | `/api/v1/books` | List books with their authors |
| `GET` | `/api/v1/books/:bookId` | Get one book with its author |
| `POST` | `/api/v1/books` | Create a book |
| `PATCH` | `/api/v1/books/:bookId` | Update supplied book fields |
| `DELETE` | `/api/v1/books/:bookId` | Delete a book |

```json
{
  "title": "1984",
  "publishedYear": 1949,
  "authorId": 1
}
```

`publishedYear` is optional and may be `null`. Zod rejects unknown properties and invalid types before controller handlers run.

## Example request

```sh
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer iot-lab-2026" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Somchai","lastName":"Jaidee","studentId":"66070001","birthDate":"2004-05-15","gender":"male"}'
```

## Database commands

```sh
npm run db:generate  # Generate SQL after changing src/db/schema.ts
npm run db:migrate   # Apply pending migrations
npm run db:studio    # Open Drizzle Studio
```

Generated migrations are committed in `drizzle/`. Run migrations against the target database before deploying new application code.
