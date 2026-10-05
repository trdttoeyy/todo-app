# Full-stack To-do App

A simple Express + SQLite to-do app with session authentication and hashed passwords.

## Run locally

1. Install Node.js 18+.
2. Run `npm install`.
3. Run `npm test`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

The SQLite database is created automatically at `data/todo.db` and is ignored by Git.

For production, use a persistent hosted database and a strong `SESSION_SECRET` stored in environment variables.
